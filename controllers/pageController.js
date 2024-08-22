const { Page, User, Site, MideaPage, Midea} = require('../models');

const pageController = {
    async create(req, res) {
        try {
            const page = await Page.create(req.body);
            res.status(201).json(page);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async index(req, res) {
        try {

            const email = req.user.email;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const userId = user.id;
            const accountId = user.account_id;

            if (!userId || !accountId) {
                return res.status(401).json({ error: 'Usuário não autenticado ou account_id não fornecido' });
            }

            // Busca as páginas relacionadas ao account_id
            const pages = await Page.findAll({
                where: { account_id: accountId, user_id: userId },
                include: [
                    {
                        model: Site, // O modelo relacionado
                        as: 'site', // Alias usado na relação
                        attributes: ['id', 'name', 'url'] // Especifique os campos que deseja incluir
                    },
                    {
                        model: MideaPage, // O modelo relacionado
                        as: 'mideaPages',  // Especifique os campos que deseja incluir
                        include: [
                            {
                                model: Midea, // O modelo relacionado para o conteúdo de midea_id
                                as: 'midea', // Alias usado na relação
                                attributes: ['name'] // Especifique os campos que deseja incluir do modelo Midea
                            }
                        ]
                    }
                ],
                order: [
                    ['updatedAt', 'DESC'] // Ordena as páginas pela data de atualização, do mais recente para o mais antigo
                ]
            });

            if (pages.length === 0) {
                return res.status(404).json({ message: 'Nenhuma página encontrada para este account_id' });
            }
            res.status(200).json(pages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findById(req, res) {
        try {
            const page = await Page.findByPk(req.params.id);
            if (page) {
                res.status(200).json(page);
            } else {
                res.status(404).json({ error: 'Page not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Page.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedPage = await Page.findByPk(req.params.id);
                res.status(200).json(updatedPage);
            } else {
                res.status(404).json({ error: 'Page not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Page.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Page not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = pageController;
