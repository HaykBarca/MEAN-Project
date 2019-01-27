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
                    res.sendStatus(500).json({
                        err
                    })
                });
        });
});

route.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
      if(!user) {
          return res.sendStatus(401).json({
              message: 'Auth failed'
          });
      }

      fetchedUser = user;
      
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
        if(!result) {
            return res.sendStatus(401).json({
                message: 'Auth failed'
            });
        }

        const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            'this_is_a_secret_and_it_should_be_long',
            { expiresIn: '1h' }
        );
        
        res.json({token});
    })
    .catch(err => {
        return res.sendStatus(401).json({
            message: 'Auth failed'
        });
    });
});

module.exports = {route};
