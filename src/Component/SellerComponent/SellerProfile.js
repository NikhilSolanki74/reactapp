import React from 'react'
import styles from '../CSS/SellerCSS/SellerProfile.module.css';
import Navbar from '../SellerComponent/SellerNavbar'
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { triggerNotification } from '../Notification';
import { setUser } from '../../Redux/Features/UserSlice';
import { setLine } from '../../Redux/Features/UnderlineSlice';
import { useConfirm } from '../../ConfirmWindow'

const SellerProfile = () => {
  const { confirm,ConfirmWindow } = useConfirm();
  const baseurl = process.env.REACT_APP_SELLER_BASE_URL || '';
    const dispatch = useDispatch()
    dispatch(setLine(0));
    const navigate = useNavigate()
    const usedata = useSelector((state)=>state.user)
    const handleEdit=()=>{
      navigate('/selleredit')
    }
  
  
  const handleRemove=async ()=>{
    if(!await confirm('Do you really want to Delete your Account Permanently !')){
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
                   return navigate('/sellerhome')
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
    <Navbar/>
    <ConfirmWindow/>
    <div className={styles.profileprimary}>
    <div className={styles.profilediv}>
    <div className={styles.image}>
      <img src="https://res.cloudinary.com/dzjvyptwz/image/upload/v1723353963/veeznqavduoajqkcvijo.jpg" alt="" />

    </div>
      <div className={styles.details}>
    <label>Name: &nbsp;&nbsp;<span>{usedata.user.name}</span></label>
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

export default SellerProfile;
