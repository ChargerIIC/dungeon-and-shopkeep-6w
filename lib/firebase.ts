import { initializeApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
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
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { Encounter, MapAttachment } from './encounters.model'

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

// Only log missing variables in development
if (missingVars.length > 0 && process.env.NODE_ENV === "development") {
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
let storage: any = null // Added storage initialization
let googleProvider: GoogleAuthProvider | null = null
let facebookProvider: FacebookAuthProvider | null = null

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app) // Initialize Firebase Storage
    googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({
      prompt: "select_account",
    })
    facebookProvider = new FacebookAuthProvider()
    facebookProvider.setCustomParameters({
      display: "popup",
    })
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
}

// Export auth, db, and storage
export { auth, db, storage } // Added storage to exports

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

// Sign in with Facebook
export const signInWithFacebook = async () => {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not properly configured. Please check your environment variables.")
  }

  if (!auth || !facebookProvider) {
    throw new Error("Firebase authentication is not initialized.")
  }

  try {
    const result = await signInWithPopup(auth, facebookProvider)
    return result.user
  } catch (error: any) {
    console.error("Error signing in with Facebook:", error)

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
    } else if (error.code === "auth/account-exists-with-different-credential") {
      throw new Error("An account already exists with the same email address but different sign-in credentials.")
    }

    throw new Error(error.message || "Failed to sign in with Facebook. Please try again.")
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

// NPC data types
export interface NPCInventoryItem {
  id: string
  name: string
  description: string
}

export interface NPCStats {
  STR: number
  DEX: number
  CON: number
  INT: number
  WIS: number
  CHA: number
  armorClass: number
  hitPoints: number
  speed: number
  proficiencyBonus: number
}

export interface NPC {
  id?: string
  name: string
  profession: string
  description: string
  vocalNotes: string
  inventory: NPCInventoryItem[]
  stats: NPCStats
  theme: string
  creatorId: string
  createdAt: Date
  updatedAt: Date
}

// Save NPC to Firestore
export const saveNPC = async (npc: Omit<NPC, "id" | "createdAt" | "updatedAt">) => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const npcData = {
      ...npc,
      creatorId: auth.currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await addDoc(collection(db, "npcs"), npcData)
    return docRef.id
  } catch (error) {
    console.error("Error saving NPC:", error)
    throw new Error("Failed to save NPC. Please try again.")
  }
}

// Update existing NPC
export const updateNPC = async (npcId: string, npc: Omit<NPC, "id" | "creatorId" | "createdAt" | "updatedAt">) => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const npcData = {
      ...npc,
      updatedAt: new Date(),
    }

    const npcRef = doc(db, "npcs", npcId)
    await updateDoc(npcRef, npcData)
  } catch (error) {
    console.error("Error updating NPC:", error)
    throw new Error("Failed to update NPC. Please try again.")
  }
}

// Get user's NPCs
export const getUserNPCs = async (): Promise<NPC[]> => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const npcsQuery = query(
      collection(db, "npcs"),
      where("creatorId", "==", auth.currentUser.uid),
      orderBy("updatedAt", "desc"),
    )

    const querySnapshot = await getDocs(npcsQuery)
    const npcs: NPC[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      npcs.push({
        id: doc.id,
        name: data.name,
        profession: data.profession,
        description: data.description,
        vocalNotes: data.vocalNotes,
        inventory: data.inventory,
        stats: data.stats,
        theme: data.theme,
        creatorId: data.creatorId,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      })
    })

    return npcs
  } catch (error) {
    console.error("Error getting user NPCs:", error)
    throw new Error("Failed to load NPCs. Please try again.")
  }
}

// Delete NPC
export const deleteNPC = async (npcId: string) => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const npcRef = doc(db, "npcs", npcId)
    await deleteDoc(npcRef)
  } catch (error) {
    console.error("Error deleting NPC:", error)
    throw new Error("Failed to delete NPC. Please try again.")
  }
}

// Save encounter to Firestore
export const saveEncounter = async (encounter: Omit<Encounter, "id" | "createdAt" | "updatedAt">) => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const encounterData = {
      ...encounter,
      creatorId: auth.currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await addDoc(collection(db, "encounters"), encounterData)
    return docRef.id
  } catch (error) {
    console.error("Error saving encounter:", error)
    throw new Error("Failed to save encounter. Please try again.")
  }
}

