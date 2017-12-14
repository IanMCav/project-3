const models = require('../models');

const Post = models.Post;

// router call for displaying all your posts
const userPage = (req, res) => {
  Post.PostModel.findByAuthor(req.session.account.username, (err, docs) => {
    if (err) {
      console.log('err');
      return res.status(400).json({ error: 'An error occured!' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), Posts: docs});
  });
};

// router call for making a new post
const makePost = (req, res) => {
  if (!req.body.thePost) {
    return res.status(400).json({ error: 'Please input a post.' });
  }

  const validateBody = req.body.thePost.trim().split('\n');

  let isInvalid = false;

  for (let i = 0; i < validateBody.length; i++) {
    if (validateBody[i].length > 30) {
      isInvalid = true;
    }
  }

  if (!isInvalid) {
    const postData = {
      contents: req.body.thePost,
      author: req.session.account.username,
    };

    const newPost = new Post.PostModel(postData);

    const postPromise = newPost.save();

    postPromise.then(() => res.json({ redirect: '/profile' }));

    postPromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Post already exists' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });

    return postPromise;
  }
  return res.status(400).json({ error: 'A line was too many characters wide!' });
};

// router call for grabbing all your new posts
const getPosts = (request, response) => {
  const req = request;
  const res = response;

  if (req.body.searchUsername) {
    return Post.PostModel.findByAuthor(req.body.searchUsername, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'an error occurred' });
      }

      return res.json({ posts: docs });
    });
  }
  return Post.PostModel.findByAuthor(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occurred' });
    }

    return res.json({ posts: docs });
  });
};

//set up data for the main page
const homePage = (req, res) => {
  Post.PostModel.findByDate(Date.now(), (err, docs) => {
    if(err) {
      console.log(err);
      
      return res.status(400).json({ error: "an error has occurred"});
    };
    
    return res.json({posts: docs });
  });
};

module.exports.userPage = userPage;
module.exports.getPosts = getPosts;
module.exports.new = makePost;
module.exports.homePage = homePage;