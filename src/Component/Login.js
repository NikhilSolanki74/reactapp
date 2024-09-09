import React, { useState, useRef } from 'react';
import axios from 'axios';
import styles from './CSS/Login.module.css';
import { triggerNotification } from './Notification';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import { setProductData } from '../Redux/Features/ProductDataSlice';
import { useDispatch } from 'react-redux';
const Login = () => {
  const dispatch = useDispatch();
  const baseurl = process.env.REACT_APP_BASE_URL || '';
  
  const navigate = useNavigate();
  const form = useRef();
  const [data, setData] = useState({ email: '', password: '',country:'India' });

  const [type  , settype] = useState('password')

  const showpass = ()=>{
    if(type === 'password'){
      settype('text')

    }else{
      settype('password')
    }
  }
const [caps , setCaps] = useState(false);

const handlecaps =(e)=>{
    setCaps(e.getModifierState("CapsLock"))
}

  const validEmail = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
  );
  const validPassword = new RegExp('^(?=.*?[A-Za-z0-1]).{6,20}$');



const handleSubmit = async () => {
  try {
   dispatch(setProductData([]));
    if (validEmail.test(data.email) && validPassword.test(data.password)) {
      const response = await axios.post(`${baseurl}/login`, data);
      const dat = response.data;
      
      if (dat.success) {
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
        }
       localStorage.setItem('token', dat.token);
     
        if (dat.status === '1') {
          navigate('/adminhomepage');
          return triggerNotification('Welcome to Admin Panel');
        } else if(dat.status === '0') {
          navigate('/home');
          return triggerNotification(dat.msg);
        }else if (dat.status === '2'){
          navigate('/sellerhome');
          return triggerNotification(dat.msg);
        }
      } else {
        return triggerNotification(dat.msg, 'error');
      }
    } else {
      triggerNotification('Email or password is wrong!', 'error');
    }
  } catch (err) {
    console.error('Error in sending the request', err); // Log the error for debugging
    triggerNotification('Server is Not Reachable !', 'error'); // Notify the user of the error
  }
};


  return (
    <div className={styles.loginPage}>
    <div className={styles.dropdowndiv}>
      <select value={data.country} onChange={(e)=> setData((dt)=>{return {...dt,country:e.target.value}})} className={styles.dropdown}>
        <option value={'India'} className={styles.opt}>India</option>
        <option value={"Nepal"} className={styles.opt}>Nepal</option>
        <option value={'Pakistan'} className={styles.opt}>Pakistan</option>
        <option value={'China'} className={styles.opt}>China</option>
      </select>
    </div>
      <div className={styles.loginContainer}>
      <div className={styles.caps} style={{display:caps ? " " : 'none'}}><FontAwesomeIcon icon={faCircle} size="2xs" style={{color: "#0bf427"}} /> &nbsp;Caps Lock</div>
        <h2>Login</h2>
        <form ref={form} action="/" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className={styles.inputGroup}>
            <input type="text" placeholder="Username"  onChange={(e) =>{ setData((dt) => {return ({ ...dt, email: e.target.value })})}} onKeyDown={(e)=> handlecaps(e)}  required />
            <span className={styles.icon}>&#xf007;</span>
          </div>
          <div className={styles.inputGroup}>
            <input type={type} placeholder="Password"  onChange={(e) =>{ setData((dt) => { return ( { ...dt, password: e.target.value })})}} onKeyDown={(e)=> handlecaps(e)} required />
            <span className={styles.icon}>&#xf023;</span>
          </div>
          <div className={styles.options}>
            <a href="/resetpassword">Reset Password</a>
          <div style={{textDecoration:'none', marginLeft:'25%'}} className={styles.options}>
        Show Password &nbsp; <input className={styles.checkbox} onChange={()=>showpass()} type='checkbox'></input>
        </div>
          </div>
          <button type="submit" className={styles.button}>Login</button>
        </form>
        <p className={styles.p}>
          Don't have an account? <a href="/signin">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
