import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Component/Login";
import Signin from "./Component/Signin";
import ForgotPassword from "./Component/ForgotPassword";
import Notification from "./Component/Notification";
import Homepage from "./Component/Homepage";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import ResetPassword from "./Component/ResetPassword";
import ChangePassword from "./Component/ChangePassword";
import Profile from "./Component/Profile";
import Edit from "./Component/Edit";
import AdminHomepage from "./Component/AdminComponent/AdminHomepage";
import AdminProfile from "./Component/AdminComponent/AdminProfile";
import AdminEdit from "./Component/AdminComponent/AdminEdit";
import UserPanel from "./Component/AdminComponent/UserPanel";
import AdminAnalytics from "./Component/AdminComponent/AdminAnalytics";
import SellerHomepage from "./Component/SellerComponent/SellerHomepage";
import ProtectedSellerRoute from "./ProtectedSellerRoute";
import SellerEdit from "./Component/SellerComponent/SellerEdit";
import SellerProfile from "./Component/SellerComponent/SellerProfile";
import AddProduct from "./Component/SellerComponent/AddProduct";

function App() {
  return (
    <Router>
      <Notification />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute>
              <Edit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/adminhomepage"
          element={
            <ProtectedAdminRoute>
              <AdminHomepage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/adminprofile"
          element={
            <ProtectedAdminRoute>
              <AdminProfile />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/adminedit"
          element={
            <ProtectedAdminRoute>
              <AdminEdit />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/userpanel"
          element={
            <ProtectedAdminRoute>
              <UserPanel />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedAdminRoute>
              <AdminAnalytics />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/sellerhome"
          element={
            <ProtectedSellerRoute>
              <SellerHomepage />
            </ProtectedSellerRoute>
          }
        />

        <Route
          path="/selleredit"
          element={
            <ProtectedSellerRoute>
              <SellerEdit />
            </ProtectedSellerRoute>
          }
        />

        <Route
          path="/sellerprofile"
          element={
            <ProtectedSellerRoute>
              <SellerProfile />
            </ProtectedSellerRoute>
          }
        />
        <Route
          path="/addproduct"
          element={
            <ProtectedSellerRoute>
              <AddProduct />
            </ProtectedSellerRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
