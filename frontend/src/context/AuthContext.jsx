import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser } from '../firebase/firebase';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName, photo: firebaseUser.photoURL });
        } catch {
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const result = await signInWithGoogle();
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      // Verify token with backend
      await api.post('/auth/google');
      toast.success(`Welcome, ${result.user.displayName?.split(' ')[0]}!`);
      return true;
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Sign-in failed. Please try again.');
        console.error('Login error:', error);
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
