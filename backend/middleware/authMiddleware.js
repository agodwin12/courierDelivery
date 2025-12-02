const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Verify JWT Token Middleware
 * Protects routes that require authentication
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            // Verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'your-secret-key-change-this'
            );

            // Check if admin still exists and is active
            const admin = await Admin.findOne({
                where: {
                    id: decoded.id,
                    is_active: true
                },
                attributes: { exclude: ['password'] }
            });

            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. Admin account not found or inactive.'
                });
            }

            // Attach admin info to request object
            req.admin = {
                id: admin.id,
                email: admin.email,
                username: admin.username,
                role: admin.role
            };

            next();

        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired. Please login again.'
                });
            }

            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token. Please login again.'
                });
            }

            throw jwtError;
        }

    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during authentication',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Role-Based Access Control Middleware
 * Checks if admin has required role
 * @param  {...string} roles - Allowed roles (e.g., 'super_admin', 'admin')
 */
const checkRole = (...roles) => {
    return (req, res, next) => {
        try {
            // Check if admin is authenticated
            if (!req.admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Check if admin has required role
            if (!roles.includes(req.admin.role)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required role: ${roles.join(' or ')}`
                });
            }

            next();

        } catch (error) {
            console.error('Role check error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during role verification',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    };
};

/**
 * Super Admin Only Middleware
 * Shorthand for checkRole('super_admin')
 */
const superAdminOnly = checkRole('super_admin');

/**
 * Admin or Super Admin Middleware
 * Shorthand for checkRole('admin', 'super_admin')
 */
const adminOnly = checkRole('admin', 'super_admin');

module.exports = {
    authMiddleware,
    checkRole,
    superAdminOnly,
    adminOnly
};