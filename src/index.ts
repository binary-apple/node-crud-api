import http from 'http';
import dotenv from 'dotenv';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { User /*, UserData  , validateUserData */ } from 'types';

dotenv.config();

const PORT = process.env.PORT || 4000;
const server = http.createServer();

const users: User[] = [
  {
    id: uuidv4(),
    username: 'John Doe',
    age: 20,
    hobbies: ['programming'],
  },
  {
    id: uuidv4(),
    username: 'Jane Doe',
    age: 37,
    hobbies: [],
  },
];

server.listen(PORT, () =>
  console.log(`App is listening on url http://localhost:${PORT}`),
);

server.on('request', (req, res) => {
  const { method, url } = req;
  res.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && url === '/api/users') {
    res.statusCode = 200;
    res.end(JSON.stringify(users));
  } else if (method === 'GET' && url?.startsWith('/api/users/')) {
    const reqUserId = url.slice(11);
    const user = users.find((user) => user.id === reqUserId);
    if (user) {
      res.statusCode = 200;
      res.end(JSON.stringify(user));
    } else {
      if (!uuidValidate(reqUserId)) {
        res.statusCode = 400;
        res.end('Invalid user id');
      } else {
        res.statusCode = 404;
        res.end('Invalid user id');
      }
    }
  } else if (method === 'DELETE' && url?.startsWith('/api/users/')) {
    const reqUserId = url.slice(11);
    const userIdInArray = users.findIndex((user) => user.id === reqUserId);
    if (userIdInArray >= 0) {
      res.statusCode = 204;
      users.splice(userIdInArray, 1);
      res.end();
    } else {
      if (!uuidValidate(reqUserId)) {
        res.statusCode = 400;
        res.end('Invalid user id');
      } else {
        res.statusCode = 404;
        res.end('User not found');
      }
    }
  } else {
    res.statusCode = 404;
    res.end(`Requested resource doesn't exist`);
  }
});
