"use client"

import { useState, useEffect } from "react"
import { Dice6, Package, Shield, BookOpen, MapPin, Scroll, LogOut, User, Sparkles, ArrowRight, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import { signOutUser } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading, isConfigured } = useAuth()
  const router = useRouter()

  // Redirect to auth if not signed in
  useEffect(() => {
    if (!loading && (!isConfigured || !user)) {
      router.push("/auth")
    }
  }, [user, loading, isConfigured, router])

  const handleSignOut = async () => {
    try {
      await signOutUser()
      router.push("/home")
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  const applications = [
    {
      id: "shopkeeper",
      title: "Dungeon & Shopkeeps",
      description: "Create and manage fantasy shop inventories with beautiful themes",
      icon: Package,
      color: "amber",
      link: "/shopkeeper",
      status: "available",
      lastUsed: "2 days ago",
      features: ["5 Fantasy Themes", "Save & Load Shops", "Print Ready"]
    },
    {
      id: "character-builder",
      title: "Character Forge",
      description: "Build detailed character sheets for multiple RPG systems",
      icon: Shield,
      color: "emerald",
      link: "#",
      status: "coming-soon",
      features: ["Multiple Systems", "Stat Tracking", "Equipment Manager"]
    },
    {
      id: "campaign-manager",
      title: "Campaign Chronicles",
      description: "Organize campaigns, track sessions, and manage players",
      icon: BookOpen,
      color: "purple",
      link: "#",
      status: "coming-soon",
      features: ["Session Notes", "Player Tracking", "Story Arcs"]
    },
    {
      id: "map-maker",
      title: "Realm Mapper",
      description: "Design interactive maps for your fantasy worlds",
      icon: MapPin,
      color: "blue",
      link: "#",
      status: "coming-soon",
      features: ["Interactive Maps", "Custom Markers", "Layer System"]
    },
    {
      id: "dice-roller",
      title: "Dice Sanctum",
      description: "Advanced dice rolling with custom formulas",
      icon: Dice6,
      color: "red",
      link: "#",
      status: "beta",
      features: ["Custom Formulas", "Roll History", "Probability Stats"]
    },
    {
      id: "lore-keeper",
      title: "Lore Keeper",
      description: "Document your world's history, NPCs, and locations",
      icon: Scroll,
      color: "stone",
      link: "#",
      status: "coming-soon",
      features: ["World Building", "NPC Database", "Timeline Tracking"]
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      amber: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
      emerald: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
      purple: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
      blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
      red: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
      stone: "bg-stone-100 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400"
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.amber
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <div className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full font-medium">Available</div>
      case "beta":
        return <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium">Beta</div>
      case "coming-soon":
        return <div className="bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full font-medium">Coming Soon</div>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isConfigured || !user) {
    return null // Will redirect via useEffect
  }

  const displayName = user?.displayName || user?.email || "User"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50 card-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Dice6 className="h-8 w-8 text-primary" />
              <Link href="/dashboard">
                <h1 className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer font-fantasy">
                  Tabletop Toolkit
                </h1>
              </Link>
            </div>
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
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 paper-texture">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-fantasy">
              Welcome back, {displayName.split(' ')[0]}!
            </h2>
            <p className="text-xl text-muted-foreground">
              Ready to enhance your tabletop gaming experience? Choose from your available tools below.
            </p>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => {
              const IconComponent = app.icon
              const isAvailable = app.status === "available" || app.status === "beta"
              
              return (
                <Card key={app.id} className="card-3d hover:shadow-lg transition-all duration-300 paper-texture relative">
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(app.status)}
                  </div>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 card-3d ${getColorClasses(app.color)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-foreground font-fantasy pr-20">{app.title}</CardTitle>
                    <CardDescription className="text-muted-foreground mb-4">
                      {app.description}
                    </CardDescription>
                    
                    {app.lastUsed && (
                      <div className="flex items-center text-xs text-muted-foreground mb-3">
                        <Clock className="w-3 h-3 mr-1" />
                        Last used {app.lastUsed}
                      </div>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      {app.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {isAvailable ? (
                      <Link href={app.link} className="block">
                        <Button className="w-full button-3d text-primary-foreground group">
                          Launch Application
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full" variant="outline">
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-foreground mb-6 font-fantasy">
            Need Help Getting Started?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-3d paper-texture">
              <CardHeader>
                <CardTitle className="text-foreground font-fantasy">New to Tabletop Gaming?</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Check out our beginner's guide to get started with your first campaign.
                </CardDescription>
                <Button variant="outline" className="mt-4 card-3d">
                  View Guide
                </Button>
              </CardHeader>
            </Card>
            <Card className="card-3d paper-texture">
              <CardHeader>
                <CardTitle className="text-foreground font-fantasy">Join Our Community</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Connect with other Game Masters and share your creations.
                </CardDescription>
                <Button variant="outline" className="mt-4 card-3d">
                  Join Discord
                </Button>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
