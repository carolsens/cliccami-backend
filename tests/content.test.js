const request = require('supertest');
const app = require('../app');
const { sequelize, User, Midea, Account, Site, Page, MideaPage } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

describe('Content Controller', () => {
    let user;
    let token;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        const account = await Account.create({
            name: 'teste',
        });
        user = await User.create({
            email: 'loginuser@loginuser.com',
            password: await bcrypt.hash('loginpassword', 10),
            account_id: account.id
        });

        token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }, 300000);

    // afterAll(async () => {
    //     try {
    //         console.log('Starting cleanup...');
    //         await User.destroy({ where: {} });
    //         console.log('Users deleted.');
    //         await Midea.destroy({ where: {} });
    //         console.log('Mideas deleted.');
    //         await Site.destroy({ where: {} });
    //         console.log('Sites deleted.');
    //         await Page.destroy({ where: {} });
    //         console.log('Pages deleted.');
    //         await MideaPage.destroy({ where: {} });
    //         console.log('MideaPages deleted.');
    //         await sequelize.close();
    //         console.log('Cleanup completed.');
    //     } catch (error) {
    //         console.error('Error during cleanup:', error);
    //     }
    // }, 60000);

    test('should create a Midea with a file upload and establish a relationship with a Page and a Site.', async () => {
        // Caminho para o arquivo de teste
        const filePath = path.join(__dirname, 'fixtures', 'cliccami.mp4');

        const response = await request(app)
            .post('/api/content/create')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', filePath)
            .field('name', 'Test Midea')
            .field('url', 'http://example.com')
            .field('typePage', 'home');

        expect(response.status).toBe(200);
        expect(response.body.midea).toHaveProperty('id');
        expect(response.body.midea.name).toBe('Test Midea');
    }, 60000);
});
