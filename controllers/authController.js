const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const login = async (req, res) => {
    const { email, password } = req.body;

    // Encontrar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Senha inválida' });
    }

    // Gerar token JWT
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.status(200).json({ token });
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    });
};

module.exports = { login, authenticateToken };
