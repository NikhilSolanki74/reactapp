import React from 'react';
import styles from './CSS/Homepage.module.css';
import Navbar from './Navbar';
import ProductCardu from './ProductCardu';
import  { useEffect, useState } from 'react';
import axios from 'axios';
import { triggerNotification } from './Notification';
import {setProduct} from '../Redux/Features/ProductSlice';
import {setLine} from '../Redux/Features/UnderlineSlice'
import { setProductData,setTheseProductsOnly } from '../Redux/Features/ProductDataSlice';
import { useSelector,useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { setCart } from '../Redux/Features/UserCartSlice';
import Loader from './Loader';
const Homepage = () => {
  
  const dispatch = useDispatch();
  const {product} = useSelector((state)=> state.product)
  const {products} = useSelector((state)=> state.products)
  const {cart} = useSelector((state)=> state.cart)
  const [chk ,setchk] = useState(product.more);
  const [count , setCount] = useState(cart.itemCount)
  const [ncheck, setncheck] = useState(false);
   const baseurl = process.env.REACT_APP_BASE_URL;
   const token = localStorage.getItem('token');
   const [ids, setids] = useState({...cart.itemsId})
const userdata = useSelector((state)=> state.user)

useEffect(()=>{
 dispatch(setLine(1));  
 if(product.ck){
   setncheck(true)
    dispatch(setProduct({ck:false}))
   axios.post(`${baseurl}/getproductdata`,{token:token,offset:product.offset,limit:product.limit}).then((response)=>{
       const data = response.data;
       if(data.success){
         setncheck(false)
         setchk(data.more)
         dispatch(setProduct({count:data.count,offset:product.offset+product.limit,more:data.more}));
         dispatch(setTheseProductsOnly(data.productdata));
       }else{
         setncheck(false);
         triggerNotification('Data not Fetched',"error")
       }
   }).catch((err)=>{
  console.log(err);
  triggerNotification("Error in Data Fetching Request !","info")

   }).finally(()=>{
     setncheck(false)

   }
   )
 }


},[])


const run = () =>{
 axios.post(`${baseurl}/getproductdata`,{token:token,offset:product.offset,limit:product.limit}).then((response)=>{
   const data = response.data;
   if(data.success){
     setncheck(false)
     setchk(data.more)
     dispatch(setProduct({count:data.count,more:data.more}));
     dispatch(setProductData(data.productdata));
   }else{
     setncheck(false);
     triggerNotification('Data not Fetched',"error")
   }
}).catch((err)=>{
  console.log(err);
  triggerNotification("Error in Data Fetching Request !","info")

   }).finally(()=>setncheck(false))
}

const loadMore = () => {
  setncheck(true);
 console.log(products)
 dispatch(setProduct({offset:product.offset+product.limit}))
 run();
}

const handleAddCart = (id)=>{
  dispatch(setCart({itemCount:count+1,itemsId:{...ids,[id]:1}}))
         setCount(count+1);
         setids({...ids,[id]:1})
     axios.post(`${baseurl}/addtocart`,{token:token, id:id}).then((response)=>{
       const data =  response.data;
       if(data.success){
        triggerNotification(data.msg);
            const newdata = data.data;
            dispatch(setCart({itemCount:newdata.itemCount,itemsId:newdata.itemsId}))
            setCount(newdata.itemCount);
            setids(newdata.itemsId)
       }else{
          triggerNotification(data.msg,'error')
       }
     }).catch((err)=>{
console.log(err);
     })
}


const name =  userdata !== null ? userdata.user.name : 'user';

 return (
   <div className={styles.container}>
   <Navbar count={count}/> 
   <div className={styles.productGrid}>
       {products.map((productD) => (
         <ProductCardu key={productD._id} product={productD} url={'/productviewu'} handleAddCart={handleAddCart} ids={ids}/>
       ))}
     </div>
     <div className={styles.loadmorediv}>
     {ncheck && <Loader/>}
     <button className={styles.button} type="button" onClick={()=>loadMore()} disabled={!chk}>{chk ?'Load More':"No More Result"} <FontAwesomeIcon icon={faAngleDown} /></button>
     </div>
   </div>
 );
};

export default Homepage;
