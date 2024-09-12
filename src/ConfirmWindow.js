import React, { useState } from 'react';
import styles from './Component/CSS/ConfirmWindow.module.css';

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [callback, setCallback] = useState(null);

  const confirm = (message) => {
    setMessage(message);
    setIsOpen(true);
    return new Promise((resolve) => {
      setCallback(() => resolve);
    });
  };

  const handleConfirm = (result) => {
    setIsOpen(false);
    if (callback) callback(result);
  };

  const ConfirmWindow = () => {
    if (!isOpen) return null;

    return (
      <div className={styles.overlay}>
        <div className={styles.confirmBox}>
          <p className={styles.message}>{message}</p>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${styles.ok}`}
              onClick={() => handleConfirm(true)}
            >
              OK
            </button>
            <button
              className={`${styles.button} ${styles.cancel}`}
              onClick={() => handleConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return { confirm, ConfirmWindow };
};
