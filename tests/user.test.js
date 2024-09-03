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

        // Cria um novo usuário
        const res = await request(app)
            .post('/api/account/create')
            .send({
                email: 'testuser@testuser.com',
                password: 'testpassword',
                name: 'teste'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        // expect(res.body).toHaveProperty('email', 'testuser@testuser.com');
    });

    it('should not register a user with an existing email', async () => {
        // Registra um usuário
        await request(app)
            .post('/api/register')
            .send({
                email: 'testuser@testuser.com',
                password: 'testpassword'
            });

        // Tenta registrar o mesmo usuário novamente com e-mail igual
        const res = await request(app)
            .post('/api/account/create')
            .send({
                email: 'testuser@testuser.com',
                password: 'testpassword',
                name: ''
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'E-mail já cadastrado');
    });
});
