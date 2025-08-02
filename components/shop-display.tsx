import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scroll, Shield, FlaskRoundIcon as Flask, Sword, Package } from "lucide-react"

type Item = {
  id: string
  name: string
  category: string
  price: number
  currency: string
}

type ShopDisplayProps = {
  shopTitle: string
  ownerName: string
  items: Item[]
  theme: string
}

// Theme configurations
const themeConfig = {
  parchment: {
    background: "bg-amber-50",
    cardBg: "bg-amber-50",
    border: "border-amber-900/20",
    title: "text-amber-900",
    subtitle: "text-amber-800",
    text: "text-amber-950",
    accent: "bg-amber-100",
    headerBg: "bg-amber-100",
    divider: "bg-amber-200",
  },
  tavern: {
    background: "bg-stone-800",
    cardBg: "bg-stone-700",
    border: "border-stone-600",
    title: "text-amber-300",
    subtitle: "text-amber-200",
    text: "text-stone-100",
    accent: "bg-stone-600",
    headerBg: "bg-stone-800",
    divider: "bg-stone-500",
  },
  arcane: {
    background: "bg-purple-950",
    cardBg: "bg-purple-900",
    border: "border-purple-700",
    title: "text-purple-200",
    subtitle: "text-purple-300",
    text: "text-purple-100",
    accent: "bg-purple-800",
    headerBg: "bg-purple-900/50",
    divider: "bg-purple-700",
  },
  forest: {
    background: "bg-emerald-900",
    cardBg: "bg-emerald-800",
    border: "border-emerald-700",
    title: "text-emerald-200",
    subtitle: "text-emerald-300",
    text: "text-emerald-50",
    accent: "bg-emerald-700",
    headerBg: "bg-emerald-800/50",
    divider: "bg-emerald-600",
  },
  dungeon: {
    background: "bg-stone-900",
    cardBg: "bg-stone-800",
    border: "border-red-900/50",
    title: "text-red-400",
    subtitle: "text-stone-400",
    text: "text-stone-300",
    accent: "bg-stone-700",
    headerBg: "bg-stone-800/50",
    divider: "bg-red-900/30",
  },
}

export function ShopDisplay({ shopTitle, ownerName, items, theme }: ShopDisplayProps) {
  const styles = themeConfig[theme as keyof typeof themeConfig]

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Weapon":
        return <Sword className="h-4 w-4" />
      case "Armor":
        return <Shield className="h-4 w-4" />
      case "Potions":
        return <Flask className="h-4 w-4" />
      case "Gear":
        return <Package className="h-4 w-4" />
      case "Scroll":
        return <Scroll className="h-4 w-4" />
      default:
        return null
    }
  }

  // Group items by category
  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, Item[]>,
  )

  return (
    <Card className={`${styles.cardBg} ${styles.border} shadow-lg overflow-hidden`}>
      <CardHeader className={`${styles.headerBg} border-b ${styles.border}`}>
        <CardTitle className={`text-center ${styles.title} text-2xl md:text-3xl font-fantasy`}>
          {shopTitle || "Unnamed Shop"}
        </CardTitle>
        <p className={`text-center ${styles.subtitle} italic`}>Proprietor: {ownerName || "Unknown Merchant"}</p>
      </CardHeader>
      <CardContent className={`p-6 ${styles.background}`}>
        {Object.keys(groupedItems).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category}>
                <div className={`flex items-center gap-2 mb-2 ${styles.title}`}>
                  {getCategoryIcon(category)}
                  <h3 className="font-semibold text-lg">{category}</h3>
                </div>
                <div className={`h-0.5 ${styles.divider} mb-3`}></div>
                <ul className="space-y-2">
                  {categoryItems.map((item) => (
                    <li
                      key={item.id}
                      className={`flex justify-between py-1 px-2 rounded ${styles.text} ${styles.accent} bg-opacity-30 hover:bg-opacity-50 transition-colors`}
                    >
                      <span>{item.name}</span>
                      <span className="font-medium">
                        {item.price} {item.currency}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${styles.text} italic`}>No items available in this shop yet.</div>
        )}
      </CardContent>
    </Card>
  )
}
