import React from 'react'
import styles from './CSS/Navbar.module.css'
import { useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from "react-redux";
import { triggerNotification } from './Notification';
import { setUser } from '../Redux/Features/UserSlice'
import axios from 'axios';
const Navbar = () => {
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
            <li className={styles.item1} onClick={()=> navigate('/home')}>Home</li>
            <li className={styles.item1}>About us</li>
            <li className={styles.item1}>Services</li>
            <li className={styles.item1}>Project</li>
            <li className={styles.item1}>Articles</li>
          </ul>
        </div>
        <div className={styles.profile}>
          <img onClick={()=> navigate('/profile')} src="https://res.cloudinary.com/dzjvyptwz/image/upload/v1723353963/veeznqavduoajqkcvijo.jpg" alt="profile" />
          <label onClick={()=> navigate('/profile')}>{ name}</label>
          <button onClick={()=>{axios.post(`${baseurl}/logout`,{id:userdata.user._id});localStorage.clear();navigate('/');dispatch(setUser(undefined));triggerNotification('Logout Successfully');}} >Log Out</button>
        </div>
      </nav>
  )
}

export default Navbar
