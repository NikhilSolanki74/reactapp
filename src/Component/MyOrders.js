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
import { useWebSocket } from '../WebSocketProvider'
import { useConfirm } from '../ConfirmWindow'
import Loading2 from './Loading2'
const MyOrders = () => {
  const [loading , setLoading] = useState(false);
  const {ws} = useWebSocket();
  const { confirm,ConfirmWindow } = useConfirm();
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const baseurl = process.env.REACT_APP_BASE_URL || '';
    const token = localStorage.getItem('token');
    const order = useSelector(state => state.orders)
    const [orders, setOrd] = useState(order.orders);
    const [k ,setk] = useState({});
   useEffect(()=>{
    dispatch(setLine(5))
    setLoading(true);
    axios.post(`${baseurl}/getorders`, {token:token}).then((response)=>{
      setLoading(false);
const data = response.data;
dispatch(setOrders(data.orders));
   setOrd(data.orders);
    }).catch((err)=>{
      setLoading(false);
        console.log(err);
        triggerNotification('Error in Order Fetching');
    }).finally(()=>{
      setLoading(false);

    })
   },[k])

   const handleCancelOrder =async (id,time) =>{
    if(!await confirm('Are you Sure you Want to Cancel the Order ?')){
      return
    }
    axios.post(`${baseurl}/cancelorder`, {token:token,productId:id,onCreated:time}).then((response)=>{
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


   const handleDeleteOrder = (id,time) =>{
    
    axios.post(`${baseurl}/deleteorder`, {token:token,productId:id,onCreated:time}).then((response)=>{
      const data= response.data;
      if(data.success){
        setk({});
       triggerNotification(data.msg,'info')

      }else{
          triggerNotification(data.msg,'error')

      }

   }).catch((err)=>{
        console.log(err);
        triggerNotification('Server Error Occured','error')
   })
   }

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
      <Navbar />
      <ConfirmWindow/>
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
                  <p>Order on: {dateConverter(order.onCreated)}</p>
                  <p>Status:<p className={styles.status} style={{backgroundColor:handleColor(order.status)}}>{order.status}</p></p>
                </div>
                <div className={styles.buttondiv}>
                 {order.status ==='Pending' ? <button className={styles.cancelorder} onClick={()=>handleCancelOrder(order.productId,order.onCreated)}>Cancel Order</button>  : ""}
                 {order.status ==='Canceled' ? <button className={styles.deleteorder} onClick={()=>handleDeleteOrder(order.productId,order.onCreatedOn)}>Delete Order</button>  : ""}
                </div>
              </div>
            ))
          ) : (loading ? <Loading2/> : 
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
