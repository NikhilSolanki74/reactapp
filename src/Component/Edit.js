import React, { useEffect, useState } from 'react'
import styles from './CSS/Edit.module.css'
import axios from 'axios'
import Navbar from './Navbar'
import { setUser } from '../Redux/Features/UserSlice';
import { useSelector ,useDispatch} from 'react-redux';
import { triggerNotification } from './Notification';
import { useNavigate } from 'react-router-dom';
const Edit = () => {
    const validName = new RegExp("^[a-zA-Z ]{2,40}$");
const validContact = new RegExp("^[0-9]{10,12}$");

    const navigate = useNavigate();
    const userdata = useSelector((state)=> state.user)

const baseurl = process.env.REACT_APP_BASE_URL || '';
  const token = localStorage.getItem('token') || '';
  
  const [data, setData] = useState({name:userdata.user.name ?userdata.user.name : '',contact:userdata.user.contact ? userdata.user.contact : '',token:token})

    const handleEdit =()=>{
    if(!validName.test(data.name) || !validContact.test(data.contact  || !data.token)){
      return triggerNotification("Invalid Input Data",'error')
    }
        axios.post(baseurl+'/edit',{data:data}).then((response)=>{
           const dt = response.data;
         if(dt.success){
            //  dispatch(setUser(dt.tokenData))
              triggerNotification(dt.msg)
              //  console.log(token,'hh')     
                     navigate('/profile');
           navigate(0);         
            
         }else{
          return  triggerNotification(dt.msg,'error')
         }

        }).catch((err)=>{
            triggerNotification("Error in Submitting Data !" , 'error')
           return console.log(err)
        })

    }



  return (
    <div className={styles.container}>
    <Navbar/>
    <div className={styles.formdiv}>
    <h2>Edit Profile </h2>
    <form className={styles.form}>
    <label>Name</label>
    <input type='text' value={data.name} onChange={(e)=> setData((dt)=> {return {...dt ,name:e.target.value}})}/>
    <br/>
    <label>Contact</label>
    <input type='text' value={data.contact} onChange={(e)=> setData((dt)=> {return {...dt ,contact:e.target.value}})}/>

<br/>
<button type='button' onClick={()=> handleEdit()}>Save Edit</button>
    </form>
    </div>
    </div>
  )
}

export default Edit
