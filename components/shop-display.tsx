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
  isPrintMode?: boolean
}

// Theme configurations with dark mode support and print optimizations
const themeConfig = {
  parchment: {
    background: "bg-amber-50 dark:bg-amber-950/20 print:bg-amber-50",
    cardBg: "bg-amber-50 dark:bg-amber-950/30 print:bg-white print:border-amber-900/30",
    border: "border-amber-900/20 dark:border-amber-700/30 print:border-amber-900/40",
    title: "text-amber-900 dark:text-amber-200 print:text-amber-900",
    subtitle: "text-amber-800 dark:text-amber-300 print:text-amber-800",
    text: "text-amber-950 dark:text-amber-100 print:text-amber-950",
    accent: "bg-amber-100 dark:bg-amber-900/40 print:bg-amber-100/50",
    headerBg: "bg-amber-100 dark:bg-amber-900/50 print:bg-amber-100/30",
    divider: "bg-amber-200 dark:bg-amber-700/50 print:bg-amber-300",
  },
  tavern: {
    background: "bg-stone-800 dark:bg-stone-900 print:bg-stone-100",
    cardBg: "bg-stone-700 dark:bg-stone-800 print:bg-white print:border-stone-600",
    border: "border-stone-600 dark:border-stone-500 print:border-stone-600",
    title: "text-amber-300 dark:text-amber-200 print:text-amber-800",
    subtitle: "text-amber-200 dark:text-amber-300 print:text-amber-700",
    text: "text-stone-100 dark:text-stone-200 print:text-stone-800",
    accent: "bg-stone-600 dark:bg-stone-700 print:bg-stone-200",
    headerBg: "bg-stone-800 dark:bg-stone-900 print:bg-stone-100",
    divider: "bg-stone-500 dark:bg-stone-600 print:bg-stone-400",
  },
  arcane: {
    background: "bg-purple-950 dark:bg-purple-950/80 print:bg-purple-50",
    cardBg: "bg-purple-900 dark:bg-purple-900/80 print:bg-white print:border-purple-700",
    border: "border-purple-700 dark:border-purple-600 print:border-purple-700",
    title: "text-purple-200 dark:text-purple-100 print:text-purple-800",
    subtitle: "text-purple-300 dark:text-purple-200 print:text-purple-700",
    text: "text-purple-100 dark:text-purple-50 print:text-purple-900",
    accent: "bg-purple-800 dark:bg-purple-800/80 print:bg-purple-100",
    headerBg: "bg-purple-900/50 dark:bg-purple-900/60 print:bg-purple-100/50",
    divider: "bg-purple-700 dark:bg-purple-600 print:bg-purple-400",
  },
  forest: {
    background: "bg-emerald-900 dark:bg-emerald-950 print:bg-emerald-50",
    cardBg: "bg-emerald-800 dark:bg-emerald-900 print:bg-white print:border-emerald-700",
    border: "border-emerald-700 dark:border-emerald-600 print:border-emerald-700",
    title: "text-emerald-200 dark:text-emerald-100 print:text-emerald-800",
    subtitle: "text-emerald-300 dark:text-emerald-200 print:text-emerald-700",
    text: "text-emerald-50 dark:text-emerald-100 print:text-emerald-900",
    accent: "bg-emerald-700 dark:bg-emerald-800 print:bg-emerald-100",
    headerBg: "bg-emerald-800/50 dark:bg-emerald-900/60 print:bg-emerald-100/50",
    divider: "bg-emerald-600 dark:bg-emerald-700 print:bg-emerald-400",
  },
  dungeon: {
    background: "bg-stone-900 dark:bg-stone-950 print:bg-stone-50",
    cardBg: "bg-stone-800 dark:bg-stone-900 print:bg-white print:border-red-900/50",
    border: "border-red-900/50 dark:border-red-800/50 print:border-red-900/50",
    title: "text-red-400 dark:text-red-300 print:text-red-700",
    subtitle: "text-stone-400 dark:text-stone-300 print:text-stone-700",
    text: "text-stone-300 dark:text-stone-200 print:text-stone-800",
    accent: "bg-stone-700 dark:bg-stone-800 print:bg-stone-200",
    headerBg: "bg-stone-800/50 dark:bg-stone-900/60 print:bg-stone-100",
    divider: "bg-red-900/30 dark:bg-red-800/40 print:bg-red-300",
  },
}

export function ShopDisplay({ shopTitle, ownerName, items, theme, isPrintMode = false }: ShopDisplayProps) {
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
    <div id="shop-display-print" className={isPrintMode ? "print-mode" : ""}>
      <Card
        className={`${styles.cardBg} ${styles.border} shadow-lg overflow-hidden print:shadow-none print:max-w-none print:w-full`}
      >
        <CardHeader className={`${styles.headerBg} border-b ${styles.border} print:pb-4`}>
          <CardTitle
            className={`text-center ${styles.title} text-2xl md:text-3xl font-fantasy print:text-3xl print:mb-2`}
          >
            {shopTitle || "Unnamed Shop"}
          </CardTitle>
          <p className={`text-center ${styles.subtitle} italic print:text-lg`}>
            Proprietor: {ownerName || "Unknown Merchant"}
          </p>
        </CardHeader>
        <CardContent className={`p-6 ${styles.background} print:p-8 print:bg-white`}>
          {Object.keys(groupedItems).length > 0 ? (
            <div className="space-y-6 print:space-y-8">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="print:break-inside-avoid">
                  <div className={`flex items-center gap-2 mb-2 ${styles.title} print:mb-4`}>
                    {getCategoryIcon(category)}
                    <h3 className="font-semibold text-lg print:text-xl">{category}</h3>
                  </div>
                  <div className={`h-0.5 ${styles.divider} mb-3 print:mb-4 print:h-px`}></div>
                  <ul className="space-y-2 print:space-y-3">
                    {categoryItems.map((item) => (
                      <li
                        key={item.id}
                        className={`flex justify-between py-1 px-2 rounded ${styles.text} ${styles.accent} bg-opacity-30 hover:bg-opacity-50 transition-colors print:py-2 print:px-3 print:bg-opacity-20 print:rounded-none print:border-b print:border-dotted print:border-gray-300`}
                      >
                        <span className="print:font-medium">{item.name}</span>
                        <span className="font-medium print:font-bold">
                          {item.price} {item.currency}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${styles.text} italic print:py-12 print:text-lg`}>
              No items available in this shop yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
