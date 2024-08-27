import React, { useEffect, useState } from 'react'
import styles from '../CSS/AdminCSS/AdminAnalytics.module.css'
import AdminNavbar from './AdminNavbar'
import { setLine } from '../../Redux/Features/UnderlineSlice'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chart from "react-apexcharts";
import axios from 'axios';
import { faUsers,faEye,faCircle ,faStopwatch} from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons/faCalendarCheck'


const AdminAnalytics = () => {
    const baseurl = process.env.REACT_APP_ADMIN_BASE_URL || '';
    const token = localStorage.getItem('token') || 'notoken';
    const dispatch = useDispatch();
    const [country ,setCountry] = useState({India:100, China:0, Nepal:0, Pakistan:0});
    const [textfeild ,setTextFeild] = useState({total:0,active:0,Mactive:0,AET:10})
    useEffect(()=>{
        dispatch(setLine(3));
         try {
            
         axios.post(`${baseurl}/getchart` , {token:token}).then((response)=>{
            const data = response.data;
              console.log(data);
              setTimeout(()=>{
                  
                  setCountry(data.countrydata);  
                setTextFeild((dt)=>{return {...dt,total:data.total,active:data.activeUser[0].activeUser,Mactive:data.Mactive[0].Mactive}})
              },1000)
          });
         } catch (error) {
            console.log(error)
         }



    },[])


    const state = {
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
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
            data: [30, 40, 45, 50, 49, 60, 70, 91]
          }
        ]
      };
      const state3 = {
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
            data: [30, 40, 15, 50, 49, 30, 70]
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
           <label><FontAwesomeIcon icon={faCircle} size="2xs" style={{color: "#0bf427",}} />&nbsp; Current Active:<span> {textfeild.active}</span></label>
           <label><FontAwesomeIcon icon={faCalendarCheck}/>&nbsp; Monthly Active:<span> {textfeild.Mactive}</span></label>
           <label><FontAwesomeIcon size="lg" icon={faStopwatch} style={{color: "#006ec2",}} />&nbsp; Avg. Engagement Time:<span> {textfeild.AET} Min. </span></label>
          </div>
        <Chart
        options={state2.options}
            series={state2.series}
            type="donut"
            width="450"
           
            />
        </div>
        <div className={styles.c2}>

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
