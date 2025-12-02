const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: 'Username already exists'
        },
        validate: {
            notEmpty: {
                msg: 'Username cannot be empty'
            },
            len: {
                args: [3, 50],
                msg: 'Username must be between 3 and 50 characters'
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            msg: 'Email already exists'
        },
        validate: {
            notEmpty: {
                msg: 'Email cannot be empty'
            },
            isEmail: {
                msg: 'Must be a valid email address'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password cannot be empty'
            },
            len: {
                args: [6, 255],
                msg: 'Password must be at least 6 characters'
            }
        }
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Full name cannot be empty'
            }
        }
    },
    role: {
        type: DataTypes.ENUM('super_admin', 'admin', 'staff'),
        defaultValue: 'admin',
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
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
    tableName: 'admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            unique: true,
            fields: ['username']
        }
    ],
    hooks: {
        // Hash password before creating admin
        beforeCreate: async (admin) => {
            if (admin.password) {
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(admin.password, salt);
            }
        },
        // Hash password before updating admin if password is changed
        beforeUpdate: async (admin) => {
            if (admin.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(admin.password, salt);
            }
        }
    }
});

// Instance Methods
Admin.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password; // Remove password from JSON response
    return values;
};

Admin.prototype.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

Admin.prototype.updateLastLogin = async function () {
    this.last_login = new Date();
    await this.save();
};

// Class Methods
Admin.findByEmail = async function (email) {
    return await this.findOne({
        where: {
            email,
            is_active: true
        }
    });
};

Admin.findByUsername = async function (username) {
    return await this.findOne({
        where: {
            username,
            is_active: true
        }
    });
};

Admin.findActiveAdmins = async function () {
    return await this.findAll({
        where: {
            is_active: true
        },
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['password'] }
    });
};

module.exports = Admin;