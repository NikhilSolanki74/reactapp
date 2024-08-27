import React, { useEffect } from 'react'
import AdminNavbar from '../AdminComponent/AdminNavbar'
import styles from '../CSS/AdminCSS/AdminHomepage.module.css'
import { useSelector ,useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setLine } from '../../Redux/Features/UnderlineSlice'
const AdminHomepage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const userdata = useSelector((state)=> state.user)

  useEffect(()=>{dispatch(setLine(1))},[])
  return (
    <div className={styles.container}>
    <AdminNavbar/>
    <div className={styles.content}>
      <h1>Welcome, {userdata.user.name} to the Admin Panel</h1>
      <button onClick={()=> {dispatch(setLine(2)); navigate('/userpanel')}}>Go To Registered User Panel</button>
    </div>
      
    </div>
  )
}

export default AdminHomepage
