import React, { useEffect, useState } from 'react'
import styles from './CSS/AddToCart.module.css'
import Navbar from './Navbar'
import { setLine } from '../Redux/Features/UnderlineSlice'
import { setCart ,reset} from '../Redux/Features/UserCartSlice'
import { useDispatch } from 'react-redux'
import { triggerNotification } from './Notification'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import { loadStripe } from '@stripe/stripe-js';

const AddToCart = () => {
    const {cart} = useSelector((state)=> state.cart);
    const navigate = useNavigate();
    const [cal, setCal] = useState({subtotal:0,shipping:0,  tax:0,total:0});
    const [ids, setids] = useState({...cart.itemsId})
  const baseurl = process.env.REACT_APP_BASE_URL || '';
  const token = localStorage.getItem('token') || '';
  const [products, setProducts] = useState([]);
const dispatch  = useDispatch();
const [count , setCount] = useState(cart.itemCount)
// const stripePromise = loadStripe('pk_test_51PWWfj00wn2FeaExlr7ew2lFyeeBRIZJwxQNIwZihmeYvq9kPEIOcsE8kkUceQt0mu1YF207fBjtdmyOBrEbKYeQ00PeQoCgB1');


    useEffect(()=>{
        dispatch(setLine(0))
       axios.post(`${baseurl}/mycart`,{token:token}).then((response)=>{
        const data = response.data;
         // console.log(data)
         if (data.success) {
           setProducts(data.data);
         }
       }).catch((err)=>{
        console.log(err)
        triggerNotification("Error in fetching cart products","error")
       }) 
   },[])

   const handleincrement = (id) => {
    if(ids[id] >= 10){
      return
    }
    axios.post(`${baseurl}/addtocart`,{token:token, id:id}).then((response)=>{
      const data =  response.data;
      if(data.success){
      //  triggerNotification(data.msg);
           const newdata = data.data;
           dispatch(setCart({itemCount:newdata.itemCount,itemsId:newdata.itemsId}))
          //  setCount(newdata.itemCount);
           setids(newdata.itemsId)
      }else{
         triggerNotification(data.msg,'error')
      }
    }).catch((err)=>{
console.log(err);
    })
   }

   const handeldecrement = (id) => {
    if(ids[id] <= 1){
      return
    }
    axios.post(`${baseurl}/decreaseitemcount`,{token:token, id:id}).then((response)=>{
      const data =  response.data;
      if(data.success){
      //  triggerNotification(data.msg);
           const newdata = data.data;
           dispatch(setCart({itemCount:newdata.itemCount,itemsId:newdata.itemsId}))
          //  setCount(newdata.itemCount);
           setids(newdata.itemsId)
           
      }else{
         triggerNotification(data.msg,'error')
      }
    }).catch((err)=>{
console.log(err);
    })
   }

   const handleremove = (id) => {
   
    axios.post(`${baseurl}/removecartitem`,{token:token, id:id}).then((response)=>{
      const data =  response.data;
      if(data.success){
      //  triggerNotification(data.msg);
           const newdata = data.data;
           dispatch(setCart({itemCount:newdata.itemCount,itemsId:newdata.itemsId}))
           setCount(newdata.itemCount);
          // console.log('hello',newdata.itemsId);
          if(!newdata.itemsId){
          setids({})
            return setProducts([]);
          }
          setids(newdata.itemsId)
          setProducts((prev)=>{
            return prev.filter((pd)=>{
                   return newdata.itemsId[pd._id] >= 1
            })
          })
      }else{
         triggerNotification(data.msg,'error')
      }
    }).catch((err)=>{
console.log(err);
    })
   }
// console.log(products,'kk')
 useEffect(()=>{

   if(products.length){
     let vl = 0;
     let ship = 0;
     let tax = 0;
      products.forEach((pr)=>{
         vl += pr.price * ids[pr._id];
           ship +=  80;
           tax += ids[pr._id] * Math.round((pr.price/100)*5)
      })
      let total = vl+ship+tax;
      setCal({subtotal:vl, shipping:ship, tax:tax ,total:total });
   }
 },[ids , products , count])

 const loadRazorpayScript = () => {
  return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
          resolve(true);
      };
      script.onerror = () => {
          resolve(false);
      };
      document.body.appendChild(script);
  });
};


  const handlePayment = async () => {
  
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
          alert('Failed to load Razorpay script');
          return;
      }

        try {
           let productname = products[0].product;
    if(products.length > 1){
       productname += ` and ${products.length-1} Other`;
    }
          const order = await axios.post(`${baseurl}/create-order`, {
            amount: cal.total,
            currency: 'inr',token,productname
          });
    
          const options = {
            key: 'rzp_test_PDc1ER07EFyI2H',
            amount: order.data.amount,
            currency: order.data.currency,
            name: 'Julissa Limited',
            description: 'Product Transaction',
           
            order_id: order.data.id, 
            handler: function (response) {
              
              const data = {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              };
              axios.post(`${baseurl}/paymentsuccess`,{token:token,orderDetails:ids}).catch((err)=>{
                  console.log(err)
              })
              axios.post(`${baseurl}/clearcart`,{token:token});
              dispatch(setCart({tag:true}))
              setProducts([]);
              dispatch(reset())
              navigate('/addtocart')
              triggerNotification("Payment Successfull, Your Order Placed !")
              
            },
            theme: {
              color: '#3399cc',
            },
            modal: {
              ondismiss: function () {
                navigate('/home')
                triggerNotification("Payment Unsuccessfull !", "error")
              } 
            }
          };
    
          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (error) {
          console.error(error);
        }
     
    
    



  };

  


  return (
    <div className={styles.container}>
      <Navbar count={count}/>
      <div className={styles.productdiv}>
        <div className={styles.productdetail}>
        <div className={styles.productlist}>
          {products.length > 0 ? (
            products.map((product) => (
              <div className={styles.productrow}  key={product._id} >
              <div className={styles.productimage} onClick={()=>navigate(`/productviewu/?id=${encodeURIComponent(product._id)}`)}>
                <img src={product.image} alt={product.product}  className={styles.image}/>
              </div>
                <div className={styles.productdetails}>
                  <h3>{product.product} </h3>
                  <p>Price: {product.price} Rs</p>
                </div>
                <div className={styles.marketcontrol}>
                
                <div className={styles.quantitys}>
    <button className={styles.decrement} onClick={()=> handeldecrement(product._id)} disabled={ids[product._id] <= 1}>-</button>
   
    <input type="text" value={ids[product._id] || '0'} className={styles.quantityi} readOnly/>
    <button className={styles.increment} onClick={()=>handleincrement(product._id)} disabled={ids[product._id] >= 10}>+</button>
</div>

                <button className={styles.remove} onClick={()=> handleremove(product._id)}>Remove From Cart</button>
                  </div>
              </div>
            )) 
            
          ) : (
            <div className={styles.nodata}>

            <h2 style={{fontFamily:'monospace',color:'gray'}}>Your Cart is Empty</h2>
            <img height={'300px'} src='https://res.cloudinary.com/dzjvyptwz/image/upload/v1725337550/ekdkdotyapehwmmhfuai.png'/>
            </div>
          )}
          </div>
          {products.length > 0 ?
          (<div className={styles.summary}>
 <div className={styles.calculation}>

 <div className={styles.summaryContainer}>
            <h2 className={styles.summaryTitle}>Summary</h2>
           
            <div className={styles.detailRow}>
                <label>Subtotal</label>
                <span className={styles.num}>{cal.subtotal}.00<span> Rs</span></span>
            </div>
            <div className={styles.detailRow}>
                <label>Estimated Shipping & Handling</label>
                <span className={styles.num}>{cal.shipping}.00<span> Rs</span></span>
            </div>
            <div className={styles.detailRow}>
                <label>Estimated Tax </label>
                <span className={styles.num}>{cal.tax}.00<span> Rs</span></span>
            </div>
            <div className={styles.totalRow}>
                <label>Total</label>
                <span className={styles.num}>{cal.total}.00<span> Rs</span></span>
            </div>
            <div style={{marginTop:'35px'}} className={styles.totalRow}>
              Choose Address -
            </div>
            <div className={styles.detailRow}>
           <input type='radio' defaultChecked/> 
           <label>Carl-Leverkus-Str. 95c, Restorffdorf, HH 24358,restohuf...</label>
            </div>
            <button className={styles.checkoutButton} onClick={handlePayment}>Buy Now</button>
        </div>

 </div>
   </div>):(<div className={styles.summary}></div>)

          }
        </div>

      </div>
    </div>
  )
}

export default AddToCart
