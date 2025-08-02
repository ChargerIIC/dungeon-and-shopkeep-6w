import { Sword, Scroll, Package, Sparkles, Users, Palette, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50 card-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Sword className="h-8 w-8 text-primary" />
              <Link href="/home">
                <h1 className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer font-fantasy">
                  Dungeon and Shopkeeps
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/auth">
                <Button className="button-3d text-primary-foreground">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 paper-texture">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6 font-fantasy">Create Epic Fantasy Shop Menus</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Design beautiful, immersive shop inventories for your tabletop RPG campaigns. From mystical potions to
            legendary weapons, bring your fantasy world to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="button-3d text-primary-foreground text-lg px-8 py-3">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Creating
              </Button>
            </Link>
            <Link href="/creator">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 card-3d text-foreground border-border/50 bg-transparent"
              >
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12 font-fantasy">
            Everything You Need for Fantasy Commerce
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">Item Categories</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Organize your inventory with weapons, armor, potions, gear, and scrolls
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Palette className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">Fantasy Themes</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Choose from parchment, tavern, arcane, forest, and dungeon themes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">Live Preview</CardTitle>
                <CardDescription className="text-muted-foreground">
                  See your shop menu update in real-time as you add and edit items
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">Campaign Ready</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Perfect for D&D, Pathfinder, and other tabletop RPG sessions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Download className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">Export & Share</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Save your creations and share them with your gaming group
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Scroll className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">Easy to Use</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Intuitive interface that gets you creating beautiful shops in minutes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 paper-texture">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12 font-fantasy">How It Works</h3>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold leather-binding">
                1
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2 font-fantasy">Set Up Your Shop</h4>
                <p className="text-muted-foreground">
                  Enter your shop name and owner details. Choose from our collection of fantasy themes to match your
                  campaign's aesthetic.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold leather-binding">
                2
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2 font-fantasy">Add Your Inventory</h4>
                <p className="text-muted-foreground">
                  Create items with names, categories, and prices in GP, SP, or CP. Our intuitive table makes it easy to
                  manage your entire inventory.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold leather-binding">
                3
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2 font-fantasy">Preview & Perfect</h4>
                <p className="text-muted-foreground">
                  Watch your shop come to life with our real-time preview. Items are automatically organized by category
                  with beautiful icons.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold leather-binding">
                4
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2 font-fantasy">Share with Your Party</h4>
                <p className="text-muted-foreground">
                  Export your finished shop menu and share it with your players. Perfect for both digital and print
                  campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 leather-binding">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-primary-foreground mb-6 font-fantasy">
            Ready to Create Your First Shop?
          </h3>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of DMs who are already creating immersive shopping experiences for their players.
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-card text-foreground hover:bg-card/90 text-lg px-8 py-3 card-3d">
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 text-foreground py-12 px-4 sm:px-6 lg:px-8 wood-grain">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sword className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-fantasy">Dungeon and Shopkeeps</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2024 Dungeon and Shopkeeps. Built for the tabletop gaming community.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
