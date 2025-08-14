// Example: How to implement lazy loading in shopkeeper page
"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LazyShopDisplay, loadCommonItems } from "@/lib/lazy-components"
import { applyTheme, useOptimizedTheme, getThemeClasses } from "@/lib/optimized-themes"

export default function OptimizedShopkeeperPage() {
  const [items, setItems] = useState([])
  const [theme, setSelectedTheme] = useState('parchment')
  const [commonItemsData, setCommonItemsData] = useState<any>(null)
  const { setTheme: applySelectedTheme } = useOptimizedTheme()
  const themeClasses = getThemeClasses()

  // Dynamically load heavy data
  useEffect(() => {
    const loadData = async () => {
      try {
        const module = await loadCommonItems()
        setCommonItemsData(module.commonItems)
      } catch (error) {
        console.error('Failed to load common items:', error)
      }
    }
    loadData()
  }, [])

  // Apply theme when changed
  useEffect(() => {
    applySelectedTheme(theme)
  }, [theme, applySelectedTheme])

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      {/* Theme Selector */}
      <Card className={`m-4 ${themeClasses.card}`}>
        <CardHeader>
          <CardTitle className={themeClasses.text}>Shop Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {['parchment', 'tavern', 'arcane', 'forest', 'dungeon'].map((t) => (
              <Button
                key={t}
                onClick={() => setSelectedTheme(t)}
                variant={theme === t ? 'default' : 'outline'}
                className="capitalize"
              >
                {t}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lazy-loaded Shop Display */}
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      }>
        {items.length > 0 && (
          <LazyShopDisplay
            shopTitle="Test Shop"
            ownerName="Test Owner"
            items={items}
            theme={theme}
          />
        )}
      </Suspense>

      {/* Quick Add Items (using lazy-loaded data) */}
      {commonItemsData && (
        <Card className={`m-4 ${themeClasses.card}`}>
          <CardHeader>
            <CardTitle className={themeClasses.text}>Quick Add Common Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(commonItemsData).slice(0, 3).map(category => (
                <Button
                  key={category}
                  onClick={() => {
                    const categoryItems = commonItemsData[category].slice(0, 3).map((item, index) => ({
                      id: `${category}-${index}`,
                      name: item.name,
                      category,
                      price: item.price,
                      currency: item.currency
                    }))
                    setItems(prev => [...prev, ...categoryItems])
                  }}
                  variant="outline"
                  className="capitalize"
                >
                  Add {category} Items
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
