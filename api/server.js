const express = require('express');
const postsRouter = require('../posts/posts-router')

const server = express();

// are where we configure the app/server
server.use(express.json()); // gives Express the ability to parse the req.body
server.use(postsRouter)

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Posts API</h>
    <p>Welcome to the Lambda Posts API</p>
  `);
});

// common.js equiv of export default
module.exports = server
