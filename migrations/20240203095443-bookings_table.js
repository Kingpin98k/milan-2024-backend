'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      user_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      serial_number:{
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      payment_id: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      ticket_id: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      payment_status: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'pending',
      },
      ticket_status: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'pending',
      },
      offline_ticket_issued: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      ticket_type: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      staff_name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      staff_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'staffs',
          key: 'id',
        },
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
    await queryInterface.dropTable('bookings');
  },
};
