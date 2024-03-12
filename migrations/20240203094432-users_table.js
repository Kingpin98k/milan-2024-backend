'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      milan_id:{
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },

      name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      phone_number: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
      },
      is_srm_ktr: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      profile_pic: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      college_name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      ticket_type:{
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      gender:{
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      is_registration_ticket_issued: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      reg_number: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      is_ticket_issued: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
