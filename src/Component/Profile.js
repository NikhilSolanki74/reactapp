import React from 'react'
import styles from './CSS/Profile.module.css'
import Navbar from './Navbar'
import { useSelector,useDispatch } from 'react-redux';

const Profile = () => {
    const usedata = useSelector((state)=>state.user)
    console.log(usedata,'hello')
  return (
    <div className={styles.container}>
    <Navbar/>
    <div className={styles.profileprimary}>
    <div className={styles.profilediv}>
    <div className={styles.image}>
      <img src="https://res.cloudinary.com/dzjvyptwz/image/upload/v1723353963/veeznqavduoajqkcvijo.jpg" alt="profile picture" />

    </div>
      <div className={styles.details}>
    <label>Name: &nbsp;&nbsp;<span>{usedata.user.name}</span></label>
    <label>Email: &nbsp;&nbsp; <span>{usedata.user.email}</span></label>
    <label>Contact: <span>{usedata.user.contact}</span></label>
</div>

        <div className={styles.btn}>
            <button className={styles.edit}>Edit Profile</button>
        <button className={styles.rmv}>Remove Account</button>
        </div>
    </div>
    </div>
    </div>
  )
}

export default Profile
