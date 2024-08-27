import React, { useEffect } from 'react'
import styles from '../CSS/AdminCSS/AdminProfile.module.css'
import AdminNavbar from './AdminNavbar'
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { triggerNotification } from '../Notification';
import { setUser } from '../../Redux/Features/UserSlice';
import { setLine } from '../../Redux/Features/UnderlineSlice';
const AdminProfile = () => {
  const baseurl = process.env.REACT_APP_ADMIN_BASE_URL || '';
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const usedata = useSelector((state)=>state.user)
    const handleEdit=()=>{
      navigate('/adminedit')
    }
  useEffect(()=>{dispatch(setLine(0))},[]);
  
  const handleRemove=()=>{
    if(!window.confirm('Do you really want to Delete your Account Permanently !')){
        return 
    }
    const id = usedata.user._id || '';
        if(id){
            axios.post(baseurl+'/removeaccount', {data:id}).then((response)=>{
                const data = response.data;
                if(data.success){
                    dispatch(setUser(undefined));
                    localStorage.clear();
                     navigate('/');
                  return  triggerNotification(data.msg)
                }else{
                    triggerNotification(data.msg,'error')
                   return navigate('/adminhomepage')
                }
            }).catch((err)=>{
                console.log(err)
                return triggerNotification('Error in Request Submit', 'error')
            })
        }else{
            triggerNotification("Error Occured !")
        }
  
  
      
  }
  return (
    <div className={styles.container}>
    <AdminNavbar/>
    <div className={styles.profileprimary}>
    <div className={styles.profilediv}>
    <div className={styles.image}>
      <img src="https://res.cloudinary.com/dzjvyptwz/image/upload/v1723353963/veeznqavduoajqkcvijo.jpg" alt="" />

    </div>
      <div className={styles.details}>
    <label>Name: &nbsp;&nbsp;<span>{usedata.user.name}</span></label>
    <label>Id: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{usedata.user._id}</span></label>
    <label>Email: &nbsp;&nbsp; <span>{usedata.user.email}</span></label>
    <label>Contact: <span>{usedata.user.contact}</span></label>
</div>

        <div className={styles.btn}>
            <button onClick={()=> handleEdit()} className={styles.edit}>Edit Profile</button>
        <button onClick={()=> handleRemove()} className={styles.rmv}>Remove Account</button>
        </div>
    </div>
    </div>
    </div>
  )
}

export default AdminProfile
