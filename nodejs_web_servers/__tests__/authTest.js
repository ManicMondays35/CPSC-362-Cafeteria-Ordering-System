const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../model/User');
const { handleNewUser } = require('../controllers/registerController');
const { handleLogin } = require('../controllers/authController');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('🧪 In-memory MongoDB started');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  console.log('🧹 In-memory MongoDB stopped');
});

describe('🔐 Authentication Tests', () => {
  test('📝 Register a new user', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'test@example.com',
        pwd: 'secure123',
      },
    });
    const res = httpMocks.createResponse();

    await handleNewUser(req, res);
    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();
    expect(data.success).toMatch(/New user with email test@example.com created/i);
    console.log('✅ Registration test passed');
  });

  test('❌ Login with incorrect password', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'test@example.com',
        pwd: 'wrongpass',
      },
    });
    const res = httpMocks.createResponse();

    await handleLogin(req, res);
    expect(res.statusCode).toBe(401);
    console.log('✅ Login with incorrect password test passed');
  });

  test('🔓 Login with correct password', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'test@example.com',
        pwd: 'secure123',
      },
    });
    const res = httpMocks.createResponse();

    process.env.ACCESS_TOKEN_SECRET = 'accesssecret';
    process.env.REFRESH_TOKEN_SECRET = 'refreshsecret';

    await handleLogin(req, res);
    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty('accessToken');
    console.log('✅ Login with correct password test passed');
  });
});
