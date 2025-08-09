"use client"

import { Dice6 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export function SharedHeader() {
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
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth">
              <Button className="button-3d text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
