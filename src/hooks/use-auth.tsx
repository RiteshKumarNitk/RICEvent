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
import { doc, setDoc, getDoc } from "firebase/firestore"; 

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
                createdAt: new Date(),
            });
        } catch (error) {
            console.error("Error creating user profile in Firestore:", error);
            // This might happen due to Firestore rules.
            // We can re-throw or handle it gracefully.
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signup = async (email: string, pass: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    if (user) {
        // Update the user's profile with the full name
        await updateProfile(user, { displayName: fullName });
        // Create the user document in Firestore
        // The onAuthStateChanged listener will handle setting the user state
        // so no manual re-login is needed.
        await createUserProfile(user, { displayName: fullName });
    }
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
        await createUserProfile(result.user);
    }
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
