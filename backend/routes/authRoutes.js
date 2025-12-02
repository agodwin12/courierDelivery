const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authMiddleware, superAdminOnly } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register new admin
 * @access  Public (but in production, you might want to protect this)
 */
router.post('/register', AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/login', AuthController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Admin logout (client-side token removal)
 * @access  Public
 */
router.post('/logout', AuthController.logout);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token validity
 * @access  Protected
 */
router.get('/verify', authMiddleware, AuthController.verifyToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current admin profile
 * @access  Protected
 */
router.get('/me', authMiddleware, AuthController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update admin profile
 * @access  Protected
 */
router.put('/profile', authMiddleware, AuthController.updateProfile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change admin password
 * @access  Protected
 */
router.put('/change-password', authMiddleware, AuthController.changePassword);

/**
 * @route   GET /api/auth/admins
 * @desc    Get all admins (Super Admin only)
 * @access  Protected (Super Admin)
 */
router.get('/admins', authMiddleware, superAdminOnly, AuthController.getAllAdmins);

/**
 * @route   PUT /api/auth/admins/:id/deactivate
 * @desc    Deactivate an admin (Super Admin only)
 * @access  Protected (Super Admin)
 */
router.put('/admins/:id/deactivate', authMiddleware, superAdminOnly, AuthController.deactivateAdmin);

module.exports = router;