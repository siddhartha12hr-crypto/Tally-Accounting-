export interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  email:    string | null;
  phone:    string | null;
  avatar:   string | null;
  name:              string;
  purchasedCourses:  string[];
  purchasedVideos:   string[];
  status?:    'active' | 'blocked';
  lastLogin?: string | null;
  createdAt?: string;
}

export interface SignupData {
  fullName:  string;
  username:  string;
  email?:    string;
  phone?:    string;
  password:  string;
}

export interface AdminUser {
  id:               string;
  fullName:         string;
  username:         string;
  email:            string | null;
  phone:            string | null;
  avatar:           string | null;
  password:         string;
  purchasedCourses: string[];
  purchasedVideos:  string[];
  courseBlocks:     string[];
  status:           'active' | 'blocked';
  lastLogin:        string | null;
  blockedAt:        string | null;
  createdAt:        string;
}

export interface PurchaseCode {
  code:        string;
  userId:      string;
  courseIds:   string[];
  durationDays: number;   // 7, 30, 60, 90, 365, or -1 for lifetime
  createdAt:   string;     // ISO date
  expiresAt:   string | null; // ISO date or null for lifetime
  status:      'active' | 'expired' | 'revoked';
  revokedAt:   string | null;
  redeemed:     boolean;      // has the user redeemed this code?
  redeemedAt:   string | null;
}

export interface AuthContextType {
  user:            AuthUser | null;
  token:           string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  signup:          (data: SignupData) => Promise<{ success: boolean; message: string }>;
  login:           (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout:          () => void;
  updateProfile:   (updates: Partial<Pick<AuthUser, 'fullName' | 'avatar'>>) => void;
  changePassword:  (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  hasPurchased:    (contentId: string, type: 'course' | 'video') => boolean;
  purchaseContent: (contentId: string, type: 'course' | 'video') => void;
  // Admin user management
  getAllUsers:        () => AdminUser[];
  blockUser:          (userId: string) => void;
  unblockUser:        (userId: string) => void;
  deleteUser:         (userId: string) => void;
  grantCourseAccess:  (userId: string, courseId: string) => void;
  revokeCourseAccess: (userId: string, courseId: string) => void;
  // Purchase code management
  generatePurchaseCode: (userId: string, courseIds: string[], durationDays: number) => PurchaseCode;
  redeemPurchaseCode:     (code: string) => Promise<{ success: boolean; message: string }>;
  revokePurchaseCode:    (code: string) => void;
  getPurchaseCodes:      (userId?: string) => PurchaseCode[];
  // Course-specific block
  blockCourseForUser:    (userId: string, courseId: string) => void;
  unblockCourseForUser:  (userId: string, courseId: string) => void;
}
