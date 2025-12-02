const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrackingUpdate = sequelize.define('TrackingUpdate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    delivery_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'deliveries',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },

    // Location Data
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    location_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    // Status Update
    status: {
        type: DataTypes.ENUM('picked_up', 'in_transit', 'at_checkpoint', 'out_for_delivery', 'arrived', 'delivered'),
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    // Timestamp
    recorded_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'recorded_at'
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'admins',
            key: 'id'
        },
        onDelete: 'SET NULL'
    }
}, {
    tableName: 'tracking_updates',
    timestamps: false,
    indexes: [
        {
            fields: ['delivery_id']
        },
        {
            fields: ['recorded_at']
        }
    ]
});

// Class Methods
TrackingUpdate.getDeliveryHistory = async function(deliveryId) {
    return await this.findAll({
        where: { delivery_id: deliveryId },
        order: [['recorded_at', 'DESC']]
    });
};

module.exports = TrackingUpdate;