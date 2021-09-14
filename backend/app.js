//MongoDB pass: BKcaIlk6FWeyDhEw
//MongoDB connection: mongodb+srv://Natalia:<password>@cluster0.hl5dw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const express = require('express');
const mongoose = require('mongoose'); // Object Data Modeling library for MongoDB (manages relationships between data, provides schema validation)

const path = require('path');
const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');

const app = express(); //Run express app

//Connect to mongoDB database
mongoose.connect('mongodb+srv://Natalia:BKcaIlk6FWeyDhEw@cluster0.hl5dw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

app.use((req, res, next) => { //Handling CORS (Cross-Origin Resource Sharing) errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json()); //method inbuilt in express to recognize the incoming Request Object as a JSON Object

app.use('/images', express.static(path.join(__dirname, 'images'))); //Serving static files in Express

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;