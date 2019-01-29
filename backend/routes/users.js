const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

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
                    res.json({
                        message: 'User created!',
                        result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Invalid authentication credentials!'
                    })
                });
        });
});

route.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
      if(!user) {
          return res.status(401).json({
              message: 'Auth failed'
          });
      }

      fetchedUser = user;
      
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
        if(!result) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }

        const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            'this_is_a_secret_and_it_should_be_long',
            { expiresIn: '1h' }
        );
        
        res.json({
            token,
            userId: fetchedUser._id
        });
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Invalid authentication credentials!'
        });
    });
});

module.exports = {route};
