import { IncomingMessage, ServerResponse } from 'http';
import { MongoClient } from 'mongodb';
import { fetchJSON } from '../utils/fetchJSON';
import { mongoUrl } from '../utils/mongo';

export const loadData = async (_: IncomingMessage, res: ServerResponse) => {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    const db = client.db('assignment');
    const usersCol = db.collection('users');
    const postsCol = db.collection('posts');
    const commentsCol = db.collection('comments');

    const users = await fetchJSON('https://jsonplaceholder.typicode.com/users?_limit=10');
    const posts = await fetchJSON('https://jsonplaceholder.typicode.com/posts');
    const comments = await fetchJSON('https://jsonplaceholder.typicode.com/comments');

    // Insert users
    await usersCol.deleteMany({});
    await postsCol.deleteMany({});
    await commentsCol.deleteMany({});
    await usersCol.insertMany(users);

    // Filter and insert posts and comments
    const userIds = users.map((u: any) => u.id);
    const filteredPosts = posts.filter((p: any) => userIds.includes(p.userId));
    await postsCol.insertMany(filteredPosts);

    const postIds = filteredPosts.map((p: any) => p.id);
    const filteredComments = comments.filter((c: any) => postIds.includes(c.postId));
    await commentsCol.insertMany(filteredComments);

    res.writeHead(200);
    res.end();
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Failed to load data' }));
  } finally {
    await client.close();
  }
};
