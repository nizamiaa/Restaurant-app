// ...existing code...
// (Move these route definitions after app is initialized below)
const express = require('express');
const cors = require('cors');
const { sql, getPool } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());


// Delete menu item (SQL-based, correct)
app.delete('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbo.Menu OUTPUT DELETED.* WHERE id=@id');
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Menu item not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item', details: err.message });
  }
});
    
    

const PORT = process.env.PORT || 4000;



app.get('/api/menu', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Menu');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu', details: err.message });
  }
});


app.post('/api/menu', async (req, res) => {
  const { name, price, description, imageUrl, category } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('price', sql.Decimal(10,2), price)
      .input('description', sql.NVarChar, description)
      .input('category', sql.NVarChar, category)
      .input('imageUrl', sql.NVarChar, imageUrl)
      .query(`
        INSERT INTO Menu (name, price, description, category, imageUrl)
        OUTPUT INSERTED.*
        VALUES (@name, @price, @description,@category, @imageUrl)
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to add menu item',
      details: err.message
    });
  }
});



app.put('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, imageUrl, category } = req.body;

    const pool = await getPool();

    const updateResult = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('name', sql.NVarChar, name)
      .input('price', sql.Decimal(10, 2), parseFloat(price))
      .input('description', sql.NVarChar, description)
      .input('category', sql.NVarChar, category)
      .input('imageUrl', sql.NVarChar, imageUrl)
      .query(`
        UPDATE Menu
        SET name = @name,
            price = @price,
            description = @description,
            category = @category,
            imageUrl = @imageUrl
        WHERE id = @id
      `);

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const selectResult = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM Menu WHERE id = @id');

    res.json(selectResult.recordset[0]);

  } catch (err) {
    res.status(500).json({
      error: 'Failed to update menu item',
      details: err.message
    });
  }
});


app.delete('/api/menu/:id', async (req, res) => {
  try {
    const pool = await getPool();

    await pool.request()
      .input('id', sql.Int, parseInt(req.params.id))
      .query('DELETE FROM dbo.Menu WHERE id = @id');

    res.json({ success: true });

  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({
      error: 'Failed to delete menu item',
      details: err.message
    });
  }
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password, language } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .input('language', sql.NVarChar, language || 'en')
      .query('INSERT INTO Users (username, password, language) OUTPUT INSERTED.id, INSERTED.username, INSERTED.language VALUES (@username, @password, @language)');
    const user = result.recordset[0];
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Username already exists' });
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE username=@username');
    const user = result.recordset[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, language: user.language, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Sign out (client can just delete token, but endpoint for completeness)
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});


app.get('/api/orders', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Orders');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});


app.post('/api/orders', async (req, res) => {
  const { items, customerName, tableNumber, totalPrice } = req.body;

  if (!items || !customerName || !tableNumber || !totalPrice) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const total = parseFloat(totalPrice);
  if (isNaN(total)) {
    return res.status(400).json({ error: 'Total price invalid' });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('items', sql.NVarChar, JSON.stringify(items))
      .input('customerName', sql.NVarChar, customerName)
      .input('tableNumber', sql.NVarChar, tableNumber)
      .input('totalPrice', sql.Decimal(10,2), total)
      .input('status', sql.NVarChar, 'received')
      .input('createdAt', sql.DateTime, new Date())
      .query(`
        INSERT INTO Orders (items, customerName, tableNumber, totalPrice, status, createdAt)
        OUTPUT INSERTED.*
        VALUES (@items, @customerName, @tableNumber, @totalPrice, @status, @createdAt)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});




app.put('/api/orders/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('status', sql.NVarChar, status)
      .query('UPDATE Orders SET status=@status WHERE id=@id; SELECT * FROM Orders WHERE id=@id');
    if (result.recordset.length === 0) return res.status(404).json({ error: 'not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order', details: err.message });
  }
});


app.delete('/api/orders/:id', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().input('id', sql.Int, req.params.id).query('DELETE FROM Orders WHERE id=@id');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order', details: err.message });
  }
});


app.get('/api/feedback', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Feedback');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback', details: err.message });
  }
});


app.post('/api/feedback', async (req, res) => {
  const { name, email, type, message, createdAt } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('type', sql.NVarChar, type)
      .input('message', sql.NVarChar, message)
      .input('createdAt', sql.DateTime, createdAt)
      .query('INSERT INTO Feedback (name, email, type, message, createdAt) OUTPUT INSERTED.* VALUES (@name, @email, @type, @message, @createdAt)');
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add feedback', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Restaurant backend running');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));