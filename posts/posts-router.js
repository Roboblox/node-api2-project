const router = require("express").Router();
const Posts = require("./../data/db");

// POST | /api/posts | Creates a post using the information sent inside the `request body`.
router.post("/", (req, res) => {
  if (req.body.title && req.body.contents) {
    Posts.insert(req.body)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  } else if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
});
//  Creates a comment for the post
router.post("/:id/comments", (req, res) => {
  if (!req.body.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else if (req.body.text) {
    Posts.findById(req.params.id)
      .then((post) => {
        if (post.length === 0) {
          res.status(404).json({
            message: "The post with the specified ID does not exist.",
          });
        } else {
          Posts.insertComment(req.body)
            .then((comment) => {
              res.status(201).json(comment);
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database",
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "The post information could not be retrieved." });
      });
  }
});
//Returns  all the post objects
router.get("/", (req, res) => {
  Posts.find()
    .then((allPosts) => {
      res.status(200).json(allPosts);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});
// Returns the post object with the specified id.
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(201).json(post);
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});
//Returns  all the comment in the post with the specified id.
router.get("/:id/comments", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        Posts.findPostComments(req.params.id)
          .then((comments) => {
            res.status(201).json(comments);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              error: "The comments information could not be retrieved.",
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});
// Removes the post with the specified id and returns the deleted post object
router.delete("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        Posts.remove(req.params.id)
          .then((post) => {
            res.status(201).end();
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "The post could not be removed" });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});
//updates the post with the specified `id`
router.put("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        if (!req.body.title || !req.body.contents) {
          res.status(400).json({
            errorMessage: "Please provide title and contents for the post.",
          });
        } else {
          Posts.update(req.params.id, req.body)
            .then((post) => {
              res.status(201).json(post);
            })
            .catch((error) => {
              console.log(error);
              res
                .status(500)
                .json({ error: "The post information could not be modified." });
            });
        }
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});
module.exports = router;
