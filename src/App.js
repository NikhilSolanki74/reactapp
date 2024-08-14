import React from "react";
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import Login from "./Component/Login";
import Signin from "./Component/Signin";
import ForgotPassword from "./Component/ForgotPassword";
import Notification from "./Component/Notification";
import Homepage from "./Component/Homepage";
import ProtectedRoute from "./ProtectedRoute";
import ResetPassword from './Component/ResetPassword'
import ChangePassword from "./Component/ChangePassword";
import Profile from "./Component/Profile";

function App() {
  return (
    
    <Router>
     <Notification/>
     <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/signin' element={<Signin/>} />
      <Route path='/resetpassword' element={<ResetPassword/>} />
      <Route path='/forgotpassword' element={<ForgotPassword/>} />
      <Route path='/changepassword' element={<ChangePassword/>} />
      <Route path='/home' element={
      <ProtectedRoute>
      <Homepage/>
      </ProtectedRoute>  
      } />
      <Route path='/profile' element={
      <ProtectedRoute>
      <Profile/>
      </ProtectedRoute>  
      } />


     </Routes>
    </Router>   
    
  );
}

export default App;
