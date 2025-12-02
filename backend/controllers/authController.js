const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

class AuthController {
    /**
     * Admin Login
     * POST /api/auth/login
     * Body: { email, password }
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            // Find admin by email
            const admin = await Admin.findOne({
                where: {
                    email,
                    is_active: true
                }
            });

            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Verify password using instance method
            const isPasswordValid = await admin.verifyPassword(password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Update last login
            await admin.updateLastLogin();

            // Generate JWT token
            const token = jwt.sign(
                {
                    id: admin.id,
                    email: admin.email,
                    role: admin.role
                },
                process.env.JWT_SECRET || 'your-secret-key-change-this',
                { expiresIn: '24h' }
            );

            // Return success response (password excluded by toJSON)
            res.json({
                success: true,
                message: 'Login successful',
                token,
                admin: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email,
                    full_name: admin.full_name,
                    role: admin.role,
                    last_login: admin.last_login
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred during login',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Admin Registration
     * POST /api/auth/register
     * Body: { username, email, password, full_name, role }
     */
    static async register(req, res) {
        try {
            const { username, email, password, full_name, role } = req.body;

            // Validate input
            if (!username || !email || !password || !full_name) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required (username, email, password, full_name)'
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format'
                });
            }

            // Validate password length
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters long'
                });
            }

            // Check if email already exists
            const existingEmail = await Admin.findByEmail(email);
            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            // Check if username already exists
            const existingUsername = await Admin.findByUsername(username);
            if (existingUsername) {
                return res.status(409).json({
                    success: false,
                    message: 'Username already exists'
                });
            }

            // Create new admin (password will be hashed by beforeCreate hook)
            const newAdmin = await Admin.create({
                username,
                email,
                password,
                full_name,
                role: role || 'admin'
            });

            res.status(201).json({
                success: true,
                message: 'Admin registered successfully',
                admin: {
                    id: newAdmin.id,
                    username: newAdmin.username,
                    email: newAdmin.email,
                    full_name: newAdmin.full_name,
                    role: newAdmin.role
                }
            });

        } catch (error) {
            console.error('Registration error:', error);

            // Handle Sequelize validation errors
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    success: false,
                    message: error.errors[0].message || 'Validation error',
                    errors: error.errors.map(e => ({
                        field: e.path,
                        message: e.message
                    }))
                });
            }

            res.status(500).json({
                success: false,
                message: 'An error occurred during registration',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Get Current Admin Profile
     * GET /api/auth/me
     * Requires: Authentication (req.admin set by middleware)
     */
    static async getProfile(req, res) {
        try {
            // req.admin.id is set by authMiddleware
            const admin = await Admin.findByPk(req.admin.id, {
                attributes: { exclude: ['password'] }
            });

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            res.json({
                success: true,
                admin
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching profile',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Update Admin Profile
     * PUT /api/auth/profile
     * Body: { username, full_name }
     */
    static async updateProfile(req, res) {
        try {
            const { username, full_name } = req.body;

            const admin = await Admin.findByPk(req.admin.id);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            // Check if username is being changed and if it already exists
            if (username && username !== admin.username) {
                const existingUsername = await Admin.findByUsername(username);
                if (existingUsername) {
                    return res.status(409).json({
                        success: false,
                        message: 'Username already exists'
                    });
                }
                admin.username = username;
            }

            if (full_name) {
                admin.full_name = full_name;
            }

            await admin.save();

            res.json({
                success: true,
                message: 'Profile updated successfully',
                admin: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email,
                    full_name: admin.full_name,
                    role: admin.role
                }
            });

        } catch (error) {
            console.error('Update profile error:', error);

            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    success: false,
                    message: error.errors[0].message || 'Validation error'
                });
            }

            res.status(500).json({
                success: false,
                message: 'An error occurred while updating profile',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Change Password
     * PUT /api/auth/change-password
     * Body: { currentPassword, newPassword }
     */
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            // Validate input
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required'
                });
            }

            // Validate new password length
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 6 characters long'
                });
            }

            // Get admin with password
            const admin = await Admin.findByPk(req.admin.id);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            // Verify current password
            const isPasswordValid = await admin.verifyPassword(currentPassword);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Update password (will be hashed by beforeUpdate hook)
            admin.password = newPassword;
            await admin.save();

            res.json({
                success: true,
                message: 'Password changed successfully'
            });

        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while changing password',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Logout
     * POST /api/auth/logout
     * Note: JWT logout is handled client-side by removing the token
     */
    static async logout(req, res) {
        try {
            res.json({
                success: true,
                message: 'Logged out successfully. Please remove token from client.'
            });

        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred during logout',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Verify Token
     * GET /api/auth/verify
     * Requires: Authentication
     */
    static async verifyToken(req, res) {
        try {
            // If we reach here, token is valid (checked by middleware)
            const admin = await Admin.findByPk(req.admin.id, {
                attributes: { exclude: ['password'] }
            });

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            res.json({
                success: true,
                message: 'Token is valid',
                admin
            });

        } catch (error) {
            console.error('Verify token error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while verifying token',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Get All Admins (Super Admin only)
     * GET /api/auth/admins
     */
    static async getAllAdmins(req, res) {
        try {
            // Check if user is super_admin
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Super admin role required.'
                });
            }

            const admins = await Admin.findAll({
                attributes: { exclude: ['password'] },
                order: [['created_at', 'DESC']]
            });

            res.json({
                success: true,
                count: admins.length,
                admins
            });

        } catch (error) {
            console.error('Get all admins error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching admins',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Deactivate Admin (Super Admin only)
     * PUT /api/auth/admins/:id/deactivate
     */
    static async deactivateAdmin(req, res) {
        try {
            const { id } = req.params;

            // Check if user is super_admin
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Super admin role required.'
                });
            }

            // Prevent deactivating self
            if (parseInt(id) === req.admin.id) {
                return res.status(400).json({
                    success: false,
                    message: 'You cannot deactivate your own account'
                });
            }

            const admin = await Admin.findByPk(id);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            admin.is_active = false;
            await admin.save();

            res.json({
                success: true,
                message: 'Admin deactivated successfully'
            });

        } catch (error) {
            console.error('Deactivate admin error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while deactivating admin',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = AuthController;