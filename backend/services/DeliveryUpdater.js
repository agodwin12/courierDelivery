/**
 * Delivery Updater Service
 * Automatically updates delivery positions for all active deliveries
 */

const Delivery = require('../models/Delivery');
const TrackingUpdate = require('../models/TrackingUpdate');
const PositionCalculator = require('./PositionCalculator');
const { Op } = require('sequelize');

class DeliveryUpdater {
    /**
     * Update all active deliveries
     * This method should be called by a cron job every 5 minutes
     */
    static async updateAllActiveDeliveries() {
        try {
            console.log('🚀 Starting automatic delivery position updates...');

            const now = new Date();

            // Find all deliveries that should be updated
            const activeDeliveries = await Delivery.findAll({
                where: {
                    // Start time has passed
                    start_time: {
                        [Op.lte]: now
                    },
                    // End time hasn't been reached yet
                    end_time: {
                        [Op.gte]: now
                    },
                    // Status is not delivered or cancelled
                    delivery_status: {
                        [Op.notIn]: ['delivered', 'cancelled']
                    },
                    // Has valid coordinates
                    sender_latitude: {
                        [Op.ne]: null
                    },
                    sender_longitude: {
                        [Op.ne]: null
                    },
                    receiver_latitude: {
                        [Op.ne]: null
                    },
                    receiver_longitude: {
                        [Op.ne]: null
                    }
                }
            });

            console.log(`📦 Found ${activeDeliveries.length} active deliveries to update`);

            const updateResults = {
                success: 0,
                failed: 0,
                delivered: 0
            };

            // Update each delivery
            for (const delivery of activeDeliveries) {
                try {
                    await this.updateSingleDelivery(delivery);
                    updateResults.success++;

                    // Check if delivery is now complete
                    if (delivery.delivery_status === 'delivered') {
                        updateResults.delivered++;
                    }
                } catch (error) {
                    console.error(`❌ Failed to update delivery ${delivery.tracking_number}:`, error.message);
                    updateResults.failed++;
                }
            }

            console.log('✅ Delivery update completed:', updateResults);

            return updateResults;

        } catch (error) {
            console.error('❌ Error in updateAllActiveDeliveries:', error);
            throw error;
        }
    }

    /**
     * Update a single delivery's position
     * @param {Object} delivery - Delivery instance
     */
    static async updateSingleDelivery(delivery) {
        try {
            // Calculate current position
            const positionData = PositionCalculator.calculateCurrentPosition(delivery);

            console.log(`📍 Updating ${delivery.tracking_number}: ${positionData.progress}% complete, Status: ${positionData.status}`);

            // Determine if we should create a tracking update
            // Create update if:
            // 1. Status has changed
            // 2. Progress has increased by at least 5%
            // 3. It's been more than 5 minutes since last update
            const shouldCreateUpdate = await this.shouldCreateTrackingUpdate(delivery, positionData);

            // Update delivery in database
            await delivery.update({
                current_latitude: positionData.latitude,
                current_longitude: positionData.longitude,
                current_location_address: PositionCalculator.generateLocationAddress(
                    positionData.latitude,
                    positionData.longitude
                ),
                delivery_status: positionData.status,
                // If delivered, set actual delivery time
                actual_delivery_time: positionData.status === 'delivered' ? new Date() : delivery.actual_delivery_time
            });

            // Create tracking update if needed
            if (shouldCreateUpdate) {
                await TrackingUpdate.create({
                    delivery_id: delivery.id,
                    latitude: positionData.latitude,
                    longitude: positionData.longitude,
                    location_address: PositionCalculator.generateLocationAddress(
                        positionData.latitude,
                        positionData.longitude
                    ),
                    status: positionData.status,
                    notes: this.generateUpdateNotes(positionData),
                    updated_by: null // Automatic update, not by admin
                });

                console.log(`  ✓ Created tracking update for ${delivery.tracking_number}`);
            }

            // Emit Socket.IO event (if socket is available)
            if (global.io) {
                global.io.emit('delivery-update', {
                    tracking_number: delivery.tracking_number,
                    position: {
                        latitude: positionData.latitude,
                        longitude: positionData.longitude
                    },
                    status: positionData.status,
                    progress: positionData.progress,
                    estimated_time_remaining: positionData.estimated_time_remaining
                });

                console.log(`  ✓ Broadcasted update via Socket.IO`);
            }

            return true;

        } catch (error) {
            console.error(`Error updating delivery ${delivery.tracking_number}:`, error);
            throw error;
        }
    }

