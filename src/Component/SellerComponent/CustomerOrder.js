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
import { useWebSocket } from '../../WebSocketProvider'
import Loading2 from '../Loading2'
const CustomerOrder = () => {
  const [loading ,setLoading] = useState(false);
    const {ws} = useWebSocket();
    // console.log(ws,'ggg');
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const baseurl = process.env.REACT_APP_SELLER_BASE_URL || '';
    const token = localStorage.getItem('token');
    const order = useSelector(state => state.orders)
    const [orders, setOrd] = useState(order.orders);
    const [k ,setk] = useState({})
   useEffect(()=>{
    setLoading(true)
    dispatch(setLine(3))

    axios.post(`${baseurl}/getorders`, {token:token}).then((response)=>{
      setLoading(false)
const data = response.data;
dispatch(setOrders(data.orders));
console.log(orders);
   setOrd(data.orders);
    }).catch((err)=>{
      setLoading(false)
        console.log(err);
        triggerNotification('Error in Order Fetching');
    }).finally(()=>{
      setLoading(false)
    })
   },[k])

   const dateConverter = (dateString) =>{
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); 
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12 || 12; 

    return `${day} ${month}, ${hours}:${minutes} ${ampm}`;
   }


useEffect(()=>{
   const customws = async (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'ORDER_CHANGE') {
          dispatch(setCart({tag:true}));
            setk({});      
    }else if(data.type === 'ORDER_NOTIFICATION'){
setk({})
    }
};
if (ws) {
    ws.addEventListener('message', customws);
}
return () => {
  dispatch(setCart({tag:false}));
    if (ws) {
        ws.removeEventListener('message',customws);
    }
};
}, [ws])


const handleStatusChange = (status , pid , cid , oncr) =>{
  axios.post(`${baseurl}/changestatus`, {token:token,productId:pid,customerId:cid , onCreated:oncr,status:status}).then((response)=>{
    const data= response.data;
    if(data.success){
     setk({})
     triggerNotification(data.msg)

    }else{
        triggerNotification(data.msg,'error')

    }

 }).catch((err)=>{
      console.log(err);
      triggerNotification('Server Error Occured','error')
 })
}

const handleColor = (status) =>{
  switch (status) {
    case 'Canceled':
      return '#ff9494'
      break;
  
      case 'Shipped':
      return '#7ec5ffd6'
      break;
      case 'Out For Delivery':
      return '#ffee9bd6'
      break;
  
      case 'Delivered':
      return '#9bffe6'
      break;
  
    default:
      return  ''
      break;
  }
  }

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
                  <p>Customer :<span className={styles.dynamic}> {order.userData ? order.userData.name : ''}</span></p>
                  <p>Email: <span className={styles.dynamic}>{order.userData ? order.userData.email : ''}</span></p>
                  <p>Quantity: <span className={styles.dynamic}>{order.count}</span></p>
                  <p>Order Time: <span className={styles.dynamic}> {dateConverter(order.onCreated)}</span></p>
                  <p>Paid: <span className={styles.dynamic}>{order.price} Rs</span></p>
                  <p>Status:<span className={styles.dynamic}><p style={{backgroundColor:handleColor(order.status)}} className={styles.status}>{order.status}</p></span></p>
                </div>
                <div className={styles.status_toggle_container}>
            <div
                className={`${styles.status_toggle_item} ${order.status === 'Pending' ? styles.active : ''}`}
                onClick={() => handleStatusChange("Pending", order.productId , order.customerId,order.onCreated)}
                
            >
                Pending
            </div>
            <div
                className={`${styles.status_toggle_item} ${order.status === "Shipped" ? styles.active : ""}`}
                onClick={() => handleStatusChange("Shipped", order.productId, order.customerId,order.onCreated)}
            >
                Shipped
            </div>
            <div
                className={`${styles.status_toggle_item} ${order.status === "Out For Delivery" ? styles.active : ""}`}
                onClick={() => handleStatusChange("Out For Delivery", order.productId, order.customerId,order.onCreated)}
            >
                Out for Delivery
            </div>
            <div
                className={`${styles.status_toggle_item} ${order.status === "Delivered" ? styles.active: ""}`}
                onClick={() => handleStatusChange("Delivered", order.productId, order.customerId,order.onCreated)}
            >
                Delivered
            </div>
        </div>
              </div>
            ))
          ) : (
            loading ? <Loading2/> :
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
