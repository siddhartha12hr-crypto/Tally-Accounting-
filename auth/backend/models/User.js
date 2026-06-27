/**
 * ============================================
 * USER MODEL
 * Database operations for users table
 * ============================================
 */

const bcrypt = require('bcryptjs');
const { query, transaction } = require('../config/database');
const logger = require('../utils/logger');

class User {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async create({ fullName, email, password, googleId = null, emailVerified = false }) {
    try {
      let passwordHash = null;
      
      // Hash password if provided
      if (password) {
        const salt = await bcrypt.genSalt(12);
        passwordHash = await bcrypt.hash(password, salt);
      }
      
      const text = `
        INSERT INTO users (full_name, email, password_hash, google_id, email_verified)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, full_name, email, google_id, email_verified, created_at
      `;
      
      const values = [fullName, email.toLowerCase(), passwordHash, googleId, emailVerified];
      const result = await query(text, values);
      
      logger.info('User created successfully', { userId: result.rows[0].id, email });
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('User with this email already exists');
      }
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  static async findById(id) {
    try {
      const text = `
        SELECT id, full_name, email, password_hash, google_id, email_verified, 
               otp_enabled, is_active, failed_login_attempts, account_locked_until,
               last_login, created_at, updated_at
        FROM users
        WHERE id = $1 AND is_active = true
      `;
      
      const result = await query(text, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  static async findByEmail(email) {
    try {
      const text = `
        SELECT id, full_name, email, password_hash, google_id, email_verified, 
               otp_enabled, is_active, failed_login_attempts, account_locked_until,
               last_login, created_at, updated_at
        FROM users
        WHERE LOWER(email) = LOWER($1) AND is_active = true
      `;
      
      const result = await query(text, [email]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find user by Google ID
   * @param {string} googleId - Google OAuth ID
   * @returns {Promise<Object|null>} User object or null
   */
  static async findByGoogleId(googleId) {
    try {
      const text = `
        SELECT id, full_name, email, google_id, email_verified, 
               otp_enabled, is_active, last_login, created_at
        FROM users
        WHERE google_id = $1 AND is_active = true
      `;
      
      const result = await query(text, [googleId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by Google ID:', error);
      throw error;
    }
  }

  /**
   * Verify user password
   * @param {string} userId - User ID
   * @param {string} password - Plain text password
   * @returns {Promise<boolean>} True if password matches
   */
  static async verifyPassword(userId, password) {
    try {
      const text = 'SELECT password_hash FROM users WHERE id = $1';
      const result = await query(text, [userId]);
      
      if (!result.rows[0] || !result.rows[0].password_hash) {
        return false;
      }
      
      return await bcrypt.compare(password, result.rows[0].password_hash);
    } catch (error) {
      logger.error('Error verifying password:', error);
      return false;
    }
  }

  /**
   * Update user's email verification status
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated user
   */
  static async markEmailAsVerified(userId) {
    try {
      const text = `
        UPDATE users 
        SET email_verified = true, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, email, email_verified
      `;
      
      const result = await query(text, [userId]);
      logger.info('Email verified', { userId });
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error marking email as verified:', error);
      throw error;
    }
  }

  /**
   * Update user's last login timestamp
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  static async updateLastLogin(userId) {
    try {
      const text = `
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP, 
            failed_login_attempts = 0,
            account_locked_until = NULL
        WHERE id = $1
      `;
      
      await query(text, [userId]);
      logger.debug('Last login updated', { userId });
    } catch (error) {
      logger.error('Error updating last login:', error);
      // Don't throw - this is not critical
    }
  }

  /**
   * Increment failed login attempts
   * @param {string} userId - User ID
   * @returns {Promise<number>} New count of failed attempts
   */
  static async incrementFailedLoginAttempts(userId) {
    try {
      const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
      const lockoutTime = parseInt(process.env.ACCOUNT_LOCKOUT_TIME) || 30;
      
      const text = `
        UPDATE users 
        SET failed_login_attempts = failed_login_attempts + 1,
            account_locked_until = CASE 
              WHEN failed_login_attempts + 1 >= $2 
              THEN CURRENT_TIMESTAMP + INTERVAL '${lockoutTime} minutes'
              ELSE account_locked_until
            END
        WHERE id = $1
        RETURNING failed_login_attempts, account_locked_until
      `;
      
      const result = await query(text, [userId, maxAttempts]);
      
      if (result.rows[0].account_locked_until) {
        logger.warn('Account locked due to failed attempts', { 
          userId, 
          attempts: result.rows[0].failed_login_attempts 
        });
      }
      
      return result.rows[0].failed_login_attempts;
    } catch (error) {
      logger.error('Error incrementing failed login attempts:', error);
      throw error;
    }
  }

  /**
   * Check if account is locked
   * @param {Object} user - User object
   * @returns {boolean} True if account is locked
   */
  static isAccountLocked(user) {
    if (!user.account_locked_until) {
      return false;
    }
    
    const lockoutTime = new Date(user.account_locked_until);
    const now = new Date();
    
    return lockoutTime > now;
  }

  /**
   * Update user password
   * @param {string} userId - User ID
   * @param {string} newPassword - New plain text password
   * @returns {Promise}
   */
  static async updatePassword(userId, newPassword) {
    try {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(newPassword, salt);
      
      const text = `
        UPDATE users 
        SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;
      
      await query(text, [passwordHash, userId]);
      logger.info('Password updated', { userId });
    } catch (error) {
      logger.error('Error updating password:', error);
      throw error;
    }
  }

  /**
   * Link Google account to existing user
   * @param {string} userId - User ID
   * @param {string} googleId - Google OAuth ID
   * @returns {Promise}
   */
  static async linkGoogleAccount(userId, googleId) {
    try {
      const text = `
        UPDATE users 
        SET google_id = $1, email_verified = true, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;
      
      await query(text, [googleId, userId]);
      logger.info('Google account linked', { userId, googleId });
    } catch (error) {
      logger.error('Error linking Google account:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user
   */
  static async updateProfile(userId, updates) {
    try {
      const allowedFields = ['full_name', 'email'];
      const fields = [];
      const values = [];
      let paramCounter = 1;
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key) && value !== undefined) {
          fields.push(`${key} = $${paramCounter}`);
          values.push(value);
          paramCounter++;
        }
      }
      
      if (fields.length === 0) {
        throw new Error('No valid fields to update');
      }
      
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(userId);
      
      const text = `
        UPDATE users 
        SET ${fields.join(', ')}
        WHERE id = $${paramCounter}
        RETURNING id, full_name, email, email_verified, created_at, updated_at
      `;
      
      const result = await query(text, values);
      logger.info('User profile updated', { userId });
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Deactivate user account
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  static async deactivateAccount(userId) {
    try {
      const text = `
        UPDATE users 
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `;
      
      await query(text, [userId]);
      logger.info('User account deactivated', { userId });
    } catch (error) {
      logger.error('Error deactivating account:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  static async getStatistics() {
    try {
      const text = `
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users,
          COUNT(CASE WHEN google_id IS NOT NULL THEN 1 END) as google_users,
          COUNT(CASE WHEN last_login > CURRENT_TIMESTAMP - INTERVAL '30 days' THEN 1 END) as active_users
        FROM users
        WHERE is_active = true
      `;
      
      const result = await query(text);
      return result.rows[0];
    } catch (error) {
      logger.error('Error getting user statistics:', error);
      throw error;
    }
  }
}

module.exports = User;
