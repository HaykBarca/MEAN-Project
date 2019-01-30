const express = require('express');

const userControllers = require('../controllers/users');

const route = express.Router();

route.post('/signup', userControllers.signupUser);

route.post('/login', userControllers.loginUser);

module.exports = {route};
