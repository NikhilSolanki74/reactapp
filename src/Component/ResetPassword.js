import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faKey,faCheck,faEnvelope } from '@fortawesome/free-solid-svg-icons'; 
import styles from './CSS/ResetPassword.module.css';
import { triggerNotification } from './Notification';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading2 from './Loading2';
const ResetPassword = () => {
  const [loading , setLoading ] = useState(false)
  const baseurl = process.env.REACT_APP_BASE_URL || '';
  const navigate = useNavigate();
  const form = useRef();
 const [type  , settype] = useState('password')

   const showpass = ()=>{
     if(type === 'password'){
       settype('text')
 
     }else{
       settype('password')
     }
   }



  const [data, setData] = useState({
    currentpassword: '',  
    newpassword: '',
    confirmpassword: '',
    email:'',
  });

  const validPassword = new RegExp('^(?=.*?[A-Za-z0-1]).{6,20}$');
  const validEmail = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
  );
  const handleSubmit = async () => {
    setLoading(true)
    if (data.newpassword === data.confirmpassword) {
      if (!validEmail.test(data.email)) {
        setLoading(false)
        return triggerNotification('your Email is not valid', 'error');
      }
      if (!validPassword.test(data.currentpassword)) {
        setLoading(false)
        return triggerNotification('Current Password is not valid', 'error');
      }
      if (!validPassword.test(data.newpassword)) {
        setLoading(false)
        return triggerNotification('New Password is not valid', 'error');
      }

       await axios.post(baseurl+'/resetpassword',data).then((response)=>{
        setLoading(false)
          const data = response.data
          if(data.success){
            setLoading(false)
            navigate('/');
             return triggerNotification(data.msg)
             
          }else{
            setLoading(false)
           return triggerNotification(data.msg, 'error')
          }
       }).catch((err)=>{
        setLoading(false)
        console.log(err);
        triggerNotification("server not Reachable! ",'error')

       }).finally(()=>{
        setLoading(false)
       })
 
    } else {
      setLoading(false)
      triggerNotification('Confirm Password does not match!', 'error');
    }
  };

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
          handleSubmit();
        }}
      >
        <h2>Reset Password</h2>
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
          <input 
            placeholder="Email"
            type='email'
            onChange={(e) =>
              setData((dt) => {
                return { ...dt, email: e.target.value };
              })
            }
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faLock} className={styles.icon} />
          <input 
            placeholder="Current Password"
            type={type}
            id="password"
            onChange={(e) =>
              setData((dt) => {
                return { ...dt, currentpassword: e.target.value };
              })
            }
            required
          />
          <a className={styles.loginLink} href="/forgotpassword">
            Choose Different Way
          </a>
        </div>
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faKey} className={styles.icon} />
          <input 
            placeholder="New Password"
            type={type}
            id="newpassword"
            onChange={(e) =>
              setData((dt) => {
                return { ...dt, newpassword: e.target.value };
              })
            }
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faCheck} className={styles.icon} />
          <input
            placeholder="Confirm New Password"
            type={type}
            id="confirmpassword"
            onChange={(e) =>
              setData((dt) => {
                return { ...dt, confirmpassword: e.target.value };
              })
            }
            required
          />
        </div>
        <div style={{textDecoration:'none'}} className={styles.loginLink}>
        Show Password &nbsp; <input onChange={()=>showpass()} type='checkbox'></input>
        </div>
        {loading ? <Loading2/> : ''}
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
        <a className={styles.floginLink} href="/">
          Return to Login
        </a>
      </form>
    </div>
  );
};

export default ResetPassword;
