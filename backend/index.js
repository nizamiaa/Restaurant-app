const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const dataDir = path.join(__dirname, 'data');
const menuPath = path.join(dataDir, 'menu.json');
const ordersPath = path.join(dataDir, 'orders.json');

let orders = [];

const readMenu = () => {
  try {
    return JSON.parse(fs.readFileSync(menuPath, 'utf8'));
  } catch {
    return [];
  }
};

const writeMenu = (menu) => {
  fs.writeFileSync(menuPath, JSON.stringify(menu, null, 2));
};

const loadOrders = () => {
  try {
    return JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
  } catch {
    return [];
  }
};

const saveOrders = (orders) => {
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
};

// Load orders on startup
orders = loadOrders();

app.get('/api/menu', (req, res) => {
  res.json(readMenu());
});

app.post('/api/menu', (req, res) => {
  const menu = readMenu();
  const newItem = { ...req.body, id: Date.now().toString() };
  menu.push(newItem);
  writeMenu(menu);
  res.json(menu);
});

app.put('/api/menu/:id', (req, res) => {
  const menu = readMenu();
  const index = menu.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'not found' });
  menu[index] = { ...menu[index], ...req.body };
  writeMenu(menu);
  res.json(menu);
});

app.delete('/api/menu/:id', (req, res) => {
  const menu = readMenu();
  const filtered = menu.filter(item => item.id !== req.params.id);
  writeMenu(filtered);
  res.json(filtered);
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === 'admin' && password === 'admin') {
    return res.json({ token: 'admintoken123', role: 'admin' });
  }
  if (username === 'user' && password === 'user') {
    return res.json({ token: 'usertoken123', role: 'user' });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const order = req.body || {};
  order.id = Date.now();
  order.status = 'received';
  order.createdAt = new Date().toISOString();
  orders.push(order);
  saveOrders(orders);
  res.status(201).json(order);
});

app.put('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id == req.params.id);
  if (!order) return res.status(404).json({ error: 'not found' });
  order.status = req.body.status;
  saveOrders(orders);
  res.json(order);
});

app.delete('/api/orders/:id', (req, res) => {
  orders = orders.filter(o => o.id != req.params.id);
  saveOrders(orders);
  res.json({ success: true });
});

app.get('/', (req, res) => {
  res.send('Restaurant backend running');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
