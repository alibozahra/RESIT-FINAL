const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Database Connection Error:', err.message);
  } else {
    console.log('Connected to SQLite3 database');
  }
});

// Ensure tables are created when the database initializes
db.serialize(() => {
  console.log("Ensuring Tables Exist...");

  // Create Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      isAdmin INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) console.error('Error creating users table:', err.message);
    else console.log('Users table ready');
  });

  // Insert Default Admin User
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.run(`
    INSERT INTO users (email, password, isAdmin) VALUES (?, ?, ?)
    ON CONFLICT(email) DO NOTHING;
  `, ['ali@electrofix.com', hashedPassword, 1], (err) => {
    if (err) console.error('Error inserting admin user:', err.message);
    else console.log('Admin user inserted');
  });

  // Create Products Table with UNIQUE constraint on `name`
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT
    )
  `, (err) => {
    if (err) console.error('Error creating products table:', err.message);
    else console.log('Products table ready');
  });

  // Insert Default Products
  db.run(`
    INSERT INTO products (name, description, price, image) VALUES
    (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)
    ON CONFLICT(name) DO NOTHING;
  `, 
  [
    'iPhone 15', 'Latest Apple iPhone with A16 Bionic chip.', 999.99, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRMASExxyZ1yU02ty84s0zg5GTGKWG_ysugQ&s',
    'PlayStation 5', 'Sony PlayStation 5 gaming console.', 499.99, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsCEUgvB3-uC_5YYaw8Vupf9FXi8ZMGSgoWQ&s',
    'MacBook Pro', 'Apple MacBook Pro with M2 chip.', 1299.99, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHlQ2rrMUifjToqz89YatbsEoUsX8qIHvLeA&s'
  ], 
  (err) => {
    if (err) console.error('Error inserting default products:', err.message);
    else console.log('Default products inserted');
  });

  // Create Orders Table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      product_id INTEGER,
      order_date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `, (err) => {
    if (err) console.error('Error creating orders table:', err.message);
    else console.log('Orders table ready');
  });
});

module.exports = db;
