import React, { useEffect, useState } from 'react'
import styles from '../CSS/AdminCSS/AdminAnalytics.module.css'
import AdminNavbar from './AdminNavbar'
import { setLine } from '../../Redux/Features/UnderlineSlice'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chart from "react-apexcharts";
import axios from 'axios';
import { faUsers,faUser,faCircle ,faStopwatch} from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons/faCalendarCheck'
import { triggerNotification } from '../Notification'


const AdminAnalytics = () => {
    const baseurl = process.env.REACT_APP_ADMIN_BASE_URL || '';
    const token = localStorage.getItem('token') || 'notoken';
    const dispatch = useDispatch();
    const [country ,setCountry] = useState({India:100, China:0, Nepal:0, Pakistan:0});
    const [textfeild ,setTextFeild] = useState({total:0,active:0,Mactive:0,engMin:0,engSec:0,engHour:0})
    const [lineArr , setLineArr] = useState({dayArr:[],countArr:[5,55,5,55,5,55,5]});
    const [barArr , setBarArr] = useState({dayArr:[],countArr:[11,33,1,2,3,33,4],registered:0});

    useEffect(()=>{
        dispatch(setLine(3));
         try {
            
         axios.post(`${baseurl}/getchart` , {token:token}).then((response)=>{
            const data = response.data;
            if(!data.success){
              return triggerNotification('Error in chart data','error')
 
             }
              console.log(data);
              if(data.activeUser.length === 0){
                return triggerNotification('Failed in data fetch','error')
              }
              setTimeout(()=>{
                  
                  setCountry(data.countrydata);  
                setTextFeild((dt)=>{return {...dt,total:data.total,active:data.activeUser[0].activeUser,Mactive:data.Mactive[0].Mactive}})
              },1000)

              axios.post(`${baseurl}/getengagementtime`, {token:token}).then((response)=>{
            const data = response.data;
            if(!data.success){
              return triggerNotification('Error in engagement time data','error')
 
             }
            // if(data.minute >= 0 || !data.second){
            //   return triggerNotification('Error in fetching chart data','error')
            //  }
            // console.log(data,'hhhh')
            setTimeout(()=>{
                  setTextFeild((dt)=>{return {...dt, engMin:data.minute || 0, engSec:data.second || 0,engHour:data.hour||0}})
            },1000)
              })
          });

          axios.post(`${baseurl}/getline`, {token:token}).then((response)=>{
            const data = response.data;
            
            if(!data.success){
              return triggerNotification('Error in charts data ','error')
 
             }
             if(!data.days && !data.userCount){
              return triggerNotification('Error in fetching Line chart data','error')
             }
              setTimeout(() => {
                setLineArr({dayArr:data.days, countArr:data.userCount})
              }, 1000);
          })
          
          axios.post(`${baseurl}/getlinebar`, {token:token}).then((response)=>{
            const data = response.data;
            if(!data.success){
             return triggerNotification('Error in fetching Line chart data','error')

            }
            if( data.register >= 0 && data.userCount >= 0){
             return triggerNotification('Error in fetching Line chart data','error')
            }
            setTimeout(() => {
              
              setBarArr({countArr:data.userCount,dayArr:data.days,registered:data.register})
            }, 1000);
            // console.log(data)
          })

         } catch (error) {
          triggerNotification('data not fatched')
            console.log(error);

         }

    },[])


    const state = {
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: lineArr.dayArr,
            labels: {
              style: {
                fontSize: '12px',  
                fontWeight: 'bold', 
                colors: ['#000'],   
              }
            }
          },
          yaxis: {
      labels: {
        style: {
          fontSize: '13px',  
          fontWeight: 'bold', 
          colors: ['#000'],   
        }
      }
    },
        
        },
        series: [
          {
            name: "Users",
            data: lineArr.countArr
          }
        ]
      };
      const state3 = {
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: barArr.dayArr,
            labels: {
              style: {
                fontSize: '12px',  
                fontWeight: 'bold', 
                colors: ['#000'],   
              }
            }
          },
          yaxis: {
          
      labels: {
        style: {
          fontSize: '13px',  
          fontWeight: 'bold', 
          colors: ['#000'],   
        }
      }
    },
        
        },
        series: [
          {
            name: "Total Active Users",
            data: lineArr.countArr,
         },
         {
          name: "Registered User",
            data: barArr.countArr,
         }
        ]
      };
   
    
    const state2 = {
      options: {
        labels: ['India', 'China', 'Nepal', 'Pakistan'], 
        stroke: {
          show: false, 
        },
        legend: {
          position: 'right',  
          fontSize: '13px',
          fontWeight: 600,  
          labels: {
            colors: ['#000'],   
          },
          itemMargin: {
            horizontal: 15,
            vertical: 5, 
          }
        }
      },
      series: [country.India, country.China, country.Nepal, country.Pakistan],
      labels: ['India', 'China', 'Nepal', 'Pakistan']
    }
    
    
  return (
    <div className={styles.container}>
      <AdminNavbar/>
      <div className={styles.chartdiv}>
        <div className={styles.chartSet1}>
        <div className={styles.chart1}>
        <div className={styles.c1}>
          <div className={styles.text}>
           <label><FontAwesomeIcon icon={faUsers}/>&nbsp; Total Users:<span> {textfeild.total}</span> </label>
           <label><FontAwesomeIcon icon={faCircle} size="2xs" style={{color: "#0bf427",}} />&nbsp; Today Active:<span> {textfeild.active}</span></label>
           <label><FontAwesomeIcon icon={faUser}  />&nbsp; Today Registered:<span> {barArr.registered}</span></label>
           <label><FontAwesomeIcon icon={faCalendarCheck}/>&nbsp; Monthly Active:<span> {textfeild.Mactive}</span></label>
           <label><FontAwesomeIcon size="lg" icon={faStopwatch} style={{color: "#006ec2",}} />&nbsp; Avg. Engagement Time:<span>{textfeild.engHour===0 ? " " : ` ${textfeild.engHour} Hour`} {textfeild.engMin} Minute {textfeild.engSec} Second </span></label>
          </div>
        <Chart
        options={state2.options}
            series={state2.series}
            type="donut"
            width="450"
           
            />
        </div>
        <div className={styles.c2}>
          <label><FontAwesomeIcon size="sm" style={{color: "#3268ff",}} icon={faUser} />&nbsp; Active Users In Last 7 Days</label>
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            width="900"
            height="300"
            
        />
        </div>
        </div>
        
        <div className={styles.chart2}>

          <Chart
            options={state3.options}
              series={state3.series}
              type="bar"
              width="500"
              height='600'
            
          />
        </div>
        
       
        </div>
       
        

      </div>
    </div>
  )
}

export default AdminAnalytics
