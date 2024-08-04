const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// حافظه in-memory برای ذخیره‌سازی اطلاعات کاربران
const peers = {};

// استفاده از body-parser برای تجزیه درخواست‌های JSON
app.use(bodyParser.json());
app.use(cors()); // افزودن CORS middleware

// Endpoint 1: ثبت نام مشخصات همتا
app.post('/register', (req, res) => {
  const { username, ip, port } = req.body;

  if (!username || !ip || !port) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (!peers[username]) {
    peers[username] = { ip, port };
    console.log(peers);
    res.status(201).json({ message: 'Peer registered successfully' });
  } else {
    peers[username] = { ip, port };
    console.log(peers);
    res.status(200).json({ message: 'Peer updated successfully' });
  }
});

// Endpoint برای حذف یک همتا از لیست همتاهای آنلاین
app.post('/unregister', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Missing username' });
  }

  if (peers[username]) {
    delete peers[username];
    console.log(peers);
    res.status(200).json({ message: 'Peer removed successfully' });
  } else {
    res.status(404).json({ error: 'Peer not found' });
  }
});

// Endpoint 2: دریافت لیستی از تمامی همتاها
app.get('/peers', (req, res) => {
  const peerList = Object.entries(peers).map(([username, { ip, port }]) => ({
    username,
    ip,
    port,
  }));
  res.json({ peers: peerList });
});

// Endpoint 3: دریافت اطلاعات یک همتا
app.get('/peerinfo', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Missing username' });
  }

  const peerInfo = peers[username];

  if (!peerInfo) {
    return res.status(404).json({ error: 'Peer not found' });
  }

  res.json({ peer: peerInfo });
});

// شروع به کار سرور
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
