const express = require('express')
const Posts = require("../data/db"); // USE LATER

const router = express.Router()

router.get('/api/posts', (req, res) => {
  console.log(req.query) 
  Posts.find(req.query)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json(
        { error: "The posts information could not be retrieved." }
    );
  });
});

router.get('/api/posts/:id', (req, res) => {

  Posts.findById(req.params.id)
  .then(post => {
    if (post.length === 0) {
        res.status(500).json({ message: "The post with the specified ID does not exist." });
      
    } else {
        res.status(200).json(post);
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the post',
    });
  });
});

router.post('/api/posts', (req, res) => {
  Posts.insert(req.body)
   try {
     if(req.body.title && req.body.contents){
        res.status(201).json(post);
         } else{
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        
         }
       }
   catch {
 // log error to database
      console.log(error);
      res.status(500).json({
      message: 'Error adding the post',
        });
         }
    });

router.delete('/api/posts/:id', (req, res) => {
  Posts.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'The post has been nuked' });
    } else {
      res.status(404).json({ message: 'The post could not be found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error removing the post',
    });
  });
});

router.put('/api/posts/:id', (req, res) => {
  const changes = req.body;
  Posts.update(req.params.id, changes)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'The post could not be found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error updating the post',
    });
  });
});

// add an endpoint that returns all the messages for a hub
router.get('/api/posts/:id/comments', (req, res) => {
  // we need to find a good function inside the model
  postId = req.params.id
  Posts.findPostComments(postId)
    .then(data => {
      // throw new Error('that was arghhhhh!!!!!!')
      console.log(data)
      if (!data.length) {
        res.status(404).json({
          message: 'No messages, OR No hub with id ' + postId
        })
      } else {
        res.status(200).json(data)
      }
    })
    .catch(error => {
      console.log(error.message, error.stack)
      res.status(500).json({
        // message: 'that was an error of some sort'
        message: error.message,
        stack: error.stack,
      })
    })
})
// add an endpoint for adding new message to a hub [POST] { sender, text } :id
router.post('/api/posts/:id/comments', (req, res) => {
    if (!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
      } else if (req.body.text) {
        Posts.findById(req.params.id)
        .then(post => {
          if (post.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
          } else {
            Posts.insertComment(req.body)
              .then(comment => {
                res.status(201).json(comment);
              })
              .catch(error => {
                console.log(error);
                res.status(500).json({error: "There was an error while saving the comment to the database" });
              });
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({ error: "The post information could not be retrieved." })
        })
      } 
    });

module.exports = router
