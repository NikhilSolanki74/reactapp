import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import styles from '../CSS/SellerCSS/SellerProduct.module.css'
import { setLine } from '../../Redux/Features/UnderlineSlice';
import SellerNavbar from './SellerNavbar';
const SellerProduct = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
         dispatch(setLine(2))
    },[])
  return (
    <div className={styles.container}>
      <SellerNavbar/>
     <div className={styles.productcontainer}>
          <div className={styles.productlist}>

          </div>
     </div>
    </div>
  )
}

export default SellerProduct
