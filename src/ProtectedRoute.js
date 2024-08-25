import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useDispatch,useSelector} from 'react-redux'
import { Navigate } from 'react-router-dom'
import { setUser } from './Redux/Features/UserSlice'
import Loading from './Component/Loading'

const ProtectedRoute = ({children}) => {
  const baseurl = process.env.REACT_APP_BASE_URL || '';
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user)
const [check ,setCheck] = useState(false)
  const getuserdata = async () =>{
       try {
        const token = localStorage.getItem('token')
        await axios.post(baseurl+'/getuserdata',{token:token}).then((response)=>{
           const data = response.data;
           if(data.success && data.data.status  === '0'){
              dispatch(setUser(data.data))
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
   if(!user){
    getuserdata();
   }else{
    setCheck(true)
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
