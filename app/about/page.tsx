"use client"
import { Dice6, Users, Sparkles, Code, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { SharedHeader } from "@/components/shared-header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 paper-texture">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6 font-fantasy">About Tabletop Toolkit</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A passion project built by tabletop enthusiasts, for tabletop enthusiasts. Our mission is to provide Game
            Masters with powerful, easy-to-use tools that enhance the gaming experience.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8 font-fantasy">Our Mission</h2>
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="text-center mb-6">
              We believe that great tabletop gaming experiences shouldn't be hindered by tedious preparation work.
              That's why we've created a suite of tools designed to streamline the creative process, allowing Game
              Masters to focus on what they do best: crafting memorable adventures and bringing worlds to life.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 paper-texture">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12 font-fantasy">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Dice6 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">Shop Creator</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Generate detailed fantasy shops with inventories, pricing, and shopkeeper personalities in seconds.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">NPC Cards</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Create professional-looking NPC cards with stats, abilities, and backstories for your campaigns.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">More Coming Soon</CardTitle>
                <CardDescription className="text-muted-foreground">
                  We're constantly working on new tools including campaign managers, world builders, and encounter
                  generators.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8 font-fantasy">Built with Modern Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-3d paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4 card-3d mx-auto">
                  <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">Open Source</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Built with Next.js, React, and TypeScript. We believe in transparency and community-driven
                  development.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-3d paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mb-4 card-3d mx-auto">
                  <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">Community Focused</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Every feature is designed based on feedback from real Game Masters and their actual gaming needs.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 leather-binding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6 font-fantasy">Ready to Enhance Your Games?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join our growing community of Game Masters who are creating better gaming experiences with our tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-card text-foreground hover:bg-card/90 text-lg px-8 py-3 card-3d">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 card-3d text-primary-foreground border-primary-foreground/50 bg-transparent hover:bg-primary-foreground/10"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 text-foreground py-12 px-4 sm:px-6 lg:px-8 wood-grain">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Dice6 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-fantasy">Tabletop Toolkit</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2025 House Of Burt. Built for the tabletop gaming community.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
