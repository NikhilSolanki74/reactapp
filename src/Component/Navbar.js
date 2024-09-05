import React from 'react'
import styles from './CSS/Navbar.module.css'
import { useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from "react-redux";
import { triggerNotification } from './Notification';
import { setUser } from '../Redux/Features/UserSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
const Navbar = (props) => {
  const linedata = useSelector((state)=> state.line);
  const {cart} = useSelector((state)=> state.cart);
  const dispatch = useDispatch()
    const navigate  = useNavigate()
    const userdata = useSelector((state)=> state.user)
    const name =  userdata !== null ? userdata.user.name : 'user';
    const baseurl = process.env.REACT_APP_BASE_URL || ''
  return (
    <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src="https://res.cloudinary.com/dzjvyptwz/image/upload/v1723210998/q2h7mgzdbvi6k0dkjoyr.png" alt="logo" />
          <label>Julissa</label>
        </div>
        <div className={styles.navLinks}>
          <ul className={styles.list}>
            <li className={styles.item1} style={{textDecoration:linedata.l1 ? 'underline' : 'none',textUnderlineOffset:'4px'}} onClick={()=> navigate('/home')}>Home</li>
            <li className={styles.item1} style={{textDecoration:linedata.l2 ? 'underline' : 'none',textUnderlineOffset:'4px'}}>Men</li>
            <li className={styles.item1} style={{textDecoration:linedata.l3 ? 'underline' : 'none',textUnderlineOffset:'4px'}}>Women</li>
            <li className={styles.item1 } style={{textDecoration:linedata.l4 ? 'underline' : 'none',textUnderlineOffset:'4px'}}>Kids</li>
            <li className={styles.item1} style={{textDecoration:linedata.l5 ? 'underline' : 'none',textUnderlineOffset:'4px'}}>My Orders</li>
          </ul>
        </div>
        <div className={styles.profile}>
        <div className={styles.cart} onClick={()=> navigate('/addtocart')}>
        <span style={{display: cart.itemCount > 0 ? " " : "none"}} className={styles.itemCount}>{cart.itemCount}</span>
    <FontAwesomeIcon size='lg' className={styles.icon} icon={faCartShopping} />
        </div>
          <img onClick={()=> navigate('/profile')} src="https://res.cloudinary.com/dzjvyptwz/image/upload/v1723353963/veeznqavduoajqkcvijo.jpg" alt="profile" />
          <label onClick={()=> navigate('/profile')}>{ name}</label>
          <button onClick={()=>{axios.post(`${baseurl}/logout`,{id:userdata.user._id});localStorage.clear();navigate('/');dispatch(setUser(undefined));triggerNotification('Logout Successfully');}} >Log Out</button>
        </div>
      </nav>
  )
}

export default Navbar
