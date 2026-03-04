const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/index');
const User = require('../src/models/User');

describe('Auth endpoints', () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/eker-test';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('registers a new user and returns tokens', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'Password123!' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
  });

  test('login with correct credentials', async () => {
    const user = new User({ email: 'login@test.com', password: 'Secret123' });
    await user.save();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'Secret123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('login with invalid credentials returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noone@test.com', password: 'nopass' });
    expect(res.statusCode).toBe(401);
  });
});