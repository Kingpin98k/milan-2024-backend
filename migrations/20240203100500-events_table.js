'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.sequelize.query(`ALTER TYPE "enum_events_mode" ADD VALUE 'offline'`);

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
        type: Sequelize.DataTypes.TEXT,
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
      max_cap: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true,
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
