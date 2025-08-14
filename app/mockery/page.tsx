"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, RotateCcw } from "lucide-react"
import { SharedHeader } from "@/components/shared-header"
import { loadInsultsData } from "@/lib/lazy-components"

// Types imported lazily
type Insult = {
  id: number
  text: string
  category: string
}

type InsultCategory = string

export default function MockeryPage() {
  const [selectedCategory, setSelectedCategory] = useState<InsultCategory>("coward")
  const [currentInsult, setCurrentInsult] = useState<Insult>()
  const [isGenerating, setIsGenerating] = useState(false)
  const [insultsModule, setInsultsModule] = useState<any>(null)
  const [categories, setCategories] = useState<string[]>([])

  // Load insults data dynamically
  useEffect(() => {
    const loadData = async () => {
      try {
        const module = await loadInsultsData()
        setInsultsModule(module)
        // Extract categories from enum
        const categoryKeys = Object.keys(module.InsultCategory)
          .filter(key => isNaN(Number(key)))
        setCategories(categoryKeys)
      } catch (error) {
        console.error('Failed to load insults data:', error)
      }
    }
    loadData()
  }, [])

  const generateInsult = () => {
    if (!insultsModule) return
    
    setIsGenerating(true)

    // Add a small delay for dramatic effect
    setTimeout(() => {
      const insult = insultsModule.GetInsultByTag(selectedCategory)
      setCurrentInsult(insult)
      setIsGenerating(false)
    }, 300)
  }

  // Generate initial insult when data is loaded
  useEffect(() => {
    if (insultsModule && !currentInsult) {
      generateInsult()
    }
  }, [insultsModule])

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
            <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Vicious Insult Generator</h1>
            <p className="text-muted-foreground">Generate creative insults for your campaigns</p>
          </div>
        </div>

        {/* Main Content - Centered */}
        <div className="flex flex-col items-center justify-center space-y-8">
          <Card className="w-full max-w-2xl card-3d">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
                Insult Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a target" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem 
                      key={category} 
                      value={category.toLowerCase()}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Insult Display */}
          <Card className="w-full max-w-2xl card-3d">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="min-h-[120px] flex items-center justify-center">
                  {isGenerating ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <RotateCcw className="w-5 h-5 animate-spin" />
                      Crafting insult...
                    </div>
                  ) : (
                    <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-center italic">
                      "{currentInsult?.text}"
                    </blockquote>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={generateInsult}
            disabled={isGenerating || !insultsModule}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate New Insult
              </>
            )}
          </Button>

          {/* Usage Note */}
          <Card className="w-full max-w-2xl mt-8">
            <CardContent className="p-6">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong>Note:</strong> These insults are meant for entertainment and roleplay purposes only.
                </p>
                <p>Perfect for adding flavor to your NPCs, tavern brawls, or comedic moments in your campaigns!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
