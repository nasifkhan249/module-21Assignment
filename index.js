const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./src/routes/routes'); // Import your routes file

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/sales', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Use the routes defined in the routes.js file
app.use('/api/v1', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
