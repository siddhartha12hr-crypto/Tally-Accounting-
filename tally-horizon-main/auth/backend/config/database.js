/**
 * ============================================
 * DATABASE CONFIGURATION
 * PostgreSQL connection and query utilities
 * ============================================
 */

const { Pool } = require('pg');
const logger = require('../utils/logger');

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tally_auth',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client', err);
});

/**
 * Execute a SQL query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Executed query', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    logger.error('Database query error:', { text, error: error.message });
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Pool client
 */
const getClient = async () => {
  try {
    const client = await pool.connect();
    
    // Wrapper for query method to log queries
    const originalQuery = client.query.bind(client);
    client.query = async (text, params) => {
      const start = Date.now();
      try {
        const result = await originalQuery(text, params);
        const duration = Date.now() - start;
        
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Executed query (transaction)', { text, duration, rows: result.rowCount });
        }
        
        return result;
      } catch (error) {
        logger.error('Transaction query error:', { text, error: error.message });
        throw error;
      }
    };
    
    // Wrapper for release to handle cleanup
    const originalRelease = client.release.bind(client);
    client.release = () => {
      logger.debug('Releasing client back to pool');
      originalRelease();
    };
    
    return client;
  } catch (error) {
    logger.error('Error getting database client:', error);
    throw error;
  }
};

/**
 * Test database connection
 * @returns {Promise<boolean>}
 */
const testDatabaseConnection = async () => {
  try {
    const result = await query('SELECT NOW() as now, current_database() as database');
    logger.info('✅ Database connection successful', {
      database: result.rows[0].database,
      timestamp: result.rows[0].now,
    });
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

/**
 * Close all database connections
 * @returns {Promise}
 */
const closePool = async () => {
  try {
    await pool.end();
    logger.info('Database pool has ended');
  } catch (error) {
    logger.error('Error closing database pool:', error);
    throw error;
  }
};

/**
 * Execute a transaction
 * @param {Function} callback - Function containing transaction queries
 * @returns {Promise}
 */
const transaction = async (callback) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Transaction rolled back:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Bulk insert helper
 * @param {string} table - Table name
 * @param {Array} columns - Column names
 * @param {Array} values - Array of value arrays
 * @returns {Promise}
 */
const bulkInsert = async (table, columns, values) => {
  if (!values || values.length === 0) {
    throw new Error('No values provided for bulk insert');
  }
  
  const placeholders = values.map((_, i) => {
    const offset = i * columns.length;
    return `(${columns.map((_, j) => `$${offset + j + 1}`).join(', ')})`;
  }).join(', ');
  
  const flatValues = values.flat();
  const text = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${placeholders}`;
  
  return query(text, flatValues);
};

/**
 * Cleanup expired records
 * @returns {Promise}
 */
const cleanupExpiredRecords = async () => {
  try {
    await query('SELECT cleanup_expired_otps()');
    await query('SELECT cleanup_expired_password_tokens()');
    await query('SELECT cleanup_expired_refresh_tokens()');
    await query('SELECT cleanup_old_login_attempts()');
    
    logger.info('Cleaned up expired records');
  } catch (error) {
    logger.error('Error cleaning up expired records:', error);
  }
};

// Schedule cleanup every hour
if (process.env.NODE_ENV !== 'test') {
  setInterval(cleanupExpiredRecords, 60 * 60 * 1000);
}

module.exports = {
  query,
  getClient,
  transaction,
  bulkInsert,
  testDatabaseConnection,
  closePool,
  cleanupExpiredRecords,
  pool,
};
