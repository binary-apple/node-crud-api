import http from 'http';
import dotenv from 'dotenv';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { User, validateUserData } from './types';

dotenv.config();

const PORT = process.env.PORT || 4000;
const server = http.createServer();

const users: User[] = [];

server.listen(PORT, () =>
  console.log(`App is listening on url http://localhost:${PORT}`),
);

server.on('request', (req, res) => {
  const { method, url } = req;
  res.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && url === '/api/users') {
    // get all users
    res.statusCode = 200;
    res.end(JSON.stringify(users));
  } else if (method === 'GET' && url?.startsWith('/api/users/')) {
    // get user by id
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
  } else if (method === 'POST' && url === '/api/users') {
    // create new user
    let body = '';
    req.on('data', (data) => {
      if (data) {
        body += data.toString();
      }
    });
    req.on('end', () => {
      const parsedBody: unknown = JSON.parse(body);
      if (validateUserData(parsedBody)) {
        const newUser = {
          id: uuidv4(),
          username: parsedBody.username,
          age: parsedBody.age,
          hobbies: parsedBody.hobbies,
        };
        users.push(newUser);
        res.statusCode = 201;
        res.end(JSON.stringify(newUser));
      } else {
        res.statusCode = 400;
        res.end('Request should contain correct required fields');
      }
    });
  } else if (method === 'PUT' && url?.startsWith('/api/users/')) {
    // update existing user
    const reqUserId = url.slice(11);
    const userIdInArray = users.findIndex((user) => user.id === reqUserId);
    if (userIdInArray >= 0) {
      let body = '';
      req.on('data', (data) => {
        if (data) {
          body += data.toString();
        }
      });
      req.on('end', () => {
        const parsedBody: unknown = JSON.parse(body);
        if (validateUserData(parsedBody)) {
          users[userIdInArray] = {
            id: users[userIdInArray].id,
            username: parsedBody.username,
            age: parsedBody.age,
            hobbies: parsedBody.hobbies,
          };
          res.statusCode = 200;
          res.end(JSON.stringify(users[userIdInArray]));
        } else {
          res.statusCode = 400;
          res.end('Request should contain correct required fields');
        }
      });
    } else {
      if (!uuidValidate(reqUserId)) {
        res.statusCode = 400;
        res.end('Invalid user id');
      } else {
        res.statusCode = 404;
        res.end('User not found');
      }
    }
  } else if (method === 'DELETE' && url?.startsWith('/api/users/')) {
    //  delete user
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
    // all other requests
    res.statusCode = 404;
    res.end(`Requested resource doesn't exist`);
  }
});
