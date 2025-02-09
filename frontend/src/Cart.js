import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css'

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // ✅ Load Cart Items from LocalStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  // ✅ Remove Item from Cart
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // ✅ Calculate Total Price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // ✅ Proceed to Checkout
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add items before proceeding.");
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className='cart-container'>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Total Price: ${item.price * item.quantity}</p>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h2>Total: ${calculateTotal()}</h2>
          <button className="checkout-btn" onClick={proceedToCheckout}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
}

export default Cart;
