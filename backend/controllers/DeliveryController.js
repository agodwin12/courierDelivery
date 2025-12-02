const Delivery = require('../models/Delivery');
const TrackingUpdate = require('../models/TrackingUpdate');
const Admin = require('../models/Admin');

class DeliveryController {
    /**
     * Create New Delivery
     * POST /api/deliveries
     */
    static async createDelivery(req, res) {
        try {
            const {
                sender_name,
                sender_phone,
                sender_email,
                sender_address,
                receiver_name,
                receiver_phone,
                receiver_email,
                receiver_address,
                delivery_method,
                start_time,
                end_time,
                estimated_arrival,
                package_weight,
                package_dimensions,
                special_instructions
            } = req.body;

            // Validate required fields
            if (!sender_name || !sender_phone || !sender_email || !sender_address ||
                !receiver_name || !receiver_phone || !receiver_email || !receiver_address ||
                !delivery_method || !start_time || !end_time) {
                return res.status(400).json({
                    success: false,
                    message: 'All required fields must be provided'
                });
            }

            // Generate tracking number
            const tracking_number = Delivery.generateTrackingNumber();

            // Create delivery
            const delivery = await Delivery.create({
                tracking_number,
                sender_name,
                sender_phone,
                sender_email,
                sender_address,
                receiver_name,
                receiver_phone,
                receiver_email,
                receiver_address,
                delivery_method,
                start_time,
                end_time,
                estimated_arrival,
                package_weight,
                package_dimensions,
                special_instructions,
                created_by: req.admin.id
            });

            res.status(201).json({
                success: true,
                message: 'Delivery created successfully',
                delivery
            });

        } catch (error) {
            console.error('Create delivery error:', error);

            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    success: false,
                    message: error.errors[0].message
                });
            }

            res.status(500).json({
                success: false,
                message: 'An error occurred while creating delivery',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Get All Deliveries
     * GET /api/deliveries
     */
    static async getAllDeliveries(req, res) {
        try {
            const { status, method, page = 1, limit = 50 } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (status) where.delivery_status = status;
            if (method) where.delivery_method = method;

            const { count, rows: deliveries } = await Delivery.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['created_at', 'DESC']],
                include: [
                    {
                        model: Admin,
                        as: 'creator',
                        attributes: ['id', 'username', 'full_name']
                    }
                ]
            });

            res.json({
                success: true,
                count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                deliveries
            });

        } catch (error) {
            console.error('Get deliveries error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching deliveries',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Get Single Delivery by ID
     * GET /api/deliveries/:id
     */
    static async getDeliveryById(req, res) {
        try {
            const { id } = req.params;

            const delivery = await Delivery.findByPk(id, {
                include: [
                    {
                        model: Admin,
                        as: 'creator',
                        attributes: ['id', 'username', 'full_name']
                    },
                    {
                        model: TrackingUpdate,
                        as: 'tracking_updates',
                        order: [['recorded_at', 'DESC']]
                    }
                ]
            });

            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: 'Delivery not found'
                });
            }

            res.json({
                success: true,
                delivery
            });

        } catch (error) {
            console.error('Get delivery error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching delivery',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Get Delivery by Tracking Number (Public)
     * GET /api/deliveries/track/:tracking_number
     */
    static async trackDelivery(req, res) {
        try {
            const { tracking_number } = req.params;

            const delivery = await Delivery.findByTrackingNumber(tracking_number);

            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: 'Tracking number not found'
                });
            }

            // Get tracking updates
            const trackingUpdates = await TrackingUpdate.getDeliveryHistory(delivery.id);

            res.json({
                success: true,
                delivery: {
                    tracking_number: delivery.tracking_number,
                    sender_name: delivery.sender_name,
                    receiver_name: delivery.receiver_name,
                    receiver_address: delivery.receiver_address,
                    delivery_method: delivery.delivery_method,
                    delivery_status: delivery.delivery_status,
                    start_time: delivery.start_time,
                    end_time: delivery.end_time,
                    estimated_arrival: delivery.estimated_arrival,
                    actual_delivery_time: delivery.actual_delivery_time,
                    current_latitude: delivery.current_latitude,
                    current_longitude: delivery.current_longitude,
                    current_location_address: delivery.current_location_address
                },
                tracking_updates: trackingUpdates
            });

        } catch (error) {
            console.error('Track delivery error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while tracking delivery',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Update Delivery
     * PUT /api/deliveries/:id
     */
    static async updateDelivery(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const delivery = await Delivery.findByPk(id);

            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: 'Delivery not found'
                });
            }

            // Update delivery
            await delivery.update(updateData);

            res.json({
                success: true,
                message: 'Delivery updated successfully',
                delivery
            });

        } catch (error) {
            console.error('Update delivery error:', error);

            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    success: false,
                    message: error.errors[0].message
                });
            }

            res.status(500).json({
                success: false,
                message: 'An error occurred while updating delivery',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Update Delivery Status
     * PUT /api/deliveries/:id/status
     */
    static async updateDeliveryStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            const delivery = await Delivery.findByPk(id);

            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: 'Delivery not found'
                });
            }

            await delivery.updateStatus(status);

            res.json({
                success: true,
                message: 'Delivery status updated successfully',
                delivery
            });

        } catch (error) {
            console.error('Update status error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating status',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Update Delivery Location
     * PUT /api/deliveries/:id/location
     */
    static async updateDeliveryLocation(req, res) {
        try {
            const { id } = req.params;
            const { latitude, longitude, address, status, notes } = req.body;

            if (!latitude || !longitude) {
                return res.status(400).json({
                    success: false,
                    message: 'Latitude and longitude are required'
                });
            }

            const delivery = await Delivery.findByPk(id);

            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: 'Delivery not found'
                });
            }

            // Update delivery location
            await delivery.updateLocation(latitude, longitude, address);

            // Create tracking update
            await TrackingUpdate.create({
                delivery_id: delivery.id,
                latitude,
                longitude,
                location_address: address,
                status: status || 'in_transit',
                notes,
                updated_by: req.admin.id
            });

            res.json({
                success: true,
                message: 'Location updated successfully',
                delivery
            });

        } catch (error) {
            console.error('Update location error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating location',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Delete Delivery
     * DELETE /api/deliveries/:id
     */
    static async deleteDelivery(req, res) {
        try {
            const { id } = req.params;

            const delivery = await Delivery.findByPk(id);

            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: 'Delivery not found'
                });
            }

            await delivery.destroy();

            res.json({
                success: true,
                message: 'Delivery deleted successfully'
            });

        } catch (error) {
            console.error('Delete delivery error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting delivery',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Get Delivery Statistics
     * GET /api/deliveries/stats/overview
     */
    static async getStatistics(req, res) {
        try {
            const totalDeliveries = await Delivery.count();
            const pendingDeliveries = await Delivery.count({ where: { delivery_status: 'pending' } });
            const inTransitDeliveries = await Delivery.count({ where: { delivery_status: 'in_transit' } });
            const deliveredDeliveries = await Delivery.count({ where: { delivery_status: 'delivered' } });
            const cancelledDeliveries = await Delivery.count({ where: { delivery_status: 'cancelled' } });

            res.json({
                success: true,
                stats: {
                    total: totalDeliveries,
                    pending: pendingDeliveries,
                    in_transit: inTransitDeliveries,
                    delivered: deliveredDeliveries,
                    cancelled: cancelledDeliveries
                }
            });

        } catch (error) {
            console.error('Get statistics error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching statistics',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = DeliveryController;