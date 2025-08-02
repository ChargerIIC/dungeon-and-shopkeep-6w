"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth, isFirebaseConfigured } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConfigured: false,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const configured = isFirebaseConfigured()

  useEffect(() => {
    if (!configured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [configured])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: configured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
