// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MovieList from "./MovieList";
import Login from "./Login";
import Register from "./register";
import MoviePlayer from "./MoviePlayer";
import AdminLogin from "./adminlogin";
import AdminDashboard from "./admindashboard";
import MemberList from "./memberlist";
import Category from "./category";
import Home from "./home";
import AdminMovies from "./AdminMovies";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Cart from "./Cart";
import Payment from "./Payment";
import AdminPayments from "./AdminPayments";
import Subscription from "./Subscription";
import AdminSubscriptions from "./AdminSubscriptions";
import MyWatch from "./MyWatch";
import Account from "./Account";
import RevenueChart from "./AdminRevenue";
import AdminExpireDashboard from "./AdminExpireDashboard";

// เช็คว่ามี user login หรือยัง
const isLoggedIn = () => !!localStorage.getItem("user");

// เช็คว่า admin login หรือยัง
const isAdminLoggedIn = () => !!localStorage.getItem("admin");

// Route สำหรับ user
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

// Route สำหรับ admin
function AdminPrivateRoute({ children }) {
  return isAdminLoggedIn() ? children : <Navigate to="/adminlogin" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* หน้าแรก */}
        <Route path="/" element={<Home />} />

        {/* User routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route
          path="/movielist"
          element={
            <PrivateRoute>
              <MovieList />
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />
        <Route
          path="/mywatch"
          element={
            <PrivateRoute>
              <MyWatch />
            </PrivateRoute>
          }
        />
        <Route
          path="/movieplayer/:id"
          element={
            <PrivateRoute>
              <MoviePlayer />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <PrivateRoute>
              <Subscription />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />

        {/* Admin routes */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route
          path="/admindashboard"
          element={
            <AdminPrivateRoute>
              <AdminDashboard />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/memberlist"
          element={
            <AdminPrivateRoute>
              <MemberList />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/category"
          element={
            <AdminPrivateRoute>
              <Category />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/AdminMovies"
          element={
            <AdminPrivateRoute>
              <AdminMovies />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/AdminPayments"
          element={
            <AdminPrivateRoute>
              <AdminPayments />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/AdminSubscriptions"
          element={
            <AdminPrivateRoute>
              <AdminSubscriptions />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/AdminRevenue"
          element={
            <AdminPrivateRoute>
              <RevenueChart/>
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/AdminExpireDashboard"
          element={
            <AdminPrivateRoute>
              <AdminExpireDashboard/>
            </AdminPrivateRoute>
          }
        />

        {/* ถ้า path ไม่ตรง → redirect กลับหน้าแรก */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;