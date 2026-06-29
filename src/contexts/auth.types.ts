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
}

export interface SignupData {
  fullName:  string;
  username:  string;
  email?:    string;
  phone?:    string;
  password:  string;
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
  hasPurchased:    (contentId: string, type: 'course' | 'video') => boolean;
  purchaseContent: (contentId: string, type: 'course' | 'video') => void;
}
