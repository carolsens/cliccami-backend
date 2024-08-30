const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');
const { User } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Account Creation', () => {
    it('should create a new account with a hashed password', async () => {
        const res = await request(app)
            .post('/api/account/create')
            .send({
                email: 'newuser@example.com',
                password: 'newpassword'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        // expect(res.body).toHaveProperty('email', 'newuser@example.com');

        const user = await User.findOne({ where: { email: 'newuser@example.com' } });
        expect(user).toBeTruthy();  // Verifica se o usuário foi criado
        expect(user.password).not.toBe('newpassword');
    });

    it('should not create an account with an existing email', async () => {
        // Primeiro cria uma conta
        await request(app)
            .post('/api/account/create')
            .send({
                email: 'existinguser@example.com',
                password: 'password123'
            });

        // Tenta criar uma conta com o mesmo e-mail
        const res = await request(app)
            .post('/api/account/create')
            .send({
                email: 'existinguser@example.com',
                password: 'anotherpassword'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'E-mail já cadastrado');
    });
});
