import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import styles from '../CSS/SellerCSS/SellerProduct.module.css'
import { setLine } from '../../Redux/Features/UnderlineSlice';
import SellerNavbar from './SellerNavbar';
import axios from 'axios';
import { triggerNotification } from '../Notification';
import { useNavigate } from 'react-router-dom';
const SellerProduct = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';
  const [products, setProducts] = useState([]);
  // const [c ,sc] = useState({});
  const baseurl = process.env.REACT_APP_SELLER_BASE_URL || '';
    const dispatch = useDispatch();
    useEffect(()=>{
         dispatch(setLine(2))
        axios.post(`${baseurl}/myproduct`,{token:token}).then((response)=>{
         const data = response.data;
          // console.log(data)
          if (data.success) {
            setProducts(data.data);
          }
        }) 
    },[])

    const handleOnMarket = (id) => {
      axios.post(`${baseurl}/changeOnMarket`,{token:token,id:id}).then((response)=>{
        const data = response.data;
        if(data.success){
          triggerNotification(data.msg);
          setProducts((prev)=>{
            return prev.map((data)=>{if(data._id === id){
              return {...data,onMarket:data.onMarket===0?1:0}
            }else{
              return data
            }})})
        }else{
          triggerNotification(data.msg,"error")
        }
      }).catch((err)=>{
        console.log(err);
       triggerNotification("Error in Toggle Change Request","error")
      })
    }

    const handleRemove = (id) => {
      if(!window.confirm("do you Really want to Remove Product Permanently ?")){
       return
      }
      
      axios.post(`${baseurl}/removeproduct`,{token:token,id:id}).then((response)=>{
      //  console.log('ksdajlfsal')
       const data = response.data;
       if(data.success){
         triggerNotification(data.msg)
       setProducts((prev)=>{
           return prev.filter((dt)=>dt._id !== id)}
       )
      

       }else{
       return  triggerNotification(data.msg,"error")

       }


      }).catch((err)=>{
       console.log(err);
      return triggerNotification("Error in Product Remove Request","error")
    })


   }
  return (
    <div className={styles.container}>
      <SellerNavbar/>
     <div className={styles.productcontainer}>
          <div className={styles.productlist}>
          {products.length > 0 ? (
            products.map((product) => (
              <div className={styles.productrow}  key={product._id}>
              <div className={styles.productimage} onClick={()=>navigate(`/productview/?id=${encodeURIComponent(product._id)}`)}>
                <img src={product.image} alt={product.product}  className={styles.image}/>
              </div>
                <div className={styles.productdetails}>
                  <h3>{product.product} </h3>
                  <p>Price: {product.price} Rs</p>
                </div>
                <div className={styles.marketcontrol}>
                <button className={styles.remove} onClick={()=>handleRemove(product._id)}>Remove Product</button>
                  <label className={styles.switch}>
                    <input type="checkbox" onClick={()=> handleOnMarket(product._id)} checked={product.onMarket === 1} />
                    <span className={styles.slider}></span> 
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.nodata}>

            <p>No Data Found</p>
            <img src='https://res.cloudinary.com/dzjvyptwz/image/upload/v1725337550/ekdkdotyapehwmmhfuai.png'/>
            </div>
          )}
          </div>
     </div>
    </div>
  )
}

export default SellerProduct
