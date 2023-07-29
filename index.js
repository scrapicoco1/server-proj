//ייבוא ואתחול
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { LoadMenuToDB } = require('./models/menu.model');
const { insertDefaultAdmin } = require('./models/admin.model');
const session = require('express-session'); 


const PORT = process.env.PORT || 5500;

//יצירת השרת
let server = express();
server.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))
server.use(express.json());
server.use(express.urlencoded({extended: true})); 
server.use(cors());

server.use(express.static(path.join(__dirname, 'public')))

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

//for photos
server.use('/admin/Photos/',express.static(path.join(__dirname, 'public/items')))

// admin routes
server.use('/admin', require('./routes/admin.route'));
//ניתוב
server.use('/api/user', require('./routes/users.route'));
server.use('/api/menu', require('./routes/menu.route'));

LoadMenuToDB();
insertDefaultAdmin();

//הפעלת השרת
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
