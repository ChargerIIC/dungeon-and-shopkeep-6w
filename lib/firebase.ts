import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Validate environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if all required environment variables are present and valid
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value || value.trim() === "")
  .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase().replace(/([A-Z])/g, "_$1")}`)

const isFirebaseConfigured = () => {
  return (
    missingVars.length === 0 &&
    requiredEnvVars.apiKey &&
    requiredEnvVars.projectId &&
    requiredEnvVars.apiKey !== "your-api-key-here" &&
    requiredEnvVars.projectId !== "your-project-id"
  )
}

if (missingVars.length > 0) {
  console.warn("Missing or invalid Firebase environment variables:", missingVars.join(", "))
  console.warn("Please check your .env.local file and ensure all Firebase environment variables are properly set.")
}

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey,
  authDomain: requiredEnvVars.authDomain,
  projectId: requiredEnvVars.projectId,
  storageBucket: requiredEnvVars.storageBucket,
  messagingSenderId: requiredEnvVars.messagingSenderId,
  appId: requiredEnvVars.appId,
}

// Initialize Firebase only if we have valid configuration
let app: any = null
let auth: any = null
let db: any = null
let googleProvider: GoogleAuthProvider | null = null

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({
      prompt: "select_account",
    })
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
}

// Export auth and db (they might be null if config is missing)
export { auth, db }

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not properly configured. Please check your environment variables.")
  }

  if (!auth || !googleProvider) {
    throw new Error("Firebase authentication is not initialized.")
  }

  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error: any) {
    console.error("Error signing in with Google:", error)

    // Provide more helpful error messages
    if (error.code === "auth/api-key-not-valid") {
      throw new Error(
        "Firebase API key is invalid. Please check your NEXT_PUBLIC_FIREBASE_API_KEY environment variable.",
      )
    } else if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled. Please try again.")
    } else if (error.code === "auth/popup-blocked") {
      throw new Error("Pop-up was blocked by your browser. Please allow pop-ups and try again.")
    } else if (error.code === "auth/unauthorized-domain") {
      throw new Error("This domain is not authorized for OAuth operations. Please check your Firebase configuration.")
    }

    throw new Error(error.message || "Failed to sign in with Google. Please try again.")
  }
}

// Sign out
export const signOutUser = async () => {
  if (!auth) {
    throw new Error("Firebase is not properly configured.")
  }

  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.warn("Firebase auth is not initialized. User will remain null.")
    callback(null)
    return () => {} // Return empty unsubscribe function
  }

  return onAuthStateChanged(auth, callback)
}

// Helper function to check if Firebase is configured
export { isFirebaseConfigured }
