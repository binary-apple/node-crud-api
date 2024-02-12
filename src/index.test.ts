import request from 'supertest';
import server from './index';
import { User, UserData } from 'types';

describe('Scenario 1', () => {
  afterAll(() => {
    server.close();
  });

  let currentUserId = '';
  let currentUser: User;
  const newUserData: UserData = {
    username: 'Marilyn Monroe',
    age: 36,
    hobbies: ['acting', 'singing', 'modeling'],
  };
  const updatedUserData: UserData = {
    username: 'Elon Musk',
    age: 52,
    hobbies: ['space'],
  };

  test('should return empty array', async () => {
    // GET api/users
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  test('should return newly created user record', async () => {
    // POST api/users
    const res = await request(server).post('/api/users').send(newUserData);
    currentUser = res.body;
    currentUserId = currentUser.id;
    expect(res.statusCode).toEqual(201);
    expect(currentUser).toMatchObject(newUserData);
  });

  test('should return previously created user record', async () => {
    // GET api/user/{userId}
    const res = await request(server).get(`/api/users/${currentUserId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(currentUser);
  });

  test('should return updated user record with the same id', async () => {
    // PUT api/users/{userId}
    const res = await request(server)
      .put(`/api/users/${currentUserId}`)
      .send(updatedUserData);
    currentUser = res.body;
    currentUserId = currentUser.id;
    expect(res.statusCode).toEqual(200);
    expect(currentUser).toMatchObject(updatedUserData);
  });

  test('should successfully delete user record', async () => {
    // DELETE api/users/{userId}
    const res = await request(server).delete(`/api/users/${currentUserId}`);
    expect(res.statusCode).toEqual(204);
    expect((await request(server).get('/api/users')).body).toEqual([]);
  });

  test('should not find the deleted record', async () => {
    // GET api/users/{userId}
    const res = await request(server).get(`/api/users/${currentUserId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Invalid user id' });
  });
});

describe('Scenario 2', () => {
  afterAll(() => {
    server.close();
  });

  const newUserInvalidData = {
    username: 'Ada Lovelace',
    hobbies: 'programming',
  };

  test('should return empty array', async () => {
    // GET api/users
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  test('should not create new user record with invalid data', async () => {
    // POST api/users
    const res = await request(server)
      .post('/api/users')
      .send(newUserInvalidData);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      message: 'Request should contain correct required fields',
    });
  });

  test('should not return user record if id is not uuid', async () => {
    // GET api/user/test
    const res = await request(server).get('/api/users/test');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid user id' });
  });

  test('should handle request to non-existing endpoint', async () => {
    // GET test
    const res = await request(server).get(`/test`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: `Requested resource doesn't exist` });
  });

  test('should handle put request if id is not uuid', async () => {
    // PUT api/users/test
    const res = await request(server).put('/api/users/test');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid user id' });
  });

  test('should handle delete request if id is not uuid', async () => {
    // DELETE api/users/test
    const res = await request(server).delete('/api/users/test');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid user id' });
  });
});

describe('Scenario 3', () => {
  afterAll(() => {
    server.close();
  });

  let currentUserId = '';
  const newUsersData: UserData[] = [
    {
      username: 'Darth Vader',
      age: 45,
      hobbies: ['podracing', 'creating robots'],
    },
    {
      username: 'Luke Skywalker',
      age: 20,
      hobbies: ['force'],
    },
  ];

  test('should return empty array', async () => {
    // GET api/users
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  test('should return newly created user record', async () => {
    // POST api/users
    const res = await request(server).post('/api/users').send(newUsersData[0]);
    currentUserId = res.body.id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject(newUsersData[0]);
  });

  test('should return newly created user record', async () => {
    // POST api/users
    const res = await request(server).post('/api/users').send(newUsersData[1]);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject(newUsersData[1]);
  });

  test('should return 2 previously created user records', async () => {
    // GET api/users
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject(newUsersData);
    expect(res.body.length).toEqual(2);
  });

  test('should successfully delete first user record', async () => {
    // DELETE api/users/{userId}
    const res = await request(server).delete(`/api/users/${currentUserId}`);
    expect(res.statusCode).toEqual(204);
    expect((await request(server).get('/api/users')).body).toMatchObject([
      newUsersData[1],
    ]);
  });

  test('should not delete the previously deleted record', async () => {
    // DELETE api/users/{userId}
    const res = await request(server).delete(`/api/users/${currentUserId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  test('should not update the previously deleted record', async () => {
    // PUT api/users/{userId}
    const res = await request(server)
      .put(`/api/users/${currentUserId}`)
      .send(newUsersData[0]);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });
});
