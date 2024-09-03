const { MideaPage, User} = require('../models');

const mideaPageController = {
    async create(req, res) {
        try {
            const email = req.user.email;

            if (typeof email !== 'string') {
                throw new Error('Email is not a valid string');
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const accountId = user.account_id;

            // Cria a relação para cada midea de mideaPage, caso não exista
            for (const midea of req.body.midea) {
                const mideaId = midea.id;

                let mideaPage = await MideaPage.findOne({
                    where: {
                        midea_id: mideaId,
                        page_id: req.body.page,
                        account_id: accountId,
                        user_id: user.id,
                    },
                });

                if (!mideaPage) {
                    mideaPage = await MideaPage.create({
                        midea_id: mideaId,
                        page_id: req.body.page,
                        user_id: user.id,
                        account_id: accountId,
                    });
                }
            }
            res.status(201).json('sucess');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const mideaPages = await MideaPage.findAll();
            res.status(200).json(mideaPages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findById(req, res) {
        try {
            const mideaPage = await MideaPage.findByPk(req.params.id);
            if (mideaPage) {
                res.status(200).json(mideaPage);
            } else {
                res.status(404).json({ error: 'MideaPage not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await MideaPage.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedMideaPage = await MideaPage.findByPk(req.params.id);
                res.status(200).json(updatedMideaPage);
            } else {
                res.status(404).json({ error: 'MideaPage not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await MideaPage.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'MideaPage not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = mideaPageController;
