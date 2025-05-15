import { IncomingMessage, ServerResponse } from 'http';
import { MongoClient } from 'mongodb';
import { getBody } from '../utils/getBody';
import { mongoUrl } from '../utils/mongo';

export const deleteAllUsers = async (_: IncomingMessage, res: ServerResponse) => {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    await client.db('assignment').collection('users').deleteMany({});
    res.writeHead(200);
    res.end();
  } catch {
    res.writeHead(500);
    res.end();
  } finally {
    await client.close();
  }
};

export const deleteUserById = async (_: IncomingMessage, res: ServerResponse, userId: string) => {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    const result = await client.db('assignment').collection('users').deleteOne({ id: parseInt(userId) });
    if (result.deletedCount === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'User not found' }));
    } else {
      res.writeHead(200);
      res.end();
    }
  } catch {
    res.writeHead(500);
    res.end();
  } finally {
    await client.close();
  }
};

export const getUserById = async (_: IncomingMessage, res: ServerResponse, userId: string) => {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    const db = client.db('assignment');
    const user = await db.collection('users').findOne({ id: parseInt(userId) });
    if (!user) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }
    const posts = await db.collection('posts').find({ userId: user.id }).toArray();
    for (const post of posts) {
      post.comments = await db.collection('comments').find({ postId: post.id }).toArray();
    }
    user.posts = posts;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } catch {
    res.writeHead(500);
    res.end();
  } finally {
    await client.close();
  }
};

export const putNewUser = async (req: IncomingMessage, res: ServerResponse) => {
  const client = new MongoClient(mongoUrl);
  try {
    const body = await getBody(req);
    const user = JSON.parse(body);
    await client.connect();
    const existing = await client.db('assignment').collection('users').findOne({ id: user.id });
    if (existing) {
      res.writeHead(409);
      res.end(JSON.stringify({ error: 'User already exists' }));
    } else {
      await client.db('assignment').collection('users').insertOne(user);
      res.writeHead(201, { 'Content-Type': 'application/json', 'Location': `/users/${user.id}` });
      res.end(JSON.stringify(user));
    }
  } catch {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'Invalid request body' }));
  } finally {
    await client.close();
  }
};
