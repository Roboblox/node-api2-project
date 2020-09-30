const express = require("express");

const server = express();
server.use(express.json());

// import the router
const postRouter = require("./posts/posts-router");

// endpoints
// when the url of the request begins with /api/posts use the router
server.use("/api/posts", postRouter);

server.get("/", (req, res) => {
  res.send(`
  <h2>Lambda Hubs API</h>
  <p>Welcome to the Lambda Hubs API</p>
`);
});

// router to handle products
const port = 4000;
server.listen(port, () => {
  console.log("\n*** Server Running on http://localhost:4000 ***\n");
});
