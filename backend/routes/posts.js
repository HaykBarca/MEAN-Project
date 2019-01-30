const express = require('express');

const postsControllers = require('../controllers/posts');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const route = express.Router();

route.post('', checkAuth, extractFile, postsControllers.createPost);

route.put('/:id', checkAuth, extractFile, postsControllers.updatePost);

route.get('', postsControllers.getPosts);

route.get('/:id', postsControllers.getPost);

route.delete('/:id', checkAuth, postsControllers.deletePost);

module.exports = {route};