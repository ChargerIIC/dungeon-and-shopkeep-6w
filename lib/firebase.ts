import { initializeApp } from "firebase/app"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  const requiredEnvVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn("Missing Firebase environment variables:", missingVars)
    return false
  }

  return true
}

let app
let auth
let googleProvider

// Only initialize Firebase if properly configured
if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error("Firebase is not properly configured")
  }

  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error("Google sign in error:", error)
    throw error
  }
}

export const signOutUser = async () => {
  if (!auth) {
    throw new Error("Firebase is not properly configured")
  }

  try {
    await signOut(auth)
  } catch (error) {
    console.error("Sign out error:", error)
    throw error
  }
}

export { auth }
