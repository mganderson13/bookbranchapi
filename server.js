require("dotenv").config();
const morgan = require("morgan");
const express = require('express');
const app = express();
const cors = require('cors');

// Logging middleware
app.use(morgan("dev"));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
  }));

app.get('/', (req, res) => {
    res.send('Hello!!!');
});

//Route files 
const authRoutes = require('./routes/auth.js');
const mybooksRoutes = require('./routes/mybooks.js');

//Use routes
app.use('/auth', authRoutes);
app.use('/mybooks', mybooksRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;