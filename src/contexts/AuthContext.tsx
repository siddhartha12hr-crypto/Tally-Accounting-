// Re-exports — all existing imports of "@/contexts/AuthContext" continue to work unchanged
export type { AuthUser, SignupData, AuthContextType } from './auth.types';
export { AuthProvider } from './AuthProvider';
export { useAuth } from './useAuth';