// Update existing encounter
export const updateEncounter = async (
  encounterId: string,
  encounter: Omit<Encounter, "id" | "creatorId" | "createdAt" | "updatedAt">,
) => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const encounterData = {
      ...encounter,
      updatedAt: new Date(),
    }

    const encounterRef = doc(db, "encounters", encounterId)
    await updateDoc(encounterRef, encounterData)
  } catch (error) {
    console.error("Error updating encounter:", error)
    throw new Error("Failed to update encounter. Please try again.")
  }
}

// Get user's encounters
export const getUserEncounters = async (): Promise<Encounter[]> => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const encountersQuery = query(
      collection(db, "encounters"),
      where("creatorId", "==", auth.currentUser.uid),
      orderBy("updatedAt", "desc"),
    )

    const querySnapshot = await getDocs(encountersQuery)
    const encounters: Encounter[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      encounters.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        environment: data.environment,
        partyLevel: data.partyLevel,
        partySize: data.partySize,
        npcs: data.npcs,
        treasures: data.treasures,
        maps: data.maps,
        notes: data.notes,
        creatorId: data.creatorId,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      })
    })

    return encounters
  } catch (error) {
    console.error("Error getting user encounters:", error)
    throw new Error("Failed to load encounters. Please try again.")
  }
}

// Delete encounter
export const deleteEncounter = async (encounterId: string) => {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase is not configured or user is not authenticated.")
  }

  try {
    const encounterRef = doc(db, "encounters", encounterId)
    const encounterDoc = await getDocs(query(collection(db, "encounters"), where("__name__", "==", encounterId)))

    // Delete associated map files from storage
    if (!encounterDoc.empty) {
      const encounterData = encounterDoc.docs[0].data()
      if (encounterData.maps && encounterData.maps.length > 0) {
        const deletePromises = encounterData.maps.map((map: MapAttachment) =>
          deleteMapFile(map.url).catch((error) => console.warn("Failed to delete map file:", error)),
        )
        await Promise.all(deletePromises)
      }
    }

    await deleteDoc(encounterRef)
  } catch (error) {
    console.error("Error deleting encounter:", error)
    throw new Error("Failed to delete encounter. Please try again.")
  }
}

/**
 * Upload a map file to Firebase Storage
 */
export const uploadMapFile = async (file: File, encounterId: string): Promise<string> => {
  if (!storage || !auth?.currentUser) {
    throw new Error("Firebase Storage is not configured or user is not authenticated.")
  }

  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    // Create storage reference
    const storageRef = ref(storage, `encounters/${auth.currentUser.uid}/${encounterId}/maps/${fileName}`)

    // Upload file
    const snapshot = await uploadBytes(storageRef, file)

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    console.error("Error uploading map file:", error)
    throw new Error("Failed to upload map file. Please try again.")
  }
}

/**
 * Delete a map file from Firebase Storage
 */
export const deleteMapFile = async (fileUrl: string): Promise<void> => {
  if (!storage || !auth?.currentUser) {
    throw new Error("Firebase Storage is not configured or user is not authenticated.")
  }

  try {
    // Extract the file path from the URL
    const url = new URL(fileUrl)
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/)
    if (!pathMatch) {
      throw new Error("Invalid file URL")
    }

    const filePath = decodeURIComponent(pathMatch[1])
    const storageRef = ref(storage, filePath)

    await deleteObject(storageRef)
  } catch (error) {
    console.error("Error deleting map file:", error)
    // Don't throw error for file deletion failures to avoid blocking other operations
  }
}

/**
 * Upload multiple map files
 */
export const uploadMultipleMapFiles = async (
  files: File[],
  encounterId: string,
  onProgress?: (progress: number, fileName: string) => void,
): Promise<Array<{ name: string; url: string; id: string }>> => {
  if (!storage || !auth?.currentUser) {
    throw new Error("Firebase Storage is not configured or user is not authenticated.")
  }

  const uploadPromises = files.map(async (file, index) => {
    try {
      if (onProgress) {
        onProgress(0, file.name)
      }

      const url = await uploadMapFile(file, encounterId)

      if (onProgress) {
        onProgress(100, file.name)
      }

      return {
        id: `${Date.now()}_${index}`,
        name: file.name,
        url: url,
      }
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error)
      throw new Error(`Failed to upload ${file.name}`)
    }
  })

  try {
    const results = await Promise.all(uploadPromises)
    return results
  } catch (error) {
    console.error("Error uploading multiple files:", error)
    throw new Error("Some files failed to upload. Please try again.")
  }
}
