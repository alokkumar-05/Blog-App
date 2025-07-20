const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const UserModel = require('./models/User');

const app = express();
const PORT = 4000;
const JWT_SECRET = 'asdfe45we45w345wegw345werjktjwertkj';

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Configuration to allow frontend access
app.use(cors({
  origin: 'http://localhost:3007',
  credentials: true
}));

// ✅ MongoDB Connection
mongoose.connect('mongodb+srv://alokkumarswn01:axC9NbWkbdks_kQ@cluster0.qfdfqoh.mongodb.net/blogApp?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
    }).json({ id: user._id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Test Route (Optional: Useful for debugging)
app.get('/', (req, res) => {
  res.send('API is working');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
