import React from 'react';
import styles from './CSS/ProductCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus,faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const ProductCard = ({ product ,url,handleAddCart,ids}) => {
   const navigate = useNavigate();
    const id = product._id;
    
  return (
    <div className={styles.card} >
    <div className={styles.icondiv} >
    <FontAwesomeIcon style={{display: ids[id] > 0 ? '':'none',color: "#2acb70"}} icon={faCircleCheck} className={styles.icon} size="sm"  />
    <FontAwesomeIcon style={{display: ids[id] > 0 ? 'none':''}}  className={styles.icon} onClick={()=> {handleAddCart(product._id)}} icon={faCartPlus}/>
    </div>
      <img src={product.image} onClick={()=>{if(product._id){navigate(url ?`/productviewu/?id=${encodeURIComponent(product._id)}` : `/productview/?id=${encodeURIComponent(product._id)}`)}}} alt={product.product} className={styles.image} />
      <div className={styles.details}>
        <h2 className={styles.title}>{product.product}</h2>
        <p>{product.description}</p>
        <h4>{product.price ? `Price: ${product.price} Rs` : ' '}</h4>
      </div>
    </div>
  );
};

export default ProductCard;
