const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts').route;
const usersRoutes = require('./routes/users').route;


const app = express();

mongoose.connect('mongodb://HaykBarca:' + process.env.MONGO_PW +'@ds255754.mlab.com:55754/angularapp', { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        console.log('Connected Successfully');
    })
    .catch((e) => {
        console.log(e);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
  });

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

module.exports = {app};