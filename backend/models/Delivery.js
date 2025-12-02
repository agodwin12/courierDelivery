const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Delivery = sequelize.define('Delivery', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tracking_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: 'Tracking number already exists'
        },
        validate: {
            notEmpty: {
                msg: 'Tracking number cannot be empty'
            }
        }
    },

    // Sender Information
    sender_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Sender name is required'
            }
        }
    },
    sender_phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    sender_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Invalid sender email'
            }
        }
    },
    sender_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    // Receiver Information
    receiver_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Receiver name is required'
            }
        }
    },
    receiver_phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    receiver_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Invalid receiver email'
            }
        }
    },
    receiver_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    // Delivery Details
    delivery_method: {
        type: DataTypes.ENUM('road', 'flight', 'sea'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['road', 'flight', 'sea']],
                msg: 'Delivery method must be road, flight, or sea'
            }
        }
    },
    delivery_status: {
        type: DataTypes.ENUM('pending', 'in_transit', 'arrived', 'delivered', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
    },

    // Timing
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estimated_arrival: {
        type: DataTypes.DATE,
        allowNull: true
    },
    actual_delivery_time: {
        type: DataTypes.DATE,
        allowNull: true
    },

    // Current Location (for real-time tracking)
    current_latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    current_longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    current_location_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    // Additional Information
    package_weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Weight in KG'
    },
    package_dimensions: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'L x W x H in cm'
    },
    special_instructions: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    // Created By
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'admins',
            key: 'id'
        }
    },

    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'deliveries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['tracking_number']
        },
        {
            fields: ['delivery_status']
        },
        {
            fields: ['delivery_method']
        },
        {
            fields: ['created_by']
        }
    ]
});

// Instance Methods
Delivery.prototype.updateStatus = async function(status) {
    this.delivery_status = status;
    if (status === 'delivered') {
        this.actual_delivery_time = new Date();
    }
    await this.save();
};

Delivery.prototype.updateLocation = async function(latitude, longitude, address) {
    this.current_latitude = latitude;
    this.current_longitude = longitude;
    this.current_location_address = address;
    await this.save();
};

// Class Methods
Delivery.findByTrackingNumber = async function(trackingNumber) {
    return await this.findOne({
        where: { tracking_number: trackingNumber }
    });
};

Delivery.findActiveDeliveries = async function() {
    return await this.findAll({
        where: {
            delivery_status: ['pending', 'in_transit', 'arrived']
        },
        order: [['created_at', 'DESC']]
    });
};

Delivery.generateTrackingNumber = function() {
    const prefix = 'ST';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `${prefix}-${year}-${random}`;
};

module.exports = Delivery;