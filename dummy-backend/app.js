const express = require('express');
const bodyParser = require('body-parser');

const { getStoredPosts, storePosts } = require('./data/posts');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/posts', async (req, res) => {
  const storedPosts = await getStoredPosts();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ posts: storedPosts });
});

app.get('/posts/:id', async (req, res) => {
  const storedPosts = await getStoredPosts();
  const post = storedPosts.find((post) => post.id === req.params.id);
  res.json({ post });
});

app.post('/posts', async (req, res) => {
  const existingPosts = await getStoredPosts();
  const postData = req.body;
  const newPost = {
    ...postData,
    id: Math.random().toString(),
  };
  const updatedPosts = [newPost, ...existingPosts];
  await storePosts(updatedPosts);
  res.status(201).json({ message: 'Stored new post.', post: newPost });
});

app.put('/posts/:id', async (req, res) => {
  const storedPosts = await getStoredPosts();
  const postIndex = storedPosts.findIndex((post) => post.id === req.params.id);
  
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  const updatedPost = {
    ...storedPosts[postIndex],
    ...req.body,
    id: req.params.id, // Ensure ID doesn't change
  };
  
  storedPosts[postIndex] = updatedPost;
  await storePosts(storedPosts);
  
  res.json({ message: 'Post updated.', post: updatedPost });
});

app.delete('/posts/:id', async (req, res) => {
  const storedPosts = await getStoredPosts();
  const postIndex = storedPosts.findIndex((post) => post.id === req.params.id);
  
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  const deletedPost = storedPosts[postIndex];
  storedPosts.splice(postIndex, 1);
  await storePosts(storedPosts);
  
  res.json({ message: 'Post deleted.', post: deletedPost });
});

app.put('/posts', async (req, res) => {
  const postsArray = req.body;
  await storePosts(postsArray);
  res.json({ message: 'Posts order updated.', posts: postsArray });
});

app.listen(8080, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:8080');
  console.log('Access from network: http://192.168.20.114:8080');
});
