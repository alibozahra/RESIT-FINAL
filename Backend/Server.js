const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());

const db = new sqlite3.Database('database.db', (err) => {
  if (err) console.error('Database Connection Error:', err.message);
  else console.log('Connected to SQLite3 database');
});

// ✅ Ensure All Tables Exist Before Insert
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      isAdmin INTEGER DEFAULT 0
    )
  `, () => {
    // ✅ Insert Default Admin
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.run(`
      INSERT INTO users (email, password, isAdmin) VALUES ('admin@electrofix.com', ?, 1)
      ON CONFLICT(email) DO NOTHING;
    `, [hashedPassword]);
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT
    )
  `, () => {
    // ✅ Insert Default Products (Without Quantity)
    db.run(`
      INSERT INTO products (name, description, price, image) VALUES
      ('iPhone 15', 'Latest Apple iPhone with A16 Bionic chip.', 999.99, 'iphone15.jpg'),
      ('PlayStation 5', 'Sony PlayStation 5 gaming console.', 499.99, 'ps5.jpg'),
      ('MacBook Pro', 'Apple MacBook Pro with M2 chip.', 1299.99, 'macbookpro.jpg')
      ON CONFLICT(name) DO UPDATE SET description=excluded.description, price=excluded.price, image=excluded.image;
    `);
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      order_date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

// ✅ Signup Route
app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function (err) {
    if (err) return res.status(400).json({ message: 'User already exists' });
    res.status(201).json({ message: 'Signup successful' });
  });
});

// ✅ Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Invalid credentials' });

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 'mySecretKey', { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful', userId: user.id });
  });
});

// ✅ Fetch Products
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});

// ✅ Add Product to Cart (Frontend Handles Cart in Local Storage)
app.post('/cart/add', (req, res) => {
  res.json({ message: 'Product added to cart' });
});

// ✅ Checkout Route (Stores Orders in Database)
app.post('/checkout', (req, res) => {
  const { user_id, name, address, payment_method, cartItems } = req.body;

  if (!name || !address || !payment_method || !cartItems.length) {
    return res.status(400).json({ message: 'Missing required fields or empty cart' });
  }

  db.run(
    'INSERT INTO orders (user_id, name, address, payment_method) VALUES (?, ?, ?, ?)',
    [user_id || null, name, address, payment_method],
    function (err) {
      if (err) {
        console.error("Checkout Error:", err.message);
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({ message: 'Order placed successfully!', order_id: this.lastID });
    }
  );
});

// ✅ Start Server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
