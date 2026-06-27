/**
 * ============================================
 * REAL-TIME SERVICE - Frontend
 * Socket.IO client for real-time updates
 * ============================================
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class RealtimeService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnected = false;

  /**
   * Initialize Socket.IO connection
   */
  connect(token: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupListeners();
    console.log('🔌 Connecting to real-time server...');
  }

  /**
   * Setup socket event listeners
   */
  private setupListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('✅ Connected to real-time server');
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('❌ Disconnected from real-time server:', reason);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      this.reconnectAttempts = attemptNumber;
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Failed to reconnect to real-time server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Connected confirmation
    this.socket.on('connected', (data) => {
      console.log('Server connection confirmed:', data.message);
    });
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('Disconnected from real-time server');
    }
  }

  /**
   * Check if connected
   */
  get connected(): boolean {
    return this.isConnected;
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  // ============================================
  // COURSE EVENTS
  // ============================================

  /**
   * Listen for course created events
   */
  onCourseCreated(callback: (course: any) => void) {
    this.socket?.on('course:created', callback);
  }

  /**
   * Listen for course updated events
   */
  onCourseUpdated(callback: (course: any) => void) {
    this.socket?.on('course:updated', callback);
  }

  /**
   * Listen for course deleted events
   */
  onCourseDeleted(callback: (data: { courseId: string }) => void) {
    this.socket?.on('course:deleted', callback);
  }

  /**
   * Listen for course published events
   */
  onCoursePublished(callback: (data: { courseId: string; isPublished: boolean }) => void) {
    this.socket?.on('course:published', callback);
  }

  /**
   * Listen for course price changed events
   */
  onCoursePriceChanged(callback: (data: any) => void) {
    this.socket?.on('course:price_changed', callback);
  }

  // ============================================
  // VIDEO EVENTS
  // ============================================

  /**
   * Listen for video uploaded events
   */
  onVideoUploaded(callback: (video: any) => void) {
    this.socket?.on('video:uploaded', callback);
  }

  /**
   * Listen for video updated events
   */
  onVideoUpdated(callback: (video: any) => void) {
    this.socket?.on('video:updated', callback);
  }

  /**
   * Listen for video deleted events
   */
  onVideoDeleted(callback: (data: { videoId: string }) => void) {
    this.socket?.on('video:deleted', callback);
  }

  // ============================================
  // PURCHASE & ACCESS EVENTS
  // ============================================

  /**
   * Listen for purchase success events
   */
  onPurchaseSuccess(callback: (purchase: any) => void) {
    this.socket?.on('purchase:success', callback);
  }

  /**
   * Listen for access granted events
   */
  onAccessGranted(callback: (data: { courseId: string; message: string }) => void) {
    this.socket?.on('access:granted', callback);
  }

  /**
   * Listen for purchase refunded events
   */
  onPurchaseRefunded(callback: (data: any) => void) {
    this.socket?.on('purchase:refunded', callback);
  }

  /**
   * Emit purchase completed event (from payment gateway)
   */
  emitPurchaseCompleted(purchaseData: any) {
    this.socket?.emit('purchase:completed', purchaseData);
  }

  // ============================================
  // PROGRESS SYNC
  // ============================================

  /**
   * Listen for progress updated events
   */
  onProgressUpdated(callback: (progress: any) => void) {
    this.socket?.on('progress:updated', callback);
  }

  /**
   * Emit progress update
   */
  emitProgressUpdate(progressData: any) {
    this.socket?.emit('progress:update', progressData);
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================

  /**
   * Listen for notifications
   */
  onNotification(callback: (notification: any) => void) {
    this.socket?.on('notification', callback);
  }

  // ============================================
  // ANNOUNCEMENTS
  // ============================================

  /**
   * Listen for new announcements
   */
  onAnnouncementNew(callback: (announcement: any) => void) {
    this.socket?.on('announcement:new', callback);
  }

  /**
   * Listen for updated announcements
   */
  onAnnouncementUpdated(callback: (announcement: any) => void) {
    this.socket?.on('announcement:updated', callback);
  }

  /**
   * Listen for deleted announcements
   */
  onAnnouncementDeleted(callback: (data: { announcementId: string }) => void) {
    this.socket?.on('announcement:deleted', callback);
  }

  // ============================================
  // CHAT SUPPORT
  // ============================================

  /**
   * Listen for chat messages
   */
  onChatMessage(callback: (message: any) => void) {
    this.socket?.on('chat:message', callback);
  }

  /**
   * Listen for typing indicators
   */
  onChatTyping(callback: (data: { userId: string; userName: string }) => void) {
    this.socket?.on('chat:typing', callback);
  }

  /**
   * Listen for read receipts
   */
  onChatRead(callback: (data: { messageId: string; readBy: string }) => void) {
    this.socket?.on('chat:read', callback);
  }

  /**
   * Send chat message
   */
  sendChatMessage(message: any) {
    this.socket?.emit('chat:message', message);
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(data: any) {
    this.socket?.emit('chat:typing', data);
  }

  /**
   * Send read receipt
   */
  sendReadReceipt(data: any) {
    this.socket?.emit('chat:read', data);
  }

  // ============================================
  // ADMIN EVENTS
  // ============================================

  /**
   * Listen for admin dashboard stats updates
   */
  onStatsUpdated(callback: (stats: any) => void) {
    this.socket?.on('stats:updated', callback);
  }

  /**
   * Request current stats (admin only)
   */
  requestStats() {
    this.socket?.emit('stats:request');
  }

  /**
   * Emit course creation (admin only)
   */
  emitCourseCreate(courseData: any) {
    this.socket?.emit('course:create', courseData);
  }

  /**
   * Emit course update (admin only)
   */
  emitCourseUpdate(courseData: any) {
    this.socket?.emit('course:update', courseData);
  }

  /**
   * Emit course deletion (admin only)
   */
  emitCourseDelete(courseId: string) {
    this.socket?.emit('course:delete', courseId);
  }

  /**
   * Emit course publish/unpublish (admin only)
   */
  emitCoursePublish(data: { courseId: string; isPublished: boolean }) {
    this.socket?.emit('course:publish', data);
  }

  /**
   * Emit course price change (admin only)
   */
  emitCoursePriceChange(data: any) {
    this.socket?.emit('course:price_change', data);
  }

  /**
   * Emit video upload (admin only)
   */
  emitVideoUpload(videoData: any) {
    this.socket?.emit('video:upload', videoData);
  }

  /**
   * Emit video update (admin only)
   */
  emitVideoUpdate(videoData: any) {
    this.socket?.emit('video:update', videoData);
  }

  /**
   * Emit video deletion (admin only)
   */
  emitVideoDelete(videoId: string) {
    this.socket?.emit('video:delete', videoId);
  }

  /**
   * Emit access grant (admin only)
   */
  emitAccessGrant(data: { userId: string; courseId: string }) {
    this.socket?.emit('access:grant', data);
  }

  /**
   * Emit purchase refund (admin only)
   */
  emitPurchaseRefund(data: { userId: string; courseId: string; amount: number }) {
    this.socket?.emit('purchase:refund', data);
  }

  /**
   * Emit notification (admin only)
   */
  emitNotification(notification: any) {
    this.socket?.emit('notification:send', notification);
  }

  /**
   * Emit announcement creation (admin only)
   */
  emitAnnouncementCreate(announcement: any) {
    this.socket?.emit('announcement:create', announcement);
  }

  /**
   * Emit announcement update (admin only)
   */
  emitAnnouncementUpdate(announcement: any) {
    this.socket?.emit('announcement:update', announcement);
  }

  /**
   * Emit announcement deletion (admin only)
   */
  emitAnnouncementDelete(announcementId: string) {
    this.socket?.emit('announcement:delete', announcementId);
  }

  // ============================================
  // USER STATUS EVENTS
  // ============================================

  /**
   * Listen for user online events
   */
  onUserOnline(callback: (data: { userId: string; userName: string }) => void) {
    this.socket?.on('user:online', callback);
  }

  /**
   * Listen for user offline events
   */
  onUserOffline(callback: (data: { userId: string; userName: string }) => void) {
    this.socket?.on('user:offline', callback);
  }

  // ============================================
  // CLEANUP
  // ============================================

  /**
   * Remove all listeners for an event
   */
  off(event: string) {
    this.socket?.off(event);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
export default realtimeService;
