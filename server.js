const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/students', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('MongoDB connection successful');
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

const userSchema = new mongoose.Schema({
  reg_no: String,
  name: String,
  email: String,
  branch: String,
});

const Users = mongoose.model('data', userSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle both GET and POST requests
app.route('/post')
  .get(async (req, res) => {
    const { reg_no, name, email, branch } = req.query;
    try {
      const user = new Users({ reg_no, name, email, branch });
      await user.save();
      console.log(user);
      res.send('Form submission successful (GET)');
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).send('An error occurred while submitting the form (GET)');
    }
  })
  .post(async (req, res) => {
    const { reg_no, name, email, branch } = req.body;
    try {
      const user = new Users({ reg_no, name, email, branch });
      await user.save();
      console.log(user);
      res.send('Form submission successful (POST)');
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).send('An error occurred while submitting the form (POST)');
    }
  });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
