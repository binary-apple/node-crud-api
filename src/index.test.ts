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
    console.log(res.body);
    expect(res.body).toEqual({ message: 'Invalid user id' });
  });
});
