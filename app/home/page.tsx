import { Sword, Scroll, Package, Sparkles, Users, Palette, Download, Dice6, MapPin, BookOpen, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function HomePage() {
  const applications = [
    {
      id: "shopkeeper",
      title: "Dungeon & Shopkeeps",
      description: "Create beautiful fantasy shop inventories with themed layouts and item management",
      icon: Package,
      color: "amber",
      demoLink: "/shopkeeper",
      features: ["5 Fantasy Themes", "Item Categories", "Print Ready"]
    },
    {
      id: "character-builder",
      title: "Character Forge",
      description: "Build and manage detailed character sheets for multiple RPG systems",
      icon: Shield,
      color: "emerald",
      demoLink: "#",
      features: ["Multiple Systems", "Stat Tracking", "Equipment Manager"],
      comingSoon: true
    },
    {
      id: "campaign-manager",
      title: "Campaign Chronicles",
      description: "Organize your campaigns, track sessions, and manage player information",
      icon: BookOpen,
      color: "purple",
      demoLink: "#",
      features: ["Session Notes", "Player Tracking", "Story Arcs"],
      comingSoon: true
    },
    {
      id: "map-maker",
      title: "Realm Mapper",
      description: "Design interactive maps for your fantasy worlds and adventures",
      icon: MapPin,
      color: "blue",
      demoLink: "#",
      features: ["Interactive Maps", "Custom Markers", "Layer System"],
      comingSoon: true
    },
    {
      id: "dice-roller",
      title: "Dice Sanctum",
      description: "Advanced dice rolling with custom formulas and probability analysis",
      icon: Dice6,
      color: "red",
      demoLink: "#",
      features: ["Custom Formulas", "Roll History", "Probability Stats"],
      comingSoon: true
    },
    {
      id: "lore-keeper",
      title: "Lore Keeper",
      description: "Document and organize your world's history, NPCs, and locations",
      icon: Scroll,
      color: "stone",
      demoLink: "#",
      features: ["World Building", "NPC Database", "Timeline Tracking"],
      comingSoon: true
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50 card-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Dice6 className="h-8 w-8 text-primary" />
              <Link href="/home">
                <h1 className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer font-fantasy">
                  Tabletop Toolkit
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
          <h2 className="text-5xl font-bold text-foreground mb-6 font-fantasy">Your Complete Tabletop Gaming Hub</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Everything you need to enhance your tabletop RPG experience. From shop creation to character management, 
            campaign organization to world building - all in one powerful toolkit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="button-3d text-primary-foreground text-lg px-8 py-3">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Journey
              </Button>
            </Link>
            <Link href="/shopkeeper">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 card-3d text-foreground border-border/50 bg-transparent"
              >
                Try Shop Creator Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-4 font-fantasy">
            Powerful Tools for Every Game Master
          </h3>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose from our growing collection of specialized applications designed to streamline your tabletop gaming experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app) => {
              const IconComponent = app.icon
              return (
                <Card key={app.id} className="card-3d hover:shadow-lg transition-all duration-300 paper-texture relative">
                  {app.comingSoon && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                      Coming Soon
                    </div>
                  )}
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 card-3d ${getColorClasses(app.color)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-foreground font-fantasy">{app.title}</CardTitle>
                    <CardDescription className="text-muted-foreground mb-4">
                      {app.description}
                    </CardDescription>
                    <div className="space-y-2 mb-4">
                      {app.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto">
                      {app.comingSoon ? (
                        <Button disabled className="w-full" variant="outline">
                          Coming Soon
                        </Button>
                      ) : (
                        <Link href={app.demoLink} className="block">
                          <Button className="w-full button-3d text-primary-foreground">
                            Try Demo
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 paper-texture">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12 font-fantasy">
            Why Choose Tabletop Toolkit?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">All-in-One Platform</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Everything you need in one place - no more juggling multiple tools and subscriptions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">Easy to Use</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Intuitive interfaces designed by gamers, for gamers - get started in minutes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-3d hover:shadow-lg transition-all duration-300 paper-texture">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4 card-3d">
                  <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-foreground font-fantasy">Export & Share</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Export your creations and share them with your gaming group seamlessly
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 leather-binding">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-primary-foreground mb-6 font-fantasy">
            Ready to Enhance Your Gaming Experience?
          </h3>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of Game Masters who are already using our tools to create unforgettable adventures.
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
              <Dice6 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-fantasy">Tabletop Toolkit</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2024 Tabletop Toolkit. Built for the tabletop gaming community.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
