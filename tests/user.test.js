const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('User Registration and Authentication', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                email: 'testuser@testuser.com',
                password: 'testpassword'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Usuário registrado com sucesso');
    });

    it('should not register a user with an existing email', async () => {
        await request(app)
            .post('/api/register')
            .send({
                email: 'testuser@testuser.com',
                password: 'testpassword'
            });

        const res = await request(app)
            .post('/api/register')
            .send({
                email: 'testuser@testuser.com',
                password: 'testpassword'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Usuário já existe');
    });
});
