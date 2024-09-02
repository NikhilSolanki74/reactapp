import React from 'react'
import styles from '../CSS/SellerCSS/SellerNavbar.module.css'
import { useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from "react-redux";
import { triggerNotification } from '../Notification';
import { setUser } from '../../Redux/Features/UserSlice'
import { reset } from '../../Redux/Features/ProductSlice';
import axios from 'axios';
const SellerNavbar = () => {
  const linedata = useSelector((state)=> state.line)
  const dispatch = useDispatch()
    const navigate  = useNavigate()
    const userdata = useSelector((state)=> state.user)
    const name =  userdata !== null ? userdata.user.name : 'user';
    const baseurl = process.env.REACT_APP_SELLER_BASE_URL || ''
  return (
    <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src="https://res.cloudinary.com/dzjvyptwz/image/upload/v1723210998/q2h7mgzdbvi6k0dkjoyr.png" alt="logo" />
          <label>Julissa</label>
        </div>
        <div className={styles.navLinks}>
          <ul className={styles.list}>
            <li className={styles.item1} style={{textDecoration:linedata.l1 ? 'underline' : 'none',textUnderlineOffset:'4px'}}  onClick={()=> navigate('/sellerhome')}>Home</li>
            <li className={styles.item1} style={{textDecoration:linedata.l4 ? 'underline' : 'none',textUnderlineOffset:'4px'}} onClick={()=> navigate('/addproduct')}>Add Product</li>
            <li className={styles.item1} style={{textDecoration:linedata.l2 ? 'underline' : 'none',textUnderlineOffset:'4px'}}>My Products</li>
            <li className={styles.item1 } style={{textDecoration:linedata.l3 ? 'underline' : 'none',textUnderlineOffset:'4px'}}>My Orders</li>
          </ul>
        </div>
        <div className={styles.profile}>
          <img onClick={()=> navigate('/sellerprofile')} src="https://res.cloudinary.com/dzjvyptwz/image/upload/v1723353963/veeznqavduoajqkcvijo.jpg" alt="profile" />
          <label onClick={()=> navigate('/sellerprofile')}>{ name}</label>
          <button onClick={()=>{axios.post(`${baseurl}/logout`,{id:userdata.user._id});dispatch(setUser(undefined));dispatch(reset());localStorage.clear();navigate('/');triggerNotification('Logout Successfully');}} >Log Out</button>
         
        </div>
      </nav>
  )
}

export default SellerNavbar;
