/**
 * ============================================
 * SOCKET.IO REAL-TIME SERVICE
 * WebSocket server for real-time updates
 * ============================================
 */

const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const User = require('../models/User');

let io;

/**
 * Initialize Socket.IO server
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.IO instance
 */
function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:8080',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      // Attach user info to socket
      socket.userId = user.id;
      socket.userEmail = user.email;
      socket.userRole = user.is_admin ? 'admin' : 'user';
      socket.userName = user.full_name;
      
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userName} (${socket.userId})`);
    
    // Join user-specific room
    socket.join(`user:${socket.userId}`);
    
    // Join role-specific rooms
    if (socket.userRole === 'admin') {
      socket.join('admin');
      logger.info(`Admin ${socket.userName} joined admin room`);
    }
    
    // Notify user of successful connection
    socket.emit('connected', {
      message: 'Connected to real-time server',
      userId: socket.userId,
      timestamp: new Date().toISOString(),
    });
    
    // Broadcast user online status
    socket.broadcast.emit('user:online', {
      userId: socket.userId,
      userName: socket.userName,
    });

    // ============================================
    // COURSE EVENTS
    // ============================================

    // Admin creates course
    socket.on('course:create', async (courseData) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      try {
        // Broadcast to all users
        io.emit('course:created', {
          ...courseData,
          timestamp: new Date().toISOString(),
        });

        logger.info(`Course created: ${courseData.title}`);
      } catch (error) {
        logger.error('Error broadcasting course creation:', error);
        socket.emit('error', { message: 'Failed to broadcast course creation' });
      }
    });

    // Admin updates course
    socket.on('course:update', (courseData) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      io.emit('course:updated', {
        ...courseData,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Course updated: ${courseData.id}`);
    });

    // Admin deletes course
    socket.on('course:delete', (courseId) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      io.emit('course:deleted', {
        courseId,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Course deleted: ${courseId}`);
    });

    // Admin publishes/unpublishes course
    socket.on('course:publish', (data) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      io.emit('course:published', {
        courseId: data.courseId,
        isPublished: data.isPublished,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Course ${data.isPublished ? 'published' : 'unpublished'}: ${data.courseId}`);
    });

    // Admin changes price
    socket.on('course:price_change', (data) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      io.emit('course:price_changed', {
        courseId: data.courseId,
        oldPrice: data.oldPrice,
        newPrice: data.newPrice,
        isFree: data.isFree,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Course price changed: ${data.courseId} - ${data.oldPrice} → ${data.newPrice}`);
    });

    // ============================================
    // VIDEO EVENTS
    // ============================================

    socket.on('video:upload', (videoData) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      io.emit('video:uploaded', {
        ...videoData,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Video uploaded: ${videoData.title}`);
    });

    socket.on('video:update', (videoData) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      io.emit('video:updated', {
        ...videoData,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Video updated: ${videoData.id}`);
    });

    socket.on('video:delete', (videoId) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      io.emit('video:deleted', {
        videoId,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Video deleted: ${videoId}`);
    });

    // ============================================
    // PURCHASE & ACCESS EVENTS
    // ============================================

    socket.on('purchase:completed', (purchaseData) => {
      // Notify the user who made the purchase
      io.to(`user:${purchaseData.userId}`).emit('purchase:success', {
        ...purchaseData,
        message: 'Purchase successful! You now have access.',
        timestamp: new Date().toISOString(),
      });

      // Notify admins
      io.to('admin').emit('purchase:new', {
        ...purchaseData,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Purchase completed: User ${purchaseData.userId} → Course ${purchaseData.courseId}`);
    });

    socket.on('access:grant', (data) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      // Notify the user
      io.to(`user:${data.userId}`).emit('access:granted', {
        courseId: data.courseId,
        message: 'You have been granted access to this course!',
        timestamp: new Date().toISOString(),
      });

      logger.info(`Access granted: User ${data.userId} → Course ${data.courseId}`);
    });

    socket.on('purchase:refund', (data) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      // Notify the user
      io.to(`user:${data.userId}`).emit('purchase:refunded', {
        courseId: data.courseId,
        amount: data.amount,
        message: 'Your purchase has been refunded.',
        timestamp: new Date().toISOString(),
      });

      logger.info(`Purchase refunded: User ${data.userId} → Course ${data.courseId}`);
    });

    // ============================================
    // PROGRESS SYNC
    // ============================================

    socket.on('progress:update', async (progressData) => {
      // Update progress in database
      // Then broadcast to all user's devices
      io.to(`user:${socket.userId}`).emit('progress:updated', {
        ...progressData,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });

      logger.debug(`Progress updated: User ${socket.userId} → Video ${progressData.videoId}`);
    });

    // ============================================
    // NOTIFICATIONS
    // ============================================

    socket.on('notification:send', (notification) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      // Broadcast to all users or specific users
      if (notification.targetUsers) {
        notification.targetUsers.forEach(userId => {
          io.to(`user:${userId}`).emit('notification', notification);
        });
      } else {
        io.emit('notification', notification);
      }

      logger.info(`Notification sent: ${notification.title}`);
    });

    // ============================================
    // ANNOUNCEMENTS
    // ============================================

    socket.on('announcement:create', (announcement) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      io.emit('announcement:new', {
        ...announcement,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Announcement created: ${announcement.title}`);
    });

    socket.on('announcement:update', (announcement) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      io.emit('announcement:updated', announcement);
      logger.info(`Announcement updated: ${announcement.id}`);
    });

    socket.on('announcement:delete', (announcementId) => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      io.emit('announcement:deleted', { announcementId });
      logger.info(`Announcement deleted: ${announcementId}`);
    });

    // ============================================
    // CHAT SUPPORT
    // ============================================

    socket.on('chat:message', (data) => {
      // Send to admin or user
      const targetRoom = data.isAdmin ? `user:${data.targetUserId}` : 'admin';
      
      io.to(targetRoom).emit('chat:message', {
        ...data,
        senderId: socket.userId,
        senderName: socket.userName,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('chat:typing', (data) => {
      const targetRoom = data.isAdmin ? `user:${data.targetUserId}` : 'admin';
      io.to(targetRoom).emit('chat:typing', {
        userId: socket.userId,
        userName: socket.userName,
      });
    });

    socket.on('chat:read', (data) => {
      io.to(`user:${data.targetUserId}`).emit('chat:read', {
        messageId: data.messageId,
        readBy: socket.userId,
      });
    });

    // ============================================
    // ADMIN DASHBOARD STATS
    // ============================================

    socket.on('stats:request', () => {
      if (socket.userRole !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      // Send current stats to admin
      socket.emit('stats:updated', getRealtimeStats());
    });

    // ============================================
    // DISCONNECT
    // ============================================

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userName} (${socket.userId})`);
      
      // Broadcast user offline status
      socket.broadcast.emit('user:offline', {
        userId: socket.userId,
        userName: socket.userName,
      });
    });

    // Error handler
    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  });

  logger.info('✅ Socket.IO server initialized');
  return io;
}

/**
 * Get Socket.IO instance
 * @returns {Object} Socket.IO instance
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}

/**
 * Broadcast event to all connected clients
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
function broadcast(event, data) {
  if (io) {
    io.emit(event, data);
    logger.debug(`Broadcasted event: ${event}`);
  }
}

/**
 * Send event to specific user
 * @param {string} userId - User ID
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
function sendToUser(userId, event, data) {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
    logger.debug(`Sent event to user ${userId}: ${event}`);
  }
}

/**
 * Send event to all admins
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
function sendToAdmins(event, data) {
  if (io) {
    io.to('admin').emit(event, data);
    logger.debug(`Sent event to admins: ${event}`);
  }
}

/**
 * Get real-time statistics (placeholder)
 * @returns {Object} Statistics
 */
function getRealtimeStats() {
  // This would fetch from database/cache
  return {
    onlineUsers: io ? io.sockets.sockets.size : 0,
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    courseSales: 0,
    videoSales: 0,
    newRegistrations: 0,
  };
}

module.exports = {
  initializeSocket,
  getIO,
  broadcast,
  sendToUser,
  sendToAdmins,
  getRealtimeStats,
};
