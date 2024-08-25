import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import styles from '../CSS/AdminCSS/UserPanel.module.css'
import axios from 'axios'
import { triggerNotification } from '../Notification'
const UserPanel = () => {
  const [pg , setPg] = useState({page:1 ,skip:0 , limit:13 , pages:0 })
  const [users,setUsers] = useState({});
  const [check , setCheck] = useState(true)
const baseurl  = process.env.REACT_APP_ADMIN_BASE_URL || '';
const token = localStorage.getItem('token') || '';
const [nodata ,setNoData] = useState('');
useEffect(()=>{
  if(!token){
       setCheck(false);
       return triggerNotification("User Not Authorized !", 'error')
  }
    axios.post(baseurl+'/getregistereduser',{token:token,skip:pg.skip, limit:pg.limit}).then((response)=>{
      const data = response.data;
      if(data.success){
        setUsers({...data})
        //start here
        // setPg({page:1 , skip:data.skip})
        return setCheck(false);
      // return triggerNotification(data.msg)
      }else{
        setCheck(false);
        setNoData("No Data Found")
       return triggerNotification(data.msg,'error')
      }

    }).catch((err)=>{
      console.log(err)
    })

},[])

const handlePrev=()=>{


}


const handleNext=()=>{

}
 
if(check){
  return (
  <div className={styles.container}>
    <AdminNavbar/>
    <div className={styles.loadingdiv} >
      <img className={styles.loading} src='https://res.cloudinary.com/dzjvyptwz/image/upload/v1720603063/hrozcvvif07qbprv4kh0.gif' alt='Loading...'></img>
    </div>
    </div>
    )
}else if(!users.userdata){
return(
  
  <div className={styles.container}>
    <AdminNavbar/>
    <div className={styles.tableContainer}>

    <table className={styles.table}>
  <thead>
  <tr><th colSpan={'5'}>No Data Found</th></tr>

  </thead>
    </table>
    </div>
    </div>
)
}else{




  return (
    <div className={styles.container}>
    <AdminNavbar/>
      <div className={styles.tableContainer}>

      
<table className={styles.table}>
<thead>

   <tr>
   <th>SNO</th>
    <th>Name</th>
    <th>Email</th>
    <th>Contact</th>
    <th>Id</th>
   </tr>
</thead>
<tbody className={'tbody'}>
  
   { users.userdata && users.userdata.map((data,index)=>{
    
    return (<tr key={index}>
   <td >{index+1}</td>
    <td>{data.name}</td>
    <td>{data.email}</td>
    <td>{data.contact}</td>
    <td>{data._id}</td>
   </tr>
    ) 

      
    
   })
   
   } 
   
      
   
   
</tbody>
</table>





      </div>
      <div className={styles.pagination}>
  <button onClick={()=> handlePrev()}>&#8592; Prev</button>
  <h3>1 - 20</h3>
  <button onClick={()=> handleNext()}>Next &#8594;</button>
</div>
    </div>
  )
}
}

export default UserPanel
