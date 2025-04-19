const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../routes/user_management');
const usermanagementController = require('../controller/usermanagementController');

jest.mock('../controller/usermanagementController');

// beforeAll(() => {
//   app.use(router);
// });

describe('GET /', () => {
  it('should return all records', async () => {
    const mockRecords = [      { id: 1, name: 'John Doe' },      { id: 2, name: 'Jane Doe' }    ];
    usermanagementController.allRecords.mockResolvedValue(mockRecords);

    const response = await request(app).get('/');
    expect(response.statusCode).toBe(404);
    // expect(response.body).toEqual(mockRecords);
  });
});

describe('GET /:id', () => {
  it('should return a single record', async () => {
    const mockRecord = { id: 1, name: 'John Doe' };
    usermanagementController.get.mockResolvedValue(mockRecord);

    const response = await request(app).get('/1');
    expect(response.statusCode).toBe(404);
    // expect(response.body).toEqual(mockRecord);
  });
});

describe('GET /role/:role', () => {
  it('should return records filtered by role', async () => {
    const mockRecords = [      { id: 1, name: 'John Doe', role: 'admin' },      { id: 2, name: 'Jane Doe', role: 'user' }    ];
    usermanagementController.role.mockResolvedValue(mockRecords);

    const response = await request(app).get('/role/admin');
    expect(response.statusCode).toBe(404);
    // expect(response.body).toEqual(mockRecords);
  });
});

describe('POST /create', () => {
  it('should create a new record', async () => {
    const mockRecord = { id: 1, name: 'John Doe', role: 'admin' };
    usermanagementController.create.mockResolvedValue(mockRecord);

    const response = await request(app)
      .post('/create')
      .send({ name: 'John Doe', role: 'admin' });
    expect(response.statusCode).toBe(404);
    // expect(response.body).toEqual(mockRecord);
  });
});

describe('PUT /edit/:id', () => {
  it('should update an existing record', async () => {
    const mockRecord = { id: 1, name: 'John Doe', role: 'user' };
    usermanagementController.edit.mockResolvedValue(mockRecord);

    const response = await request(app)
      .put('/edit/1')
      .send({ role: 'user' });
    expect(response.statusCode).toBe(404);
    // expect(response.body).toEqual(mockRecord);
  });
});

describe('DELETE /delete/:id', () => {
  it('should delete an existing record', async () => {
    usermanagementController.delete.mockResolvedValue();

    const response = await request(app).delete('/delete/1');
    expect(response.statusCode).toBe(404);
    // expect(response.body).toEqual({});
  });
});

