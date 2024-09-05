import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useDispatch,useSelector} from 'react-redux'
import { Navigate,useNavigate } from 'react-router-dom'
import { setUser } from './Redux/Features/UserSlice'
import { setCart } from './Redux/Features/UserCartSlice'
import Loading from './Component/Loading'

const ProtectedRoute = ({children}) => {
  const navigate = useNavigate();
  const baseurl = process.env.REACT_APP_BASE_URL || '';
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user)
  const {cart} = useSelector(state => state.cart)
const [check ,setCheck] = useState(false)
  const getuserdata = async () =>{
       try {
        const token = localStorage.getItem('token')
        await axios.post(baseurl+'/getuserdata',{token:token}).then((response)=>{
           const data = response.data;
           if(data.success && data.data.status  === '0'){
              dispatch(setUser(data.data))
              const dt = data.cart;
              dispatch(setCart({userId:dt.userId,itemsId:dt.itemsId,itemCount:dt.itemCount}))
              
            //   setCheck(true);
           }else{
               localStorage.clear()
               
               return <Navigate to='/' />
       }
        })
        
       }catch (error) {
        localStorage.clear()
        console.log(error)
        return <Navigate to='/'/>

       }finally{
        setCheck(true)
       }


  }
 
  useEffect(()=>{
   if(!user || !cart){
    getuserdata();
  }else if(user.status === '0'){
    setCheck(true)
   }else{
    localStorage.removeItem('token')
    navigate('/')
   }

  },[user])

  if(!check){
    return <Loading/>
  }

  if(localStorage.getItem('token') ){
  
        return children;
   
  }else{
    return <Navigate to='/'/>
  }




}

export default ProtectedRoute
