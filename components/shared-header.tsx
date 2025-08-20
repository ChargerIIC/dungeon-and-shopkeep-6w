"use client"

import { Dice6, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOutUser } from "@/lib/firebase"
import { useAuth } from "./auth-provider"

export function SharedHeader() {
  const { user, loading, isConfigured } = useAuth()
  const router = useRouter()

  const displayName = user?.displayName || user?.email || "User"

  const handleSignOut = async () => {
    try {
      await signOutUser()
      router.push("/home")
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50 card-3d">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Dice6 className="h-8 w-8 text-primary" />
            <Link href="/home">
              <h1 className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer font-fantasy">
                House of Burt's Tabletop Toolkit
              </h1>
            </Link>
          </div>
          {!loading && isConfigured && !user ? (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/auth">
                <Button className="button-3d text-primary-foreground">Get Started</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg card-3d">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL || "/placeholder.svg"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full shadow-sm"
                  />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
                <span className="text-sm text-foreground font-medium">{displayName}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2 button-3d text-primary-foreground bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
