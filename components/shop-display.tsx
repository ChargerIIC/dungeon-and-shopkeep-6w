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

// Theme configurations with enhanced 3D and tactile styling and WCAG compliant contrast
const themeConfig = {
  parchment: {
    background: "bg-amber-50/80 dark:bg-amber-950/20 print:bg-amber-50",
    cardBg:
      "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 print:bg-white print:border-amber-900/30",
    border: "border-amber-900/30 dark:border-amber-700/40 print:border-amber-900/40",
    title: "text-amber-900 dark:text-amber-100 print:text-amber-900",
    subtitle: "text-amber-800 dark:text-amber-200 print:text-amber-800",
    text: "text-amber-950 dark:text-amber-100 print:text-amber-950",
    itemText: "text-amber-900 dark:text-amber-100 print:text-amber-950",
    itemBg: "bg-amber-100/80 dark:bg-amber-900/60 print:bg-amber-50/30",
    accent:
      "bg-gradient-to-r from-amber-100 to-amber-200/50 dark:from-amber-900/40 dark:to-amber-800/30 print:bg-amber-100/50",
    headerBg:
      "bg-gradient-to-r from-amber-200 to-amber-300 dark:from-amber-900 dark:to-amber-800 print:bg-amber-100/30",
    divider:
      "bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-700/50 dark:to-amber-600/50 print:bg-amber-300",
  },
  tavern: {
    background: "bg-stone-800/90 dark:bg-stone-900/80 print:bg-stone-100",
    cardBg:
      "bg-gradient-to-br from-stone-700 to-stone-800/80 dark:from-stone-800 dark:to-stone-900/80 print:bg-white print:border-stone-600",
    border: "border-stone-600/60 dark:border-stone-500/50 print:border-stone-600",
    title: "text-amber-200 dark:text-amber-200 print:text-amber-800",
    subtitle: "text-amber-300 dark:text-amber-300 print:text-amber-700",
    text: "text-stone-100 dark:text-stone-200 print:text-stone-800",
    itemText: "text-amber-100 dark:text-amber-100 print:text-stone-800",
    itemBg: "bg-stone-700/80 dark:bg-stone-800/80 print:bg-stone-100/50",
    accent:
      "bg-gradient-to-r from-stone-600 to-stone-700/80 dark:from-stone-700 dark:to-stone-800/80 print:bg-stone-200",
    headerBg: "bg-gradient-to-r from-stone-900 to-stone-800 dark:from-stone-950 dark:to-stone-900 print:bg-stone-100",
    divider: "bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-600 dark:to-amber-700 print:bg-stone-400",
  },
  arcane: {
    background: "bg-purple-950/90 dark:bg-purple-950/80 print:bg-purple-50",
    cardBg:
      "bg-gradient-to-br from-purple-900 to-purple-950/80 dark:from-purple-900/80 dark:to-purple-950/70 print:bg-white print:border-purple-700",
    border: "border-purple-700/60 dark:border-purple-600/50 print:border-purple-700",
    title: "text-purple-100 dark:text-purple-100 print:text-purple-800",
    subtitle: "text-purple-200 dark:text-purple-200 print:text-purple-700",
    text: "text-purple-100 dark:text-purple-50 print:text-purple-900",
    itemText: "text-purple-50 dark:text-purple-50 print:text-purple-900",
    itemBg: "bg-purple-800/70 dark:bg-purple-900/70 print:bg-purple-50/30",
    accent:
      "bg-gradient-to-r from-purple-800 to-purple-900/80 dark:from-purple-800/80 dark:to-purple-900/70 print:bg-purple-100",
    headerBg:
      "bg-gradient-to-r from-purple-800 to-purple-900 dark:from-purple-900 dark:to-purple-950 print:bg-purple-100/50",
    divider:
      "bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-600 dark:to-purple-700 print:bg-purple-400",
  },
  forest: {
    background: "bg-emerald-900/90 dark:bg-emerald-950/80 print:bg-emerald-50",
    cardBg:
      "bg-gradient-to-br from-emerald-800 to-emerald-900/80 dark:from-emerald-900 dark:to-emerald-950/80 print:bg-white print:border-emerald-700",
    border: "border-emerald-700/60 dark:border-emerald-600/50 print:border-emerald-700",
    title: "text-emerald-100 dark:text-emerald-100 print:text-emerald-800",
    subtitle: "text-emerald-200 dark:text-emerald-200 print:text-emerald-700",
    text: "text-emerald-50 dark:text-emerald-100 print:text-emerald-900",
    itemText: "text-emerald-50 dark:text-emerald-50 print:text-emerald-900",
    itemBg: "bg-emerald-800/70 dark:bg-emerald-900/70 print:bg-emerald-50/30",
    accent:
      "bg-gradient-to-r from-emerald-700 to-emerald-800/80 dark:from-emerald-800 dark:to-emerald-900/80 print:bg-emerald-100",
    headerBg:
      "bg-gradient-to-r from-emerald-800 to-emerald-900 dark:from-emerald-900 dark:to-emerald-950 print:bg-emerald-100/50",
    divider:
      "bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 print:bg-emerald-400",
  },
  dungeon: {
    background: "bg-stone-900/90 dark:bg-stone-950/80 print:bg-stone-50",
    cardBg:
      "bg-gradient-to-br from-stone-800 to-stone-900/80 dark:from-stone-900 dark:to-stone-950/80 print:bg-white print:border-red-900/50",
    border: "border-red-900/60 dark:border-red-800/50 print:border-red-900/50",
    title: "text-red-300 dark:text-red-300 print:text-red-700",
    subtitle: "text-red-400 dark:text-red-400 print:text-stone-700",
    text: "text-stone-300 dark:text-stone-200 print:text-stone-800",
    itemText: "text-red-200 dark:text-red-200 print:text-stone-800",
    itemBg: "bg-stone-800/80 dark:bg-stone-900/80 print:bg-stone-100/50",
    accent:
      "bg-gradient-to-r from-stone-700 to-stone-800/80 dark:from-stone-800 dark:to-stone-900/80 print:bg-stone-200",
    headerBg: "bg-gradient-to-r from-stone-800 to-red-900/40 dark:from-stone-900 dark:to-red-950/60 print:bg-stone-100",
    divider: "bg-gradient-to-r from-red-800 to-red-900 dark:from-red-800/60 dark:to-red-700/70 print:bg-red-300",
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
        className={`${styles.cardBg} ${styles.border} shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:w-full card-3d paper-texture`}
      >
        <CardHeader className={`${styles.headerBg} border-b ${styles.border} print:pb-4 wood-grain`}>
          <CardTitle
            className={`text-center ${styles.title} text-2xl md:text-3xl font-fantasy print:text-3xl print:mb-2`}
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            {shopTitle || "Unnamed Shop"}
          </CardTitle>
          <p className={`text-center ${styles.subtitle} italic print:text-lg font-medium`}>
            Proprietor: {ownerName || "Unknown Merchant"}
          </p>
        </CardHeader>
        <CardContent className={`p-6 ${styles.background} print:p-8 print:bg-white paper-texture`}>
          {Object.keys(groupedItems).length > 0 ? (
            <div className="space-y-6 print:space-y-8">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="print:break-inside-avoid">
                  <div className={`flex items-center gap-2 mb-2 ${styles.title} print:mb-4`}>
                    <div className="p-1 rounded card-3d bg-gradient-to-br from-white/20 to-white/10">
                      {getCategoryIcon(category)}
                    </div>
                    <h3 className="font-semibold text-lg print:text-xl font-fantasy">{category}</h3>
                  </div>
                  <div className={`h-1 ${styles.divider} mb-3 print:mb-4 print:h-px rounded-full`}></div>
                  <ul className="space-y-2 print:space-y-3">
                    {categoryItems.map((item) => (
                      <li
                        key={item.id}
                        className={`flex justify-between py-2 px-3 rounded-lg ${styles.itemText} ${styles.itemBg} hover:shadow-md transition-all duration-200 print:py-2 print:px-3 print:bg-opacity-20 print:rounded-none print:border-b print:border-dotted print:border-gray-300 card-3d border ${styles.border} border-opacity-30 print:item-spacing print:line-spacing`}
                      >
                        <span className="print:font-medium font-medium print:item-name">{item.name}</span>
                        <span className="font-bold print:font-bold text-right print:item-price">
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
