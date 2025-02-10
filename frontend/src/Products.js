import React, { useState } from 'react';
import './Products.css'

const hardcodedProducts = [
  { id: 1, name: 'iPhone 15', description: 'Latest Apple iPhone with A16 Bionic chip.', price: 999.99, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRMASExxyZ1yU02ty84s0zg5GTGKWG_ysugQ&s', quantity: 0 },
  { id: 2, name: 'PlayStation 5', description: 'Sony PlayStation 5 gaming console.', price: 499.99, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsCEUgvB3-uC_5YYaw8Vupf9FXi8ZMGSgoWQ&s', quantity: 0 },
  { id: 3, name: 'MacBook Pro', description: 'Apple MacBook Pro with M2 chip.', price: 1299.99, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHlQ2rrMUifjToqz89YatbsEoUsX8qIHvLeA&s', quantity: 0 }
];

function Products() {
  const [products, setProducts] = useState(hardcodedProducts);

  // Function to Add Product to Cart & Update UI
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the Product Quantity in UI
    setProducts(products.map(p => 
      p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
    ));
  };

  return (
    <div className="products-container">
      <h1>Products</h1>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>In Cart: {product.quantity}</p> {/* Show Updated Quantity */}
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
