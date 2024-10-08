const { Site } = require('../models');

const siteController = {
    async create(req, res) {
        try {
            const site = await Site.create(req.body);
            res.status(201).json(site);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const sites = await Site.findAll();
            res.status(200).json(sites);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findById(req, res) {
        try {
            const site = await Site.findByPk(req.params.id);
            if (site) {
                res.status(200).json(site);
            } else {
                res.status(404).json({ error: 'Site not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Site.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedSite = await Site.findByPk(req.params.id);
                res.status(200).json(updatedSite);
            } else {
                res.status(404).json({ error: 'Site not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Site.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Site not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = siteController;
