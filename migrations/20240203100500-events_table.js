'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('events', {
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
      event_code: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      is_group_event: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      event_scope: {
        type: Sequelize.DataTypes.ENUM('srm', 'non-srm', 'both'),
        allowNull: false,
      },
      club_name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      max_group_size: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
      },
      reg_count: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
      },
      mode: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
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
    await queryInterface.dropTable('events');
  },
};
