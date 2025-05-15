import { createServer } from 'http';
import { requestHandler } from './routes';

const PORT = 3000;

const server = createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
