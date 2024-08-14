import React from 'react';
import styles from './CSS/Homepage.module.css';
import {useSelector} from "react-redux";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
const Homepage = () => {
  const navigate  = useNavigate()
const userdata = useSelector((state)=> state.user)
console.log(userdata);

const name =  userdata !== null ? userdata.user.name : 'user';
 
  return (
    <div className={styles.container}>
    <Navbar/> 

      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Julissa.</h1>
        <p className={styles.heroText}>
          Pioneering the future of agriculture by integrating advanced technologies and innovative practices. Our mission is to create sustainable and efficient farming solutions that ensure a 
        </p>
        <h3 className={styles.exploreMore}>Explore more</h3>
        <img className={styles.mouseIcon} src="https://res.cloudinary.com/dzjvyptwz/image/upload/v1723211498/nhi3nemzkgse9py2pcwb.png" alt="icon" />
      </div>

      <footer className={styles.footer}>
  <div className={styles.footerContent}>
    
    <div className={styles.footerSection}>
      <h4>Contact Us</h4>
      <p>Email: info@julissa.com</p>
      <p>Phone: +123 456 7890</p>
    </div>
    
  </div>
  <div className={styles.footerBottom}>
    <p>&copy; 2024 Julissa. All rights reserved.</p>
  </div>
</footer>

    </div>
  );
};

export default Homepage;
