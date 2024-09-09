// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const PaymentSuccess = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate('/');  // Redirect to home page or wherever after 3 seconds
//     }, 3000);

//     return () => clearTimeout(timer);  // Clear timeout if component unmounts
//   }, [navigate]);

//   return (
//     <div style={successStyle}>
//       <h2>Payment Successful!</h2>
//       <p>Your cart has been cleared. You will be redirected shortly.</p>
//       <button onClick={() => navigate('/home')}>Cancel</button>
//     </div>
//   );
// };

// const successStyle = {
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   alignItems: 'center',
//   minHeight: '100vh',
//   backgroundColor: '#f5f5f5',
//   textAlign: 'center',
//   color: '#333',
// };

// export default PaymentSuccess;