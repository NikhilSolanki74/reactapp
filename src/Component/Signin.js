import React, { useRef, useState } from "react";
import axios from "axios";
import styles from './CSS/Signin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { triggerNotification } from "./Notification";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const baseurl = process.env.REACT_APP_BASE_URL || '';
  const navigate = useNavigate()
  const form = useRef();
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    contact: "",
    confirmpassword: "",
  });

  const [type  , settype] = useState('password')

   const showpass = ()=>{
     if(type === 'password'){
       settype('text')
 
     }else{
       settype('password')
     }
   }

  const validName = new RegExp("^[a-zA-Z ]{2,40}$");
  const validEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
  );
  const validPassword = new RegExp("^(?=.*?[A-Za-z0-1]).{6,20}$");
  const validContact = new RegExp("^[0-9]{10,12}$");

  const handlesubmit = () => {
    if (data.password === data.confirmpassword) {
      if (!validName.test(data.name)) {
        return triggerNotification("Enter Valid Name", "info");
      }
      if (!validEmail.test(data.email)) {
        return triggerNotification("Enter Valid Email", "info");
      }
      if (!validContact.test(data.contact)) {
        return triggerNotification("Enter Valid Contact Number", "info");
      }
      if (data.password.length < 6) {
        return triggerNotification("Minimum Password length is 6 ", "info");
      }
      if (!validPassword.test(data.password)) {
        return triggerNotification("Enter Valid Password", "info");
      }
    } else {
      return triggerNotification("Confirm Password not matched", "info");
    }

    axios
      .post(baseurl+"/signin", data)
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
        }
          triggerNotification(dat.msg);
        }else{
        return triggerNotification('Server is not responding ,wait few second before retry', 'error');

        }




      })
      .catch((err) => {
        console.log(err);
        return triggerNotification("there is an error in submitting data");
      });
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
        className={styles.signinContainer}
        onSubmit={(e) => {
          e.preventDefault();
          handlesubmit();
        }}
      >
        <h2>Sign Up</h2>
        <div className={styles.inputGroups}>
          <FontAwesomeIcon icon={faUser} className={styles.icon} />
          <input
            placeholder="Name"
            name="name"
            type="text"
            id="name"
            onChange={(e) => {
              setData((prev) => {
                return { ...prev, name: e.target.value };
              });
            }}
            required
          />
        </div>
        <div className={styles.inputGroups}>
          <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
          <input
            placeholder="Email"
            name="email"
            type="email"
            id="email"
            onChange={(e) => {
              setData((prev) => {
                return { ...prev, email: e.target.value };
              });
            }}
            required
          />
        </div>
        <div className={styles.inputGroups}>
          <FontAwesomeIcon icon={faPhone} className={styles.icon} />
          <input
            placeholder="Contact"
            name="contact"
            type="text"
            id="contact"
            onChange={(e) => {
              setData((prev) => {
                return { ...prev, contact: e.target.value };
              });
            }}
            required
          />
        </div>
        <div className={styles.inputGroups}>
          <FontAwesomeIcon icon={faLock} className={styles.icon} />
          <input
            placeholder="Password"
            type={type}
            id="password"
            onChange={(e) => {
              setData((prev) => {
                return { ...prev, password: e.target.value };
              });
            }}
            required
          />
        </div>
        <div className={styles.inputGroups}>
          <FontAwesomeIcon icon={faCheck} className={styles.icon} />
          <input
            placeholder="Confirm Password"
            type={type}
            id="confirmpassword"
            onChange={(e) => {
              setData((prev) => {
                return { ...prev, confirmpassword: e.target.value };
              });
            }}
            required
          />
          
        </div>
        <div style={{textDecoration:'none',marginLeft:'55%'}} className={styles.loginLink}>
        Show Password &nbsp; <input onChange={()=>showpass()} type='checkbox'></input>
        </div>
        <button type="submit" className={styles.submitButtons}>
          Submit
        </button>
        <a className={styles.loginLinks} href="/">
          Already a User? Login
        </a>
      </form>
    </div>
  );
};

export default Signin;

