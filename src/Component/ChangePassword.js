
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faKey,faCheck } from '@fortawesome/free-solid-svg-icons'; 
import styles from './CSS/ChangePassword.module.css';
import { triggerNotification } from './Notification';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';

const ChangePassword = () => {
  const baseurl = process.env.REACT_APP_BASE_URL || '';
    const location = useLocation();
  const navigate = useNavigate();
  const form = useRef();

  const [data, setData] = useState({
   token:'',
    newpassword: '',
    confirmpassword: '',
    email:''
  });

  useEffect(()=>{
    const query = new URLSearchParams(location.search)
    // console.log(query)
    const email = query.get('email') || '';
    const token = query.get('token') || '';
    // console.log(email,token)
    
    if(token === '' || email === ''){
      return navigate('/')
    }
    setData((pre)=>{return{...pre , email:email,token:token}})

  },[])
  
  const [type  , settype] = useState('password')

   const showpass = ()=>{
     if(type === 'password'){
       settype('text')
 
     }else{
       settype('password')
     }
   }

  const validPassword = new RegExp('^(?=.*?[A-Za-z0-1]).{6,20}$');


  const handleSubmit = async () => {
    if (data.newpassword === data.confirmpassword) {
      
      if (!validPassword.test(data.newpassword)) {
        return triggerNotification('New Password is not valid', 'error');
      }
     await axios.post(baseurl+'/changepassword',data).then((response)=>{
      const data = response.data;
       if(data.success){
           navigate('/')
           return triggerNotification(data.msg)
       }else{
        navigate('/')
         return triggerNotification(data.msg,'error')
       }
      })
      
    } else {
      triggerNotification('Confirm Password does not match!', 'error');
    }
  };

  return (
    <div className={styles.container}>
      
      <form
        ref={form}
        className={styles.forgotPasswordContainer}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h2>Change Password </h2>
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faLock} className={styles.icon} />
          <input style={{color:'white',border:'1px solid grey #656565'}}
            placeholder="Type your Email" 
            type='email'
            value={data.email ? data.email : ''}
            onChange={(e) =>
              setData((dt) => {
                return { ...dt, email: e.target.value };
              })
            }
            required disabled={true}
          />
         
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
        <div style={{textDecoration:'none' }} className={styles.loginLink}>
        Show Password &nbsp; <input onChange={()=>showpass()} type='checkbox' ></input>
        </div>
        <button type="submit" className={styles.submitButton} >
          Submit
        </button>
        <a className={styles.floginLink} href="/">
          Return to Login
        </a>
      </form>
    </div>
  );
};

export default ChangePassword;
