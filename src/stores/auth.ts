import { ref, computed } from 'vue';
import { authService, type User } from '../services/auth';

// Create reactive state
const user = ref<User | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Initialize auth state
export const initAuth = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    user.value = await authService.getCurrentUser();
  } catch (err) {
    error.value = 'Failed to initialize authentication';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Auth store
export const useAuth = () => {
  // Computed properties
  const isAuthenticated = computed(() => !!user.value);
  const isPro = computed(() => user.value?.isPro || false);
  
  // Register with email and password
  const register = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      user.value = await authService.registerWithEmail(email, password);
      return user.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to register';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // Login with email and password
  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      user.value = await authService.loginWithEmail(email, password);
      return user.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to login';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // Login with Google
  const loginWithGoogle = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      user.value = await authService.loginWithGoogle();
      return user.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to login with Google';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // Logout
  const logout = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      await authService.logout();
      user.value = null;
    } catch (err: any) {
      error.value = err.message || 'Failed to logout';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // Update pro status
  const updateProStatus = async (isPro: boolean) => {
    if (!user.value) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      user.value = await authService.updateUserProStatus(user.value.uid, isPro);
      return user.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to update pro status';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    user,
    loading,
    error,
    isAuthenticated,
    isPro,
    register,
    login,
    loginWithGoogle,
    logout,
    updateProStatus
  };
};
