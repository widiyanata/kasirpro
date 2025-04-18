import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { openDB, type DBSchema } from 'idb';

// Define user interface
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isPro: boolean;
}

// Define user database schema
interface UserDB extends DBSchema {
  users: {
    key: string;
    value: User;
  };
}

// Database version and name
const USER_DB_VERSION = 1;
const USER_DB_NAME = 'kasir-kilat-user-db';

// Initialize user database
export const initUserDB = async () => {
  const db = await openDB<UserDB>(USER_DB_NAME, USER_DB_VERSION, {
    upgrade(db) {
      // Create users store
      db.createObjectStore('users', {
        keyPath: 'uid',
      });
    },
  });

  return db;
};

// Get user database instance
let userDbPromise: Promise<any> | null = null;

export const getUserDB = () => {
  if (!userDbPromise) {
    userDbPromise = initUserDB();
  }
  return userDbPromise;
};

// Convert Firebase user to app user
const convertFirebaseUserToUser = (firebaseUser: FirebaseUser, isPro = false): User => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    isPro
  };
};

// Authentication service
export const authService = {
  // Register with email and password (free version)
  async registerWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = convertFirebaseUserToUser(userCredential.user, false);
      
      // Save user to IndexedDB
      const db = await getUserDB();
      await db.put('users', user);
      
      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login with email and password (free version)
  async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user from IndexedDB or create new one
      const db = await getUserDB();
      let user = await db.get('users', userCredential.user.uid);
      
      if (!user) {
        user = convertFirebaseUserToUser(userCredential.user, false);
        await db.put('users', user);
      }
      
      return user;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },

  // Login with Google (pro version)
  async loginWithGoogle(): Promise<User> {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      // Get user from IndexedDB or create new one
      const db = await getUserDB();
      let user = await db.get('users', userCredential.user.uid);
      
      if (!user) {
        user = convertFirebaseUserToUser(userCredential.user, true);
        await db.put('users', user);
      }
      
      return user;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        unsubscribe();
        
        if (firebaseUser) {
          // Get user from IndexedDB
          const db = await getUserDB();
          let user = await db.get('users', firebaseUser.uid);
          
          if (!user) {
            user = convertFirebaseUserToUser(firebaseUser, false);
            await db.put('users', user);
          }
          
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  },

  // Update user pro status
  async updateUserProStatus(uid: string, isPro: boolean): Promise<User> {
    try {
      const db = await getUserDB();
      const user = await db.get('users', uid);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const updatedUser = { ...user, isPro };
      await db.put('users', updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user pro status:', error);
      throw error;
    }
  }
};
