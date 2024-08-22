const { Parameter } = require('../models');

const parameterController = {
    async create(req, res) {
        try {
            const parameter = await Parameter.create(req.body);
            res.status(201).json(parameter);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const parameters = await Parameter.findAll();
            res.status(200).json(parameters);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findById(req, res) {
        try {
            const parameter = await Parameter.findByPk(req.params.id);
            if (parameter) {
                res.status(200).json(parameter);
            } else {
                res.status(404).json({ error: 'Parameter not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Parameter.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedParameter = await Parameter.findByPk(req.params.id);
                res.status(200).json(updatedParameter);
            } else {
                res.status(404).json({ error: 'Parameter not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Parameter.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Parameter not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = parameterController;
