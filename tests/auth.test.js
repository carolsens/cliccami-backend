const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('User Authentication', () => {
    it('should authenticate a user with correct credentials', async () => {
        await request(app)
            .post('/api/account/create')
            .send({
                email: 'loginuser@loginuser.com',
                password: 'loginpassword',
                name: 'teste'
            });

        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'loginuser@loginuser.com',
                password: 'loginpassword'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not authenticate a user with incorrect credentials', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'wronguser@wronguser.com',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Usuário não encontrado');
    });

    it('should not authenticate a user with incorrect password', async () => {
        await request(app)
            .post('/api/account/create')
            .send({
                email: 'loginuser@loginuser.com',
                password: 'loginpassword',
                name: 'teste'
            });

        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'loginuser@loginuser.com',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Senha inválida');
    });
});
