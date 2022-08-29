// The app.js file contains the application

// Import of the express application
const express = require ('express');
// Import the mongoose application
const mongoose = require('mongoose');
// Import the sauceRoutes
const sauceRoutes = require('./routes/sauce');
// Import the userRoutes
const userRoutes = require('./routes/user');
// Import the path access to the file system
const path = require('path');
// Import the environment variables 
require('dotenv').config();
// Import of helmet to prevent the XSS attack
const helmet = require('helmet');

// const app that buil an express application
const app = express();
// Call of the helmet package with a crossOriginResourcePolicy on false to display my images on the website
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(express.json());

mongoose.connect('mongodb+srv://' + process.env.MONGO_DB_USERNAME + ':' + process.env.MONGO_DB_PASSWORD + '@cluster0.ctluky6.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !' + error));
  

// -------------------------------------------------------------
// CORS
// -------------------------------------------------------------
// The CORS define how the servers and navigators will interact by specifying which ressources can be allowed
// To allow cross-origin request (and avoid CORS error), we need control access headers for all of our response object
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
  
  
  