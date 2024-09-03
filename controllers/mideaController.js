const { Midea, User, Page, Site, MideaPage} = require('../models');
const s3Client = require('../services/s3Service');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { streamToBuffer } = require('../utils/streamToBuffer');

const mideaController = {
    async create(req, res) {
        try {
            const midea = await Midea.create(req.body);
            res.status(201).json(midea);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const mideas = await Midea.findAll();
            res.status(200).json(mideas);
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
            const mideas = await Midea.findAll({
                where: { account_id: accountId, user_id: userId },
                include: [
                    {
                        model: MideaPage,
                        as: 'mideaPages',
                        include: [
                            {
                                model: Page,
                                as: 'page',
                                include: [
                                    {
                                        model: Site,
                                        as: 'site',
                                        attributes: ['name']
                                    }
                                ]
                            }
                        ]
                    }
                ],
                order: [
                    ['updatedAt', 'DESC'] // Ordena as páginas pela data de atualização, do mais recente para o mais antigo
                ]
            });

            const result = [];

            for (let midea of mideas) {
                let mideaObject = midea.toJSON(); // Converte para objeto JavaScript simples
                if (midea.path_image) {
                    const params = {
                        Bucket: 'cliccami-file',
                        Key: midea.path_image
                    };

                    const command = new GetObjectCommand(params);
                    const response = await s3Client.send(command);

                    // Converte o stream em buffer
                    const buffer = await streamToBuffer(response.Body);
                    mideaObject.imageContent = `data:image/jpeg;base64,${buffer.toString('base64')}`;
                }

                result.push(mideaObject);
            }

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async indexName(req, res) {
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
            const mideas = await Midea.findAll({
                where: { account_id: accountId, user_id: userId },
                attributes: ['id','name'],
                order: [
                    ['name', 'ASC'] // Ordena as páginas pela data de atualização, do mais recente para o mais antigo
                ]
            });


           res.status(200).json(mideas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Midea.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedMidea = await Midea.findByPk(req.params.id);
                res.status(200).json(updatedMidea);
            } else {
                res.status(404).json({ error: 'Midea not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            await MideaPage.destroy({
                where: { midea_id: req.params.id },
            });

            // Deleta a entidade midea
            const deletedCount = await Midea.destroy({
                where: { id: req.params.id },
            });

            if (deletedCount) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Midea not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = mideaController;
