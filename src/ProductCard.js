import React from 'react';
import styles from './Component/CSS/ProductCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
const ProductCard = ({ product }) => {
  return (
    <div className={styles.card}>
    <div className={styles.icondiv}>
    <FontAwesomeIcon className={styles.icon} icon={faCartShopping} />
    </div>
      <img src={product.image} alt={product.product} className={styles.image} />
      <div className={styles.details}>
        <h2 className={styles.title}>{product.product}</h2>
        <p>{product.description}</p>
        <h4>Price: {product.price} RS</h4>
      </div>
    </div>
  );
};

export default ProductCard;
