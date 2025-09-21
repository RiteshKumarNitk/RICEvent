"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User, 
  UserCredential,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"; 

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string, fullName: string) => Promise<any>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create a user profile in Firestore
const createUserProfile = async (user: User, additionalData: { displayName?: string } = {}) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        const { uid, email, photoURL } = user;
        const displayName = additionalData.displayName || user.displayName || "Anonymous User";
        try {
            await setDoc(userRef, {
                uid,
                email,
                displayName,
                photoURL,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error creating user profile in Firestore:", error);
            throw error;
        }
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // When a user logs in or signs up, ensure their profile exists.
        createUserProfile(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signup = async (email: string, pass: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    // After creating the user, update their profile with the full name.
    // The onAuthStateChanged listener will handle the rest (setting user state, creating firestore doc).
    await updateProfile(userCredential.user, { displayName: fullName });
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    // The onAuthStateChanged listener will handle creating the user profile.
    return result;
  };


  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
