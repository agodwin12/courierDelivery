const express = require('express');
const router = express.Router();
const DeliveryController = require('../controllers/deliveryController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/deliveries
 * @desc    Create new delivery
 * @access  Protected
 */
router.post('/', authMiddleware, DeliveryController.createDelivery);

/**
 * @route   GET /api/deliveries
 * @desc    Get all deliveries (with filters)
 * @access  Protected
 */
router.get('/', authMiddleware, DeliveryController.getAllDeliveries);

/**
 * @route   GET /api/deliveries/stats/overview
 * @desc    Get delivery statistics
 * @access  Protected
 */
router.get('/stats/overview', authMiddleware, DeliveryController.getStatistics);

/**
 * @route   GET /api/deliveries/track/:tracking_number
 * @desc    Track delivery by tracking number (Public)
 * @access  Public
 */
router.get('/track/:tracking_number', DeliveryController.trackDelivery);

/**
 * @route   GET /api/deliveries/:id
 * @desc    Get single delivery by ID
 * @access  Protected
 */
router.get('/:id', authMiddleware, DeliveryController.getDeliveryById);

/**
 * @route   PUT /api/deliveries/:id
 * @desc    Update delivery
 * @access  Protected
 */
router.put('/:id', authMiddleware, DeliveryController.updateDelivery);

/**
 * @route   PUT /api/deliveries/:id/status
 * @desc    Update delivery status
 * @access  Protected
 */
router.put('/:id/status', authMiddleware, DeliveryController.updateDeliveryStatus);

/**
 * @route   PUT /api/deliveries/:id/location
 * @desc    Update delivery location and create tracking update
 * @access  Protected
 */
router.put('/:id/location', authMiddleware, DeliveryController.updateDeliveryLocation);

/**
 * @route   DELETE /api/deliveries/:id
 * @desc    Delete delivery
 * @access  Protected
 */
router.delete('/:id', authMiddleware, DeliveryController.deleteDelivery);

module.exports = router;