import React, { useEffect, useState } from 'react'
import SellerNavbar from './Navbar'
import { useSelector,useDispatch } from 'react-redux'
import { setLine } from '../Redux/Features/UnderlineSlice'  
import styles  from './CSS/ProductViewu.module.css'
import { useLocation ,useNavigate} from 'react-router-dom'
import { triggerNotification } from './Notification'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { setCart } from '../Redux/Features/UserCartSlice';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import axios from 'axios'
const ProductViewu = () => {
  const cart = useSelector((state)=> state.cart )
 
  const navigate  = useNavigate();
    const [hookImage ,setHookImage] = useState('');
    const dispatch = useDispatch();
    dispatch(setLine(0));
    const [data , setData] = useState({});  
    const token = localStorage.getItem('token') || '';
   const baseurl = process.env.REACT_APP_BASE_URL || '';
    const location = useLocation();
    const [ids, setids] = useState({...cart.cart.itemsId}) 
  // const [count , setCount] = useState(cart.itemCount)
  //  console.log(ids,'ggg')
 

      useEffect(()=>{
       const query = new URLSearchParams(location.search)
      //  console.log(query)
       const id = query.get('id') || '';
       if(id === '' || token === ''){
      return  triggerNotification('something went wrong','info')
       }
       axios.post(`${baseurl}/getproductdetail`, {token:token , id:id}).then((response)=>{
         const datas = response.data;
         if(datas.success){
             setData(datas.data); 
             setHookImage(datas.data.image)  ;
            //  console.log(data);
         }else{
            triggerNotification(datas.msg,'error')
         }
        //  console.log(data);
       }).catch((err)=>{
        console.log(err)
        triggerNotification('Error in Sending Request !','error')
       })
      },[])


      const handleatc = (id)=>{
        axios.post(`${baseurl}/addtocart`,{token:token, id:id}).then((response)=>{
          const data =  response.data;
          if(data.success){
           triggerNotification(data.msg);
               const newdata = data.data;
               dispatch(setCart({itemCount:newdata.itemCount,itemsId:newdata.itemsId}))
              //  setCount(newdata.itemCount);
               setids(newdata.itemsId)
          }else{
             triggerNotification(data.msg,'error')
          }
        }).catch((err)=>{
   console.log(err);
        })
      }

      const handlebuy = (id) =>{
        // console.log(cart.itemsId,'dk');
        // console.log(ids);
         if(!ids.hasOwnProperty(id)){
          axios.post(`${baseurl}/addtocart`,{token:token, id:id}).then((response)=>{
            const data =  response.data;
            if(data.success){
            //  triggerNotification(data.msg);
                 const newdata = data.data;
                 dispatch(setCart({itemCount:newdata.itemCount,itemsId:newdata.itemsId}))
                //  setCount(newdata.itemCount);
                 setids(newdata.itemsId)
            }else{
               triggerNotification(data.msg,'error')
            }
          }).catch((err)=>{
     console.log(err);
          }).finally(()=>{
           return navigate("/addtocart")
          })
         }else{

           return navigate("/addtocart")
         }
      }
    
  return (
    <div className={styles.container}>
    <SellerNavbar/>
      <div className={styles.productdiv}>
        <div className={styles.productdetail}>
        <FontAwesomeIcon icon={faXmark} className={styles.icon} size="lg" style={{color: "#000000"}} onClick={()=> navigate('/home')}/>
        <div className={styles.imagediv}>
         <div className={styles.shortimage}>
             {data.image && <div className={styles.singleimage}><img  onClick={()=> setHookImage(data.image)} className={styles.idiv} src={data.image} alt=' '/></div>}
           {data.images && data.images.map((img)=>{
               return (
                <div className={styles.singleimage}>
                <img onClick={()=> setHookImage(img)} className={styles.idiv} src={img} alt=' '/>

                </div>
               )
           })}
         </div>
          <div className={styles.showimage}>
          <Zoom>
           {data.image && <img className={styles.simg} src={hookImage} alt=' '/>}
          </Zoom>
          </div>
        </div>
        <div className={styles.textdiv}>
                        <div className={styles.hero}> 
                            <h2 className={styles.productName}>{data.product}</h2>
                            <p className={styles.description}>{data.description}</p>
                            <div className={styles.priceStock}>
                                <span className={styles.price}>Price: <span>{data.price}</span> Rs</span>
                                <span className={styles.stock}>In Stock: <span>{data.stock}</span></span>
                            </div>
                            <div className={styles.sellerInfo}>
                                <span className={styles.sellerName}>Seller: {data.sellerName}</span>
                                <button className={styles.btn} onClick={()=>handlebuy(data._id)}>Buy Now</button>
                                {!ids[data._id] && <button className={styles.atc} onClick={()=>handleatc(data._id)} >Add To Cart</button>}
                            </div>
                        </div>
                    </div>
        </div>
      </div>
    </div>
  )
}

export default ProductViewu
