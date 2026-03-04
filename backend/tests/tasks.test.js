const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/index');
const User = require('../src/models/User');
const Task = require('../src/models/Task');
const jwt = require('jsonwebtoken');

let token;

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
  await Task.deleteMany({});
  const user = new User({ email: 'task@test.com', password: 'Pwd1234' });
  await user.save();
  token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
});

describe('Task endpoints', () => {
  test('create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Sample', priority: 'high' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Sample');
  });

  test('get tasks list', async () => {
    await Task.create({ title: 'One', createdBy: mongoose.Types.ObjectId() });
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});