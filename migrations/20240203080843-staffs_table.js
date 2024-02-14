'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staffs', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      password: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      is_verified: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      club_name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      role: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        required: true,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staffs');
  },
};
