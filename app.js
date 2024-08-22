const express = require('express');
require('dotenv').config();
const app = express();
const port = 8000;
const cors = require('cors');

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000', // Substitua pela URL do seu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Para permitir o envio de cookies e cabeçalhos de autenticação
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

const routes = require('./routes/index.js');

app.use('/api', routes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}


module.exports = app;
