import React, { useEffect, useState } from 'react'
import SellerNavbar from './SellerNavbar'
import { useSelector,useDispatch } from 'react-redux'
import { setLine } from '../../Redux/Features/UnderlineSlice'
import styles  from '../CSS/SellerCSS/ProductView.module.css'
import { useLocation } from 'react-router-dom'
import { triggerNotification } from '../Notification'
import Zoom from 'react-medium-image-zoom';
import axios from 'axios'
const ProductView = () => {
    const [hookImage ,setHookImage] = useState('');
    const dispatch = useDispatch();
    dispatch(setLine(0));
    const [data , setData] = useState({});  
    const token = localStorage.getItem('token') || '';
   const baseurl = process.env.REACT_APP_SELLER_BASE_URL || '';
    const location = useLocation();
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

    
  return (
    <div className={styles.container}>
    <SellerNavbar/>
      <div className={styles.productdiv}>
        <div className={styles.productdetail}>
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
                                <span className={styles.stock}>Stock: <span>{data.stock}</span></span>
                            </div>
                            <div className={styles.sellerInfo}>
                                <span className={styles.sellerName}>Seller: {data.sellerName}</span>
                                {/* <button className={styles.btn}>Buy Now</button> */}
                            </div>
                            {/* <div className={styles.status}>
                                <span>Status: {data.onMarket ? 'Available' : 'Not Available'}</span>
                            </div> */}
                        </div>
                    </div>
        </div>
      </div>
    </div>
  )
}

export default ProductView
