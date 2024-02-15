'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teams', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      team_name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      user_count: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      team_code: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      event_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'events',
          key: 'id',
        },
      },
      event_code: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        references: {
          model: 'events',
          key: 'event_code',
        },
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
    await queryInterface.dropTable('teams');
  },
};
