import React from 'react'
import styles from './CSS/Loading.module.css'
const Loading = () => {
  return (
    <div className={styles.div}>
    <div className={styles.gifdiv}>
      <img className={styles.gif} src='https://res.cloudinary.com/dzjvyptwz/image/upload/v1724565607/d3sudd8i6fvubr6kulwd.gif' alt='Loading...'></img>
    </div>
    </div>
  )
}

export default Loading
