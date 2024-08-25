import React, { useState } from 'react'
import styles from '../CSS/AdminCSS/AdminNavbar.module.css'
import { useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from "react-redux";
import { triggerNotification } from '../Notification';
import { setUser } from '../../Redux/Features/UserSlice'
const AdminNavbar = () => {
  const [line, setLine] = useState({l1:true,l2:false})
  const dispatch = useDispatch()
    const navigate  = useNavigate()
    const userdata = useSelector((state)=> state.user)
    const name =  userdata !== null ? userdata.user.name : 'user';
  return (
    <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src="https://res.cloudinary.com/dzjvyptwz/image/upload/v1723210998/q2h7mgzdbvi6k0dkjoyr.png" alt="logo" />
          <label>Julissa</label>
        </div>
        <div className={styles.navLinks}>
          <ul className={styles.list}>
            <li className={styles.item1} style={{textDecoration:line.l1 ? 'underline' : 'none'}} onClick={()=> {setLine({l1:true,l2:false});setTimeout(()=>{navigate('/adminhomepage')},1) ;}}>Home</li>
            <li className={styles.item2}  style={{textDecoration:line.l2 ? 'underline' : 'none'}} onClick={()=>{ setLine({l1:false,l2:true});setTimeout(()=>{navigate('/userpanel')},1000);}}>User Panel</li>
            <li className={styles.item3}  style={{textDecoration:''}} >Analytics</li>
          </ul>
        </div>
        <div className={styles.profile}>
          <img onClick={()=> navigate('/adminprofile')} src="https://res.cloudinary.com/dzjvyptwz/image/upload/v1723353963/veeznqavduoajqkcvijo.jpg" alt="profile" />
          <label onClick={()=> navigate('/adminprofile')}>{ name}</label>
          <button onClick={()=>{localStorage.clear();dispatch(setUser(undefined));navigate('/');triggerNotification('Logout Successfully')}} >Log Out</button>
        </div>
      </nav>
  )
}

export default AdminNavbar
