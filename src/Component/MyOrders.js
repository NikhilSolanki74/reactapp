import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import styles from './CSS/MyOrders.module.css'
import { setLine } from '../Redux/Features/UnderlineSlice'
import { setCart } from '../Redux/Features/UserCartSlice'
import { useDispatch ,useSelector} from 'react-redux'
import { setOrders } from '../Redux/Features/MyOrdersSlice'
import { triggerNotification } from './Notification'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const MyOrders = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const baseurl = process.env.REACT_APP_BASE_URL || '';
    const token = localStorage.getItem('token');
    const order = useSelector(state => state.orders)
    const [orders, setOrd] = useState(order.orders);
   useEffect(()=>{
    dispatch(setLine(5))
  dispatch(setCart({tag:false}))
    axios.post(`${baseurl}/getorders`, {token:token}).then((response)=>{
const data = response.data;
dispatch(setOrders(data.orders));
   setOrd(data.orders);
    }).catch((err)=>{
        console.log(err);
        triggerNotification('Error in Order Fetching');
    })
   },[])

   return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.title}>My Orders</h1>
        <div className={styles.orderList}>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div className={styles.orderCard} key={index}>
                <img onClick={()=> navigate(`/productviewu/?id=${encodeURIComponent(order.productId)}`)}
                  src={order.productImage}
                  alt={order.productName}
                  className={styles.productImage}
                />
                <div className={styles.orderInfo}>
                  <h2>{order.productName}</h2>
                  <p>Quantity: {order.count}</p>
                  <p>Price: {order.price} Rs</p>
                  <p>Status:<p className={styles.status}>{order.status}</p></p>
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

export default MyOrders
