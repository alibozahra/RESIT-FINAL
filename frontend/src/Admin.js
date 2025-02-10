import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  // Redirect if user is not admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      alert('Access denied. Admins only.');
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch Products
  useEffect(() => {
    fetch('http://localhost:5001/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/admin/add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      alert('Product added successfully!');
      setProducts([...products, { name, description, price }]);
      setName('');
      setDescription('');
      setPrice('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Remove Product
  const handleRemoveProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5001/admin/remove-product/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove product');
      }

      alert('Product removed successfully!');
      setProducts(products.filter(product => product.id !== productId));
    } catch (err) {
      console.error('Error removing product:', err);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      <h2>Add Product</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleAddProduct}>
        <label>Product Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <button type="submit">Add Product</button>
      </form>

      <h2>Manage Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => handleRemoveProduct(product.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
