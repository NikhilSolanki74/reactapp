import React from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  return (
    <ToastContainer
      position="top-left"
      autoClose={3000}
      hideProgressBar
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
      transition={Bounce}
    />
  );
};

export const triggerNotification = (message, type = 'success') => {
  toast[type](message);
};

export default Notification;
