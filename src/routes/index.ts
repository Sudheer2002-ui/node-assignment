import { IncomingMessage, ServerResponse } from 'http';
import { loadData } from '../services/loadService';
import { deleteAllUsers, deleteUserById, getUserById, putNewUser } from '../services/userService';
import { parse } from 'url';

export const requestHandler = async (req: IncomingMessage, res: ServerResponse) => {
  const urlParts = parse(req.url || '', true);
  const method = req.method || '';
  const path = urlParts.pathname || '';

  if (method === 'GET' && path === '/load') {
    await loadData(req, res);
  } else if (method === 'DELETE' && path === '/users') {
    await deleteAllUsers(req, res);
  } else if (method === 'DELETE' && /^\/users\/[0-9]+$/.test(path)) {
    const userId = path.split('/')[2];
    await deleteUserById(req, res, userId);
  } else if (method === 'GET' && /^\/users\/[0-9]+$/.test(path)) {
    const userId = path.split('/')[2];
    await getUserById(req, res, userId);
  } else if (method === 'PUT' && path === '/users') {
    await putNewUser(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
};
