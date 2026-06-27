/**
 * ============================================
 * USE REALTIME HOOK
 * React hook for real-time updates
 * ============================================
 */

import { useEffect, useCallback } from 'react';
import { realtimeService } from '@/services/realtimeService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UseRealtimeOptions {
  onCourseCreated?: (course: any) => void;
  onCourseUpdated?: (course: any) => void;
  onCourseDeleted?: (data: { courseId: string }) => void;
  onCoursePriceChanged?: (data: any) => void;
  onVideoUploaded?: (video: any) => void;
  onVideoUpdated?: (video: any) => void;
  onVideoDeleted?: (data: { videoId: string }) => void;
  onPurchaseSuccess?: (purchase: any) => void;
  onAccessGranted?: (data: any) => void;
  onPurchaseRefunded?: (data: any) => void;
  onProgressUpdated?: (progress: any) => void;
  onNotification?: (notification: any) => void;
  onAnnouncementNew?: (announcement: any) => void;
  showToasts?: boolean;
}

/**
 * Hook to use real-time updates
 * @param options - Callback options for various events
 */
export function useRealtime(options: UseRealtimeOptions = {}) {
  const { user, accessToken } = useAuth();
  const showToasts = options.showToasts !== false;

  // Connect to real-time server
  useEffect(() => {
    if (user && accessToken) {
      realtimeService.connect(accessToken);

      return () => {
        realtimeService.disconnect();
      };
    }
  }, [user, accessToken]);

  // Setup course event listeners
  useEffect(() => {
    if (options.onCourseCreated) {
      realtimeService.onCourseCreated((course) => {
        options.onCourseCreated!(course);
        if (showToasts) {
          toast.success('New course available!', {
            description: course.title,
            action: {
              label: 'View',
              onClick: () => window.location.href = `/courses/${course.id}`,
            },
          });
        }
      });
    }

    if (options.onCourseUpdated) {
      realtimeService.onCourseUpdated((course) => {
        options.onCourseUpdated!(course);
        if (showToasts) {
          toast.info('Course updated', {
            description: course.title,
          });
        }
      });
    }

    if (options.onCourseDeleted) {
      realtimeService.onCourseDeleted((data) => {
        options.onCourseDeleted!(data);
        if (showToasts) {
          toast.warning('Course removed');
        }
      });
    }

    if (options.onCoursePriceChanged) {
      realtimeService.onCoursePriceChanged((data) => {
        options.onCoursePriceChanged!(data);
        if (showToasts && data.newPrice < data.oldPrice) {
          toast.success('Price drop!', {
            description: `Now ${data.newPrice}`,
          });
        }
      });
    }

    return () => {
      realtimeService.off('course:created');
      realtimeService.off('course:updated');
      realtimeService.off('course:deleted');
      realtimeService.off('course:price_changed');
    };
  }, [options, showToasts]);

  // Setup video event listeners
  useEffect(() => {
    if (options.onVideoUploaded) {
      realtimeService.onVideoUploaded((video) => {
        options.onVideoUploaded!(video);
        if (showToasts) {
          toast.info('New video available!', {
            description: video.title,
          });
        }
      });
    }

    if (options.onVideoUpdated) {
      realtimeService.onVideoUpdated(options.onVideoUpdated);
    }

    if (options.onVideoDeleted) {
      realtimeService.onVideoDeleted(options.onVideoDeleted);
    }

    return () => {
      realtimeService.off('video:uploaded');
      realtimeService.off('video:updated');
      realtimeService.off('video:deleted');
    };
  }, [options, showToasts]);

  // Setup purchase event listeners
  useEffect(() => {
    if (options.onPurchaseSuccess) {
      realtimeService.onPurchaseSuccess((purchase) => {
        options.onPurchaseSuccess!(purchase);
        if (showToasts) {
          toast.success('Purchase successful!', {
            description: 'You now have access to the course',
            action: {
              label: 'Start Learning',
              onClick: () => window.location.href = `/courses/${purchase.courseId}`,
            },
          });
        }
      });
    }

    if (options.onAccessGranted) {
      realtimeService.onAccessGranted((data) => {
        options.onAccessGranted!(data);
        if (showToasts) {
          toast.success('Access granted!', {
            description: data.message,
          });
        }
      });
    }

    if (options.onPurchaseRefunded) {
      realtimeService.onPurchaseRefunded((data) => {
        options.onPurchaseRefunded!(data);
        if (showToasts) {
          toast.warning('Purchase refunded', {
            description: `Amount: ${data.amount}`,
          });
        }
      });
    }

    return () => {
      realtimeService.off('purchase:success');
      realtimeService.off('access:granted');
      realtimeService.off('purchase:refunded');
    };
  }, [options, showToasts]);

  // Setup progress sync listener
  useEffect(() => {
    if (options.onProgressUpdated) {
      realtimeService.onProgressUpdated(options.onProgressUpdated);
    }

    return () => {
      realtimeService.off('progress:updated');
    };
  }, [options]);

  // Setup notification listener
  useEffect(() => {
    if (options.onNotification) {
      realtimeService.onNotification((notification) => {
        options.onNotification!(notification);
        if (showToasts) {
          const toastType = notification.type || 'info';
          toast[toastType](notification.title, {
            description: notification.message,
            action: notification.action ? {
              label: notification.action.label,
              onClick: () => window.location.href = notification.action.url,
            } : undefined,
          });
        }
      });
    }

    return () => {
      realtimeService.off('notification');
    };
  }, [options, showToasts]);

  // Setup announcement listener
  useEffect(() => {
    if (options.onAnnouncementNew) {
      realtimeService.onAnnouncementNew((announcement) => {
        options.onAnnouncementNew!(announcement);
        if (showToasts) {
          toast.info(announcement.title, {
            description: announcement.message,
            duration: 10000,
          });
        }
      });
    }

    return () => {
      realtimeService.off('announcement:new');
    };
  }, [options, showToasts]);

  // Return utility functions
  const updateProgress = useCallback((progressData: any) => {
    realtimeService.emitProgressUpdate(progressData);
  }, []);

  const sendChatMessage = useCallback((message: any) => {
    realtimeService.sendChatMessage(message);
  }, []);

  return {
    connected: realtimeService.connected,
    updateProgress,
    sendChatMessage,
    realtimeService,
  };
}

