import React, { useRef, useState } from "react";
import axios from "axios";
import styles from './CSS/Signin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock, faCheck,faCircle } from '@fortawesome/free-solid-svg-icons';
import { triggerNotification } from "./Notification";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [caps,setCaps] = useState(false);
  const baseurl = process.env.REACT_APP_BASE_URL || '';
  const navigate = useNavigate()
  const form = useRef();
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    contact: "",
    confirmpassword: "",
    country:"India",
    role:'User'
  });

  const [type  , settype] = useState('password')

  const handlecaps =(e)=>{
    setCaps(e.getModifierState("CapsLock"))
}

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
        <select value={data.country} onChange={(e)=> setData((dt)=>{return {...dt,country:e.target.value}})} className={styles.dropdown}>
        <option value={'India'} className={styles.opt}>India</option>
        <option value={"Nepal"} className={styles.opt}>Nepal</option>
        <option value={'Pakistan'} className={styles.opt}>Pakistan</option>
        <option value={'China'} className={styles.opt}>China</option>
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
      <div className={styles.caps} style={{display:caps ? " " : 'none'}}><FontAwesomeIcon icon={faCircle} size="2xs" style={{color: "#0bf427"}} /> &nbsp;Caps Lock</div>
        <h2>Sign Up</h2>
        <div className={styles.inputGroups}>
          <FontAwesomeIcon icon={faUser} className={styles.icon} />
          <input
          onKeyDown={(e)=> handlecaps(e)}
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
          onKeyDown={(e)=> handlecaps(e)}

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


        <div className={`${styles.inputGroups} ${styles.rolediv}`}>
        <label>Join As  </label>
          <select value={data.role} onChange={(e)=>setData((dt)=>{return {...dt, role:e.target.value}})} className={styles.toggleselect}>
            <option value={'User'} >User</option>
            <option value={'Seller'}>Seller</option>
          </select>
        </div>



        <div className={styles.inputGroups}>
          <FontAwesomeIcon icon={faPhone} className={styles.icon} />
          <input
          onKeyDown={(e)=> handlecaps(e)}
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
          onKeyDown={(e)=> handlecaps(e)}
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
          onKeyDown={(e)=> handlecaps(e)}
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