    /**
     * Determine if a tracking update should be created
     * @param {Object} delivery - Delivery instance
     * @param {Object} positionData - Current position data
     * @returns {boolean}
     */
    static async shouldCreateTrackingUpdate(delivery, positionData) {
        // Always create update if status changed
        if (delivery.delivery_status !== positionData.status) {
            return true;
        }

        // Get last tracking update
        const lastUpdate = await TrackingUpdate.findOne({
            where: { delivery_id: delivery.id },
            order: [['recorded_at', 'DESC']]
        });

        // If no previous update exists, create one
        if (!lastUpdate) {
            return true;
        }

        // Check if it's been more than 5 minutes since last update
        const timeSinceLastUpdate = new Date() - new Date(lastUpdate.recorded_at);
        const fiveMinutes = 5 * 60 * 1000;

        if (timeSinceLastUpdate >= fiveMinutes) {
            return true;
        }

        return false;
    }

    /**
     * Generate descriptive notes for tracking update
     * @param {Object} positionData - Position data
     * @returns {string}
     */
    static generateUpdateNotes(positionData) {
        const notes = [];

        if (positionData.status === 'in_transit') {
            notes.push(`Package is in transit - ${positionData.progress}% complete`);
            notes.push(`Estimated time remaining: ${positionData.estimated_time_remaining}`);
            notes.push(`Distance remaining: ${positionData.remaining_distance} km`);
        } else if (positionData.status === 'arrived') {
            notes.push('Package has arrived at destination area');
            notes.push(`ETA: ${positionData.estimated_time_remaining}`);
        } else if (positionData.status === 'out_for_delivery') {
            notes.push('Package is out for delivery');
            notes.push('Delivery will be completed soon');
        } else if (positionData.status === 'delivered') {
            notes.push('Package has been delivered successfully');
        }

        return notes.join('. ');
    }

    /**
     * Force update a specific delivery by tracking number
     * Useful for manual triggers or testing
     * @param {string} trackingNumber - Tracking number
     */
    static async updateDeliveryByTrackingNumber(trackingNumber) {
        try {
            const delivery = await Delivery.findOne({
                where: { tracking_number: trackingNumber }
            });

            if (!delivery) {
                throw new Error('Delivery not found');
            }

            await this.updateSingleDelivery(delivery);

            return {
                success: true,
                message: `Delivery ${trackingNumber} updated successfully`
            };

        } catch (error) {
            console.error(`Error updating delivery ${trackingNumber}:`, error);
            throw error;
        }
    }

    /**
     * Get status of all active deliveries (for monitoring)
     */
    static async getActiveDeliveriesStatus() {
        try {
            const now = new Date();

            const activeDeliveries = await Delivery.findAll({
                where: {
                    start_time: { [Op.lte]: now },
                    end_time: { [Op.gte]: now },
                    delivery_status: {
                        [Op.notIn]: ['delivered', 'cancelled']
                    }
                },
                attributes: [
                    'id',
                    'tracking_number',
                    'delivery_status',
                    'current_latitude',
                    'current_longitude',
                    'start_time',
                    'end_time'
                ]
            });

            return activeDeliveries.map(delivery => {
                const positionData = PositionCalculator.calculateCurrentPosition(delivery);
                return {
                    tracking_number: delivery.tracking_number,
                    status: positionData.status,
                    progress: positionData.progress,
                    eta: positionData.estimated_time_remaining
                };
            });

        } catch (error) {
            console.error('Error getting active deliveries status:', error);
            throw error;
        }
    }
}

module.exports = DeliveryUpdater;