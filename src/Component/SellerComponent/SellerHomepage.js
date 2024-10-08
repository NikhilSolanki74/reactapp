import React, { useEffect, useState } from 'react';
import styles from '../CSS/SellerCSS/SellerHomepage.module.css';
import SellerNavbar from './SellerNavbar';
import axios from 'axios';
import ProductCard from '../../ProductCard';
import { triggerNotification } from '../Notification';
import {setProduct} from '../../Redux/Features/ProductSlice';
import {setLine} from '../../Redux/Features/UnderlineSlice'
import { setProductData,setTheseProductsOnly } from '../../Redux/Features/ProductDataSlice';
import { useSelector,useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import Loader from '../Loader';
import { useWebSocket } from '../../WebSocketProvider'
import Loading2 from '../Loading2';

const SellerHomepage = () => {
  const [loading , setLoading] = useState(false)

 const {ws} = useWebSocket();

   const {product} = useSelector((state)=> state.product)
   const {products} = useSelector((state)=> state.products)
   const [chk ,setchk] = useState(product.more);
   const [ncheck, setncheck] = useState(false);
   const dispatch = useDispatch();
  // const 
    const baseurl = process.env.REACT_APP_SELLER_BASE_URL;
    const token = localStorage.getItem('token');
    
const userdata = useSelector((state)=> state.user)

useEffect(()=>{
  
  dispatch(setLine(1));  
  if(product.ck ){
    setLoading(true)
    // dispatch(setProductData([]));
    setncheck(true)
     dispatch(setProduct({ck:false}))
    axios.post(`${baseurl}/getproductdata`,{token:token,offset:product.offset,limit:product.limit}).then((response)=>{
      setLoading(false)
        const data = response.data;
        if(data.success){
          setLoading(false)
          setncheck(false)
          setchk(data.more)
          dispatch(setProduct({count:data.count,offset:product.offset+product.limit,more:data.more}));
          dispatch(setTheseProductsOnly(data.productdata));
        }else{
          setLoading(false)
          setncheck(false);
          triggerNotification('Data not Fetched',"error")
        }
    }).finally(()=>{
      setLoading(false)
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
}).finally(()=>setncheck(false))
}

const loadMore = () => {
   setncheck(true);
  console.log(products)
  dispatch(setProduct({offset:product.offset+product.limit}))
  run();
}

const name =  userdata !== null ? userdata.user.name : 'user';
  return (
    <div className={styles.container}>
    <SellerNavbar/> 
    <div className={styles.productGrid}>
        {loading ? <Loading2/> : products.map((productD) => (
          <ProductCard key={productD._id} product={productD} />
        ))}
      </div>
      <div className={styles.loadmorediv}>
      {ncheck && <Loader/>}
      <button className={styles.button} type="button" onClick={()=>loadMore()} disabled={!chk}>{chk ?'Load More':"No More Result"} <FontAwesomeIcon icon={faAngleDown} /></button>
      </div>
    </div>
  );
};

export default SellerHomepage;

