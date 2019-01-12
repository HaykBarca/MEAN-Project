const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Added successfully'
    });
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: 'asdf4546sdf',
            title: 'First post from Node',
            content: 'First content from Node'
        },
        {
            id: 'sdfsdfsdf5154',
            title: 'Second post from Node',
            content: 'Second content from Node'
        }
    ]

    res.status(200).json({
        message: 'Message with success',
        posts
    })
});

module.exports = {app};