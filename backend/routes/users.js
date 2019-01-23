const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../model/user').userModel;

const route = express.Router();

route.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(result => {
                    res.send(201).json({
                        message: 'User created!',
                        result
                    })
                })
                .catch(err => {
                    res.send(500).json({
                        err
                    })
                });
        });
});

module.exports = {route};
