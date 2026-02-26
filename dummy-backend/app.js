const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { getStoredPosts, storePosts } = require('./data/posts');

const app = express();
const PORT = process.env.BACKEND_PORT || 8080;
const HOST = '0.0.0.0';

app.use(bodyParser.json());

app.use((req, res, next) => {
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

app.listen(PORT, HOST, () => {
  const localIP = process.env.LOCAL_IP || 'localhost';
  console.log(`Server running on:`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://${localIP}:${PORT}`);
});
