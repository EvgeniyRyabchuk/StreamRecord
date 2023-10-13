'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      new_price_uah: {
        type: Sequelize.DECIMAL
      },
      old_price_uah: {
        type: Sequelize.DECIMAL
      },
      new_price_usd: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      old_price_usd: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      goodId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Goods',
          key: 'id'
        },
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Histories');
  }
};