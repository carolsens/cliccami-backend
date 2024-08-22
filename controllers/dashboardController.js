const {User, Midea, Page} = require('../models'); // Ajuste o caminho conforme necessário


const dashboardController = {
    async index(req, res) {
        try {
            const email = req.user.email;

            console.log(email)

            if (typeof email !== 'string') {
                throw new Error('Email is not a valid string');
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const accountId = user.account_id;

            const totalVideos = await Midea.count({ where: { account_id: accountId } });
            const totalPages = await Page.count({ where: { account_id: accountId } });

            res.status(200).json({ totalVideos, totalPages });
            // res.status(200).json(accountId);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

};

module.exports = dashboardController;
