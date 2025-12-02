const sequelize = require('../config/database');
const Admin = require('./Admin');
const Delivery = require('./Delivery');
const TrackingUpdate = require('./TrackingUpdate');

// Define Relationships

// Admin -> Delivery (One to Many)
Admin.hasMany(Delivery, {
    foreignKey: 'created_by',
    as: 'deliveries'
});
Delivery.belongsTo(Admin, {
    foreignKey: 'created_by',
    as: 'creator'
});

// Delivery -> TrackingUpdate (One to Many)
Delivery.hasMany(TrackingUpdate, {
    foreignKey: 'delivery_id',
    as: 'tracking_updates'
});
TrackingUpdate.belongsTo(Delivery, {
    foreignKey: 'delivery_id',
    as: 'delivery'
});

// Admin -> TrackingUpdate (One to Many)
Admin.hasMany(TrackingUpdate, {
    foreignKey: 'updated_by',
    as: 'tracking_updates'
});
TrackingUpdate.belongsTo(Admin, {
    foreignKey: 'updated_by',
    as: 'updater'
});

// Object to hold all models
const models = {
    Admin,
    Delivery,
    TrackingUpdate,
    sequelize
};

// Sync all models with database
const syncDatabase = async (options = {}) => {
    try {
        // options.force = true will drop tables and recreate them (use with caution!)
        // options.alter = true will alter tables to match models (safer)
        await sequelize.sync(options);
        console.log('✅ All models synchronized with database!');
    } catch (error) {
        console.error('❌ Error syncing database:', error.message);
        throw error;
    }
};

module.exports = {
    ...models,
    syncDatabase
};