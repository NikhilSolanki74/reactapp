import React from 'react'
import styles from './CSS/Loading2.module.css'
const Loading2 = () => {
  return (
    <div className={styles.div}>
    <div className={styles.gifdiv}>
      <img className={styles.gif} src='https://res.cloudinary.com/dzjvyptwz/image/upload/v1726117671/rqcgxfegbwrp8arotusr.gif' alt='Loading...'></img>
    </div>
    </div>
  )
}

export default Loading2