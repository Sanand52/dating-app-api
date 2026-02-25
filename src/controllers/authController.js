const authService = require('../services/authService');
const userService = require('../services/userService');
const apiResponse = require('../utils/apiResponse');

class AuthController {

    // POST /api/auth/login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return apiResponse.error(res, 'Email and password are required', 400);
            }

            const result = await authService.login(email, password);
            return apiResponse.success(res, 'Login successful', result);
        } catch (error) {
            return apiResponse.error(res, error.message, 401);
        }
    }

    // POST /api/auth/otp/request
    async requestOtp(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return apiResponse.error(res, 'Email is required', 400);
            }

            // Check if user exists
            const user = await userService.getUserByEmail(email);
            if (!user) {
                return apiResponse.error(res, 'No account found with this email', 404);
            }

            const result = await authService.requestOtpLogin(email);
            
            return apiResponse.success(res, result.message);
        } catch (error) {
            return apiResponse.error(res, error.message, 400);
        }
    }

    // POST /api/auth/otp/verify
    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return apiResponse.error(res, 'Email and OTP are required', 400);
            }

            // Check if user exists
            const user = await userService.getUserByEmail(email);
            if (!user) {
                return apiResponse.error(res, 'No account found with this email', 404);
            }

            const result = await authService.verifyOtpLogin(email, otp);
            return apiResponse.success(res, 'OTP verified. Login successful', result);
        } catch (error) {
            return apiResponse.error(res, error.message, 401);
        }
    }
    // POST /api/auth/forgot-password
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return apiResponse.error(res, 'Email is required', 400);
            }

            const result = await authService.forgotPassword(email);
            return apiResponse.success(res, result.message);
        } catch (error) {
            return apiResponse.error(res, error.message, 400);
        }
    }

    // POST /api/auth/reset-password
    async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;

            if (!email || !otp || !newPassword) {
                return apiResponse.error(res, 'Email, OTP, and new password are required', 400);
            }

            if (newPassword.length < 6) {
                return apiResponse.error(res, 'Password must be at least 6 characters', 400);
            }

            const result = await authService.resetPassword(email, otp, newPassword);
            return apiResponse.success(res, result.message);
        } catch (error) {
            return apiResponse.error(res, error.message, 400);
        }
    }
}

module.exports = new AuthController();
