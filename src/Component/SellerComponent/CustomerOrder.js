import React, { useEffect, useState } from 'react'
import styles from '../CSS/SellerCSS/CustomerOrder.module.css'
import { setLine } from '../../Redux/Features/UnderlineSlice'
import { useDispatch ,useSelector} from 'react-redux'
import { setOrders } from '../../Redux/Features/MyOrdersSlice'
import { triggerNotification } from '../Notification'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import SellerNavbar from './SellerNavbar'
import { setCart } from '../../Redux/Features/UserCartSlice'
const CustomerOrder = () => {
    
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const baseurl = process.env.REACT_APP_SELLER_BASE_URL || '';
    const token = localStorage.getItem('token');
    const order = useSelector(state => state.orders)
    const [orders, setOrd] = useState(order.orders);
    
   useEffect(()=>{
    dispatch(setCart({tag:false}));
    dispatch(setLine(3))

    axios.post(`${baseurl}/getorders`, {token:token}).then((response)=>{
const data = response.data;
dispatch(setOrders(data.orders));
console.log(orders);
   setOrd(data.orders);
    }).catch((err)=>{
        console.log(err);
        triggerNotification('Error in Order Fetching');
    })
   },[])

   return (
    <div className={styles.container}>
      <SellerNavbar />
      <div className={styles.content}>
       <div className={styles.tl}><h1 className={styles.title}>Customer Orders </h1><span className={styles.total}>Total: {orders.length}</span></div> 
        <div className={styles.orderList}>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div className={styles.orderCard} key={index}>
                <img onClick={()=> navigate(`/productview/?id=${encodeURIComponent(order.productId)}`)}
                  src={order.productImage}
                  alt={order.productName}
                  className={styles.productImage}
                />
                <div className={styles.orderInfo}>
                  <h3>{order.productName} </h3>
                  <p>Customer :<span className={styles.dynamic}> {order.userData.name}</span></p>
                  <p>Email: <span className={styles.dynamic}>{order.userData.email}</span></p>
                  <p>Quantity: <span className={styles.dynamic}>{order.count}</span></p>
                  <p>Paid: <span className={styles.dynamic}>{order.price} Rs</span></p>
                  <p>Status:<span className={styles.dynamic}><p className={styles.status}>{order.status}</p></span></p>
                </div>
              </div>
            ))
          ) : (
            <div style={{display:"flex",justifyContent:'center',flexDirection:'column',}}>

            <p className={styles.noOrders}>You have no current orders.</p>
            <img height={'300px'} style={{marginLeft:'550px'}} width={'300px'} src='https://res.cloudinary.com/dzjvyptwz/image/upload/v1725337550/ekdkdotyapehwmmhfuai.png'/>
            </div>
           
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerOrder
