const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
const port = 2006;

mongoose.connect('mongodb://localhost:27017/medconsult')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phone_number: String,
});

const User = mongoose.model('users', userSchema);

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve frontend
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'signup.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));

// Signup Route
app.post('/signup', async (req, res) => {
  const { Username, email, password, repassword, phone_number } = req.body;

  if (password !== repassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: Username,
      email,
      password: hashedPassword,
      phone_number,
    });

    await newUser.save();
    return res.status(201).json({ message: "Signup successful. Please log in." });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error during signup." });
  }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).send('User not found.');
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).send('Invalid credentials.');
  
      // Send JSON instead of static file
      return res.status(200).json({ success: true, username: user.username });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).send('Server error during login.');
    }
  });
  

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