/**
 * Hook specifically for course real-time updates
 */
export function useCoursesRealtime(
  onUpdate: (courses: any[]) => void,
  currentCourses: any[]
) {
  return useRealtime({
    onCourseCreated: (course) => {
      onUpdate([course, ...currentCourses]);
    },
    onCourseUpdated: (updatedCourse) => {
      onUpdate(
        currentCourses.map((c) =>
          c.id === updatedCourse.id ? updatedCourse : c
        )
      );
    },
    onCourseDeleted: ({ courseId }) => {
      onUpdate(currentCourses.filter((c) => c.id !== courseId));
    },
    onCoursePriceChanged: (data) => {
      onUpdate(
        currentCourses.map((c) =>
          c.id === data.courseId
            ? { ...c, price: data.newPrice, isFree: data.isFree }
            : c
        )
      );
    },
  });
}

/**
 * Hook for admin dashboard real-time stats
 */
export function useAdminStatsRealtime(onStatsUpdate: (stats: any) => void) {
  useEffect(() => {
    realtimeService.onStatsUpdated(onStatsUpdate);
    realtimeService.requestStats(); // Request initial stats

    // Request stats every 10 seconds
    const interval = setInterval(() => {
      realtimeService.requestStats();
    }, 10000);

    return () => {
      clearInterval(interval);
      realtimeService.off('stats:updated');
    };
  }, [onStatsUpdate]);
}

/**
 * Hook for notifications
 */
export function useNotifications() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;

    const handleNotification = (notification: any) => {
      // Show toast notification
      const toastType = notification.type || 'info';
      toast[toastType](notification.title, {
        description: notification.message,
        action: notification.action ? {
          label: notification.action.label,
          onClick: () => window.location.href = notification.action.url,
        } : undefined,
      });

      // Play notification sound (optional)
      playNotificationSound();

      // Show browser notification (if permission granted)
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icon.png',
        });
      }
    };

    realtimeService.onNotification(handleNotification);

    return () => {
      realtimeService.off('notification');
    };
  }, [user]);
}

/**
 * Play notification sound
 */
function playNotificationSound() {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Ignore if audio play fails (browser restrictions)
    });
  } catch (error) {
    // Ignore audio errors
  }
}
