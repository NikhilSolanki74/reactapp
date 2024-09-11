import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import styles from '../CSS/AdminCSS/UserPanel.module.css'
import axios from 'axios'
import { triggerNotification } from '../Notification'
import { useDispatch,useSelector } from 'react-redux'
import { setLine } from '../../Redux/Features/UnderlineSlice'
import { setPagination } from '../../Redux/Features/PaginationSlice'
const UserPanel = () => {
  const {pagination} = useSelector((state)=>state.pagination)
  const dispatch = useDispatch();
    const [pg , setPg] = useState({})

  const [users,setUsers] = useState({});
  const [check , setCheck] = useState(true)
const baseurl  = process.env.REACT_APP_ADMIN_BASE_URL || '';
const token = localStorage.getItem('token') || '';
let kk =pagination.offset+1;
useEffect(()=>{
  dispatch(setLine(2));
  if(!token){
       setCheck(false);
       return triggerNotification("User Not Authorized !", 'error')
  }
    axios.post(baseurl+'/getregistereduser',{token:token,offset:pagination.offset, limit:pagination.limit}).then((response)=>{
      const data = response.data;
      if(data.success){
        setUsers({...data}) 
       
        dispatch(setPagination({pages:data.pages,count:data.count}))
        // console.log(pagination)
        return setCheck(false);
      
      }else{
        setCheck(false);
       return triggerNotification(data.msg,'error')
      }

    }).catch((err)=>{
      console.log(err)
    })

},[pg])


const handleNext= async()=>{
  
  setPg({})
  
dispatch(setPagination({offset:pagination.offset+pagination.limit,page:pagination.page+1,next:pagination.page===pagination.pages-1?false:true,prev:pagination.page===0?false:true}))

}


const handlePrev=()=>{
  setPg({})
  dispatch(setPagination({offset:pagination.offset-pagination.limit,page:pagination.page-1,next:pagination.page===pagination.pages-1?false:true,prev:pagination.page===2?false:true}))

}

const handleLimit = (x) => {
  // console.log(x);
  const chk = Math.ceil(pagination.count/x)
  dispatch(setPagination({page:1,offset:0,limit:x-0,previous:false,next:chk>1?true:false,}));
  setPg({});

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

<div className={styles.dropdowndiv}>
<span>Rows :&nbsp; &nbsp;</span> 
      <select value={pagination.limit}  className={styles.dropdown} onChange={(e)=>handleLimit(e.target.value)} >
        <option value={10} className={styles.opt}>10</option>
      <option value={12} className={styles.opt}>12</option>
        <option value={20} className={styles.opt}>20</option>
        <option value={50} className={styles.opt}>50</option>
        <option value={100} className={styles.opt}>100</option>
        <option value={500} className={styles.opt}>500</option>
      </select>
    </div>
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
  
   {   users.userdata && users.userdata.map((data,index)=>{
    
    return (<tr key={index}>
   <td >{kk++}</td>
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
  <button onClick={()=> handlePrev()} disabled={!pagination.prev}>&#8592; Prev</button>
  <h3>{pagination.page} - {pagination.pages}</h3>
  <button onClick={()=> handleNext()} disabled={!pagination.next}>Next &#8594;</button>
</div>
    </div>
  )
}
}

export default UserPanel
