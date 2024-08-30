const bcrypt = require('bcryptjs');
const { Account, User } = require('../models');

const accountController = {
    async create(req, res) {
        try {
            const { email, password } = req.body;

            // Verifica se já existe uma conta com o e-mail fornecido
            const existingAccount = await User.findOne({ where: { email } });
            if (existingAccount) {
                return res.status(400).json({ error: 'E-mail já cadastrado' });
            }

            // Criptografa a senha antes de salvar
            const hashedPassword = await bcrypt.hash(password, 10);


            const account = await Account.create({
                ...req.body
            });

            // Cria a nova conta com a senha criptografada
           await User.create({
                ...req.body,
                password: hashedPassword,
                account_id: account.id
            });


            res.status(201).json(account);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },




};

module.exports = accountController;
