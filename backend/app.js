const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./model/post').postModel;

const app = express();

mongoose.connect('mongodb://HaykBarca:haykbarca19939563@ds255754.mlab.com:55754/angularapp')
    .then(() => {
        console.log('Connected Successfully');
    })
    .catch((e) => {
        console.log(e);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        console.log(post);
        res.status(201).json({
            message: 'Added successfully',
            postId: createdPost._id
        });
    });
});

app.put('/api/posts/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({message: 'Success'});
    });
});

app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Message with success',
                posts: documents
            })
        });
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then(
            (result) => {
                console.log(result);
                res.status(200).json({ message: 'Post deleted.' });
            }
        )
});

module.exports = {app};