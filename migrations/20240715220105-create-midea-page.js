'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('midea_page', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      midea_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'midea',      // Nome da tabela que a chave estrangeira referencia
          key: 'id',           // Coluna da tabela referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      page_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'page',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      account_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'account',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      sort: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('midea_page');
  }
};