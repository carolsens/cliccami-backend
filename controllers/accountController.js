const bcrypt = require('bcrypt');
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

    async findAll(req, res) {
        try {
            const accounts = await Account.findAll();
            res.status(200).json(accounts);
        } catch (error) {
            res.status(500).json({ error: error.message });
            
        }
    },

    async findById(req, res) {
        try {
            const account = await Account.findById(req.params.id);
            if (account) {
                res.status(200).json(account);
            } else {
                res.status(404).json({ error: 'Account not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Account.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedAccount = await Account.findById(req.params.id);
                res.status(200).json(updatedAccount);
            } else {
                res.status(404).json({ error: 'Account not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Account.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Account not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = accountController;
