import React from 'react'
import AdminNavbar from '../AdminComponent/AdminNavbar'
import styles from '../CSS/AdminCSS/AdminHomepage.module.css'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const AdminHomepage = () => {
  const navigate = useNavigate();
  const userdata = useSelector((state)=> state.user)
  return (
    <div className={styles.container}>
    <AdminNavbar/>
    <div className={styles.content}>
      <h1>Welcome, {userdata.user.name} to the Admin Panel</h1>
      <button onClick={()=> navigate('/userpanel')}>Go To Registered User Panel</button>
    </div>
      
    </div>
  )
}

export default AdminHomepage
