import React, { useEffect } from 'react';
import styles from '../CSS/SellerCSS/SellerHomepage.module.css';
import {useSelector} from "react-redux";
import { useNavigate } from 'react-router-dom';
import SellerNavbar from './SellerNavbar';
import axios from 'axios';
const SellerHomepage = () => {
    const baseurl = process.env.REACT_APP_SELLER_BASE_URL;
    const token = localStorage.getItem('token');
  // const navigate  = useNavigate()
const userdata = useSelector((state)=> state.user)
console.log(userdata);

useEffect(()=>{
    axios.post(`${baseurl}/getproductdata`,{token:token}).then((response)=>{
        const data = response.data;
        console.log(data)
    })


},[])

const name =  userdata !== null ? userdata.user.name : 'user';
 
  return (
    <div className={styles.container}>
    <SellerNavbar/> 
   
     

    </div>
  );
};

export default SellerHomepage;

