const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Menu = require('../model/Menu');
const { addMenuItem, getMenuItems } = require('../controllers/menuController');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('🍔 Menu Controller Test Suite', () => {

  test('✅ Adds a new menu item successfully', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        name: 'Cheeseburger',
        price: 9.99,
        image: 'http://example.com/burger.jpg',
        category: 'Entree',
        quantity: 5,
        description: 'Juicy beef burger with cheese',
      }
    });

    const res = httpMocks.createResponse();
    await addMenuItem(req, res);

    expect(res.statusCode).toBe(201);

    const data = res._getJSONData();
    expect(data.name).toBe('Cheeseburger');
    expect(data.price).toBe(9.99);
    console.log('🟢 Menu item created successfully:', data.name);
  });

  test('📦 Fetches all menu items', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await getMenuItems(req, res);

    expect(res.statusCode).toBe(200);

    const data = res._getJSONData();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1); // one added above
    expect(data[0].name).toBe('Cheeseburger');
    console.log('🟢 Fetched menu items count:', data.length);
  });

  test('❌ Rejects adding item with missing fields', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        name: 'Fries'
        // missing: price, image, category, quantity, description
      }
    });

    const res = httpMocks.createResponse();
    await addMenuItem(req, res);

    expect(res.statusCode).toBe(400);
    const data = res._getJSONData();
    expect(data.message).toMatch(/all fields are required/i);
    console.log('🟢 Properly rejected invalid menu item');
  });

});
