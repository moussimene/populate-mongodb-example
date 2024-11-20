const express = require('express');
const app = express();
const port = 3000;
const User = require('./src/api/models/user');
const { default: mongoose } = require('mongoose');
const Equipement = require('./src/api/models/equipement');
require('dotenv').config();

require('./src/config/connectDb');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: 'Users retrieved succesfully', users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/users', async (req, res) => {
  const { name, age, email } = req.body;
  try {
    const user = new User({
      name: name,
      age: age,
      email: email,
    });
    await user.save();
    res.status(201).json({ message: 'saved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/add-equipement', async (req, res) => {
  const { code, nom, utilisateur } = req.body;
  try {
    const equipement = new Equipement({
      code: code,
      nom: nom,
      utilisateur: utilisateur,
    });
    await equipement.save();
    res.status(201).json({ message: 'saved successfully', equipement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/equipements', async (req, res) => {
  try {
    const equipements = await Equipement.find().populate({
      path: 'utilisateur',
      select: 'name',
    });
    res
      .status(200)
      .json({ message: 'Equipements retrieved succesfully', equipements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'id must be valid(objectId)' });
    }
    const user = await User.findById(id);
    if (user) {
      res.status(200).json({ message: 'found user', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get users based on query parameters
app.get('/search', async (req, res) => {
  const name = req.query.name;
  const age = req.query.age;

  const query = {};
  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }
  if (age) {
    query.age = age;
  }

  try {
    const users = await User.find(query);
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: 'No users found matching the criteria' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, age, email },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Log a message when the server is running
});
