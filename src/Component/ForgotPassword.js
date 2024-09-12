import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons'; 
import styles from './CSS/ForgotPassword.module.css';
import { triggerNotification } from './Notification';
import axios from 'axios';
import Loading2 from './Loading2';
const ForgotPassword = () => {
  const [loading  , setLoading] = useState(false);
  const baseurl = process.env.REACT_APP_BASE_URL || '';
  const [otpbutton , setOtpButton] = useState({dis:false,name:'Change Password'})
  const form = useRef();
  const [inputVisibility ,setInputVisibility] = useState(true);
  const [data, setData] = useState({
    otp: '',
    newpassword: '',
    confirmpassword: '',
    email:''
  });
  
 const validEmail = new RegExp(
  '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
);

const handleOTP =async ()=>{
  setLoading(true)
if(validEmail.test(data.email)){
  setOtpButton({dis:true,name:'Loading...'})
  await axios.post(baseurl+'/getotp',{email:data.email}).then((response)=>{
    setLoading(false)
const data = response.data; 
if(data.success){
  setLoading(false)
  setOtpButton({dis:true,name:'Change Password'})
  setInputVisibility(false)
 
 return triggerNotification(data.msg)
}else{
  setLoading(false)
  setOtpButton({dis:false,name:'Change Password'})
  setData((e)=>{return {...e, email:''}})
 return triggerNotification(data.msg , 'error')
}
  })
}else{
  setLoading(false)
  triggerNotification('Email is not valid','error')
}
}
  return (
    <div className={styles.container}>
      <div className={styles.dropdowndiv}>
        <select className={styles.dropdown}>
          <option className={styles.opt}>India</option>
          <option className={styles.opt}>Nepal</option>
          <option className={styles.opt}>Pakistan</option>
          <option className={styles.opt}>China</option>
        </select>
      </div>
      <form
        ref={form}
        className={styles.forgotPasswordContainer}
        onSubmit={(e) => {
          e.preventDefault();
          
        }}
      >
        <h2>Forgot Password</h2>
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faLock} className={styles.icon} />
          <input
            placeholder="Type your Email"
            type='email'
            onChange={(e) =>
              setData((dt) => {
                return { ...dt, email: e.target.value };
              })
            }
            required
             disabled={!inputVisibility}
          />
         
        </div>
        {loading ? <Loading2/> : ''}
        <button type="submit" style={{width:'65%'}} onClick={()=>{handleOTP()}} className={styles.otpButton} disabled={otpbutton.dis}>
         { otpbutton.name}
        </button>
        <a className={styles.floginLink} href="/">
          Return to Login
        </a>
      </form>
    </div>
  );
};

export default ForgotPassword;
