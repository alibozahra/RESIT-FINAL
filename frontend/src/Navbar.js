import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // ✅ Redirect to Login if Not Logged In
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    alert('Logged out successfully!');
    navigate('/login'); // ✅ Redirect to Login Page
  };

  return (
    <nav className="navbar">
      <h1>Electrofix</h1>
      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
            {user?.isAdmin && <li><Link to="/admin">Admin</Link></li>}
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><button className="signup-btn" onClick={() => navigate('/signup')}>Go to Signup</button></li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
