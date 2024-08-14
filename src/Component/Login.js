import React, { useState, useRef } from 'react';
import axios from 'axios';
import styles from './CSS/Login.module.css';
import { triggerNotification } from './Notification';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const form = useRef();
  const [data, setData] = useState({ email: '', password: '' });

  const [type  , settype] = useState('password')

  const showpass = ()=>{
    if(type === 'password'){
      settype('text')

    }else{
      settype('password')
    }
  }

  const validEmail = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
  );
  const validPassword = new RegExp('^(?=.*?[A-Za-z0-1]).{6,20}$');

  const handleSubmit = () => {
    if (validEmail.test(data.email) && validPassword.test(data.password)) {
      axios.post('http://localhost:4000/api/v1/login', data)
        .then((response) => {
          if (response.data) {
            const dat = response.data;
            // console.log(dat);
            if(dat.token){
            if(localStorage.getItem('token')){
              localStorage.removeItem('token')
            }
            localStorage.setItem('token',dat.token )
            console.log(dat.token)
            navigate('/home')
            triggerNotification(dat.msg)
          }else{
          return  triggerNotification(dat.msg);

          }
          }else{
    return triggerNotification('Server is not responding ,wait few second before retry', 'error');

          }
        })
        .catch((err) => {
          console.log('Error in sending the request', err);
        });
    } else {
      triggerNotification('Email or password is wrong!', 'error');
    }
  };

  return (
    <div className={styles.loginPage}>
    <div className={styles.dropdowndiv}>
      <select  className={styles.dropdown}>
        <option className={styles.opt}>India</option>
        <option className={styles.opt}>Nepal</option>
        <option className={styles.opt}>Pakistan</option>
        <option className={styles.opt}>China</option>
      </select>
    </div>
      <div className={styles.loginContainer}>
        <h2>Login</h2>
        <form ref={form} action="/" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className={styles.inputGroup}>
            <input type="text" placeholder="Username"  onChange={(e) => setData((dt) => ({ ...dt, email: e.target.value }))} required />
            <span className={styles.icon}>&#xf007;</span>
          </div>
          <div className={styles.inputGroup}>
            <input type={type} placeholder="Password" onChange={(e) => setData((dt) => ({ ...dt, password: e.target.value }))} required />
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
