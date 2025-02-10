import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css'

function Checkout() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load Cart Item
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  // Handle Checkout Process
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!name || !address) {
      alert('Please fill in all required fields.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please log in to place an order.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty. Add products before placing an order.');
      return;
    }

    const orderData = {
      user_id: user.id,
      name,
      address,
      payment_method: paymentMethod,
      cartItems
    };

    try {
      const response = await fetch('http://localhost:5001/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      alert('Order placed successfully!');
      localStorage.removeItem('cart'); // Clear cart after successful order
      navigate('/'); // Redirect to home page

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to connect to the server. Please check if the backend is running.');
    }
  };

  return (
    <div className='checkout-container'>
      <h1>Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Add products before proceeding to checkout.</p>
      ) : (
        <form onSubmit={handleCheckout} className="checkout-form">
          <label>Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Shipping Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />

          <label>Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>

          <h2>Order Summary</h2>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                {item.name} - {item.quantity} x ${item.price} = ${item.quantity * item.price}
              </li>
            ))}
          </ul>

          <button type="submit" className="place-order-btn">Place Order</button>
        </form>
      )}
    </div>
  );
}

export default Checkout;
