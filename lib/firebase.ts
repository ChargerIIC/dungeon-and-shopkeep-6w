import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth"
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore"

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
console.log(missingVars);
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

// Shop data types
export interface ShopItem {
  id: string
  name: string
  category: string
  price: number
  currency: string
}

export interface Shop {
  id?: string
  title: string
  owner: string
  items: ShopItem[]
  theme: string
  creatorId: string
  createdAt: Date
  updatedAt: Date
}

// Save shop to Firestore
export const saveShop = async (shop: Omit<Shop, "id" | "createdAt" | "updatedAt">) => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const shopData = {
      ...shop,
      creatorId: auth.currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await addDoc(collection(db, "shops"), shopData)
    return docRef.id
  } catch (error) {
    console.error("Error saving shop:", error)
    throw new Error("Failed to save shop. Please try again.")
  }
}

// Update existing shop
export const updateShop = async (shopId: string, shop: Omit<Shop, "id" | "creatorId" | "createdAt" | "updatedAt">) => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const shopData = {
      ...shop,
      updatedAt: new Date(),
    }

    const shopRef = doc(db, "shops", shopId)
    await updateDoc(shopRef, shopData)
  } catch (error) {
    console.error("Error updating shop:", error)
    throw new Error("Failed to update shop. Please try again.")
  }
}

// Get user's shops
export const getUserShops = async (): Promise<Shop[]> => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const shopsQuery = query(
      collection(db, "shops"),
      where("creatorId", "==", auth.currentUser.uid),
      orderBy("updatedAt", "desc"),
    )

    const querySnapshot = await getDocs(shopsQuery)
    const shops: Shop[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      shops.push({
        id: doc.id,
        title: data.title,
        owner: data.owner,
        items: data.items,
        theme: data.theme,
        creatorId: data.creatorId,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      })
    })

    return shops
  } catch (error) {
    console.error("Error getting user shops:", error)
    throw new Error("Failed to load shops. Please try again.")
  }
}

// Delete shop
export const deleteShop = async (shopId: string) => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const shopRef = doc(db, "shops", shopId)
    await deleteDoc(shopRef)
  } catch (error) {
    console.error("Error deleting shop:", error)
    throw new Error("Failed to delete shop. Please try again.")
  }
}
