import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useDispatch,useSelector} from 'react-redux'
import { Navigate,useNavigate } from 'react-router-dom'
import { setUser } from './Redux/Features/UserSlice'
import Loading from './Component/Loading'
import { triggerNotification } from './Component/Notification'

const ProtectedSellerRoute = ({children}) => {
  const navigate = useNavigate();
  const baseurl = process.env.REACT_APP_SELLER_BASE_URL || '';
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user)
const [check ,setCheck] = useState(false)
  const getsellerdata = async () =>{
       try {
        const token = localStorage.getItem('token') || '';
        await axios.post(baseurl+'/getsellerdata',{token:token}).then((response)=>{
           const data = response.data;
        //   return console.log(data)
           if(data.success && data.data.status === '2'){
    
            
             return dispatch(setUser(data.data))
            
           }else{
               localStorage.clear()
             navigate('/')

              
              return triggerNotification(data.msg,'error')
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
   if(!user){
    getsellerdata();
  }else if(user.status === '2'){
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

export default ProtectedSellerRoute
