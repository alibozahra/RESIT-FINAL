import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Navbar';
import Home from './Home'; // ✅ Import Home.js
import Login from './Login';
import Signup from './Signup';
import Products from './Products';
import Cart from './Cart';
import Checkout from './Checkout';
import Admin from './Admin';

function Main() {
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      {isLoggedIn && <NavBar />} {/* ✅ Show Navbar only when logged in */}

      <Routes>
        {/* ✅ Redirect Unauthenticated Users to Login */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/products" element={isLoggedIn ? <Products /> : <Navigate to="/login" />} />
        <Route path="/cart" element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={isLoggedIn ? <Checkout /> : <Navigate to="/login" />} />

        {/* ✅ Admin Page - Only Accessible by Admin Users */}
        <Route path="/admin" element={isLoggedIn && user?.isAdmin ? <Admin /> : <Navigate to="/" />} />

        {/* ✅ Login & Signup Routes */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <Signup />} />

        {/* ✅ Redirect to Home if Route Not Found */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default Main;
