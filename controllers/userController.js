const { User, PasswordResetToken } = require('../models');
const crypto = require('crypto');
const { sendEmail  } = require('../services/mail');

const userController = {
    async create(req, res) {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async index(req, res) {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const user = await User.findByPk(req.body.id);

            user.active = req.body.status;

            // Salva as alterações no banco de dados
            await user.save();

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    async forgot(req, res) {
        try {
            const email = req.body.email;
            const user = await User.findOne({ where: { email } });

            // Gera um token único para o reset de senha
            const token = crypto.randomBytes(20).toString('hex');

            // Expira em 1 hora
            const expireDate = Date.now() + 3600000;

            // Salva o token no banco de dados associado ao usuário (exemplo fictício)
            await PasswordResetToken.create({
                user_id: user.id,
                token: token,
                expires_at: expireDate,
            });


            // Configura os parâmetros do email
            const params = {
                Source: 'carolsens@gmail.com', // Substitua pelo seu endereço de email verificado no SES
                Destination: {
                    ToAddresses: [email],
                },
                Message: {
                    Subject: {
                        Data: 'Recuperação de senha',
                    },
                    Body: {
                        Text: {
                            Data: `Você está recebendo isso porque você (ou alguém mais) solicitou a redefinição de senha para sua conta. Por favor, clique no seguinte link ou cole em seu navegador para completar o processo:\n\n
                        http://${req.headers.host}/reset/${token}\n\n
                        Se você não solicitou isso, por favor ignore este email e sua senha permanecerá inalterada.`,
                        },
                    },
                },
            };

            // Envia o email usando SES
            sendEmail(params)
                .then((data) => {
                    res.status(200).json({ message: 'Email sent successfully!' });
                })
                .catch((err) => {
                    console.error(err, err.stack);
                    res.status(500).json({ message: 'Failed to send email.' });
                });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }



};

module.exports = userController;
