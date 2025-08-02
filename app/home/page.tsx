import { Sword, Scroll, Package, Sparkles, Users, Palette, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 dark:from-amber-950/20 dark:via-stone-950/20 dark:to-emerald-950/20">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Sword className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">RPG Shop Creator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/auth">
                <Button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">Create Epic Fantasy Shop Menus</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Design beautiful, immersive shop inventories for your tabletop RPG campaigns. From mystical potions to
            legendary weapons, bring your fantasy world to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-lg px-8 py-3"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Creating
              </Button>
            </Link>
            <Link href="/creator">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 bg-transparent dark:bg-transparent dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
            Everything You Need for Fantasy Commerce
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow dark:bg-gray-800/50">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="dark:text-gray-100">Item Categories</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Organize your inventory with weapons, armor, potions, gear, and scrolls
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-shadow dark:bg-gray-800/50">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="dark:text-gray-100">Fantasy Themes</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Choose from parchment, tavern, arcane, forest, and dungeon themes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow dark:bg-gray-800/50">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="dark:text-gray-100">Live Preview</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  See your shop menu update in real-time as you add and edit items
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow dark:bg-gray-800/50">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="dark:text-gray-100">Campaign Ready</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Perfect for D&D, Pathfinder, and other tabletop RPG sessions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow dark:bg-gray-800/50">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="dark:text-gray-100">Export & Share</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Save your creations and share them with your gaming group
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-stone-200 dark:border-stone-800 hover:shadow-lg transition-shadow dark:bg-gray-800/50">
              <CardHeader>
                <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Scroll className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                </div>
                <CardTitle className="dark:text-gray-100">Easy to Use</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Intuitive interface that gets you creating beautiful shops in minutes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">How It Works</h3>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-600 dark:bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Set Up Your Shop</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter your shop name and owner details. Choose from our collection of fantasy themes to match your
                  campaign's aesthetic.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-600 dark:bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Add Your Inventory</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Create items with names, categories, and prices in GP, SP, or CP. Our intuitive table makes it easy to
                  manage your entire inventory.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-600 dark:bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Preview & Perfect</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Watch your shop come to life with our real-time preview. Items are automatically organized by category
                  with beautiful icons.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-600 dark:bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Share with Your Party</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Export your finished shop menu and share it with your players. Perfect for both digital and print
                  campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-700 dark:to-orange-700">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Create Your First Shop?</h3>
          <p className="text-xl text-amber-100 dark:text-amber-200 mb-8">
            Join thousands of DMs who are already creating immersive shopping experiences for their players.
          </p>
          <Link href="/auth">
            <Button
              size="lg"
              className="bg-white text-amber-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-amber-700 dark:hover:bg-gray-200 text-lg px-8 py-3"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sword className="h-6 w-6 text-amber-400" />
              <span className="text-xl font-bold">RPG Shop Creator</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 RPG Shop Creator. Built for the tabletop gaming community.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
