import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Sword, Shield, Eye, Brain } from "lucide-react"

type InventoryItem = {
  id: string
  name: string
  description: string
}

type NPCStats = {
  STR: number
  DEX: number
  CON: number
  INT: number
  WIS: number
  CHA: number
  armorClass: number
  hitPoints: number
  speed: number
  proficiencyBonus: number
}

type NPCDisplayProps = {
  npcName: string
  profession: string
  description: string
  vocalNotes: string
  inventory: InventoryItem[]
  stats: NPCStats
  theme: string
  isPrintMode?: boolean
}

// Theme configurations (same as shop display for consistency)
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

// Calculate ability modifier
const getModifier = (score: number): string => {
  const modifier = Math.floor((score - 10) / 2)
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

export function NPCDisplay({
  npcName,
  profession,
  description,
  vocalNotes,
  inventory,
  stats,
  theme,
  isPrintMode = false,
}: NPCDisplayProps) {
  // Get theme styles with fallback to parchment theme
  const styles = themeConfig[theme as keyof typeof themeConfig] || themeConfig.parchment

  return (
    <div id="npc-display-print" className={isPrintMode ? "print-mode" : ""}>
      <Card
        className={`${styles.cardBg} ${styles.border} shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:w-full card-3d paper-texture`}
      >
        <CardHeader className={`${styles.headerBg} border-b ${styles.border} print:pb-4`}>
          <CardTitle
            className={`text-center ${styles.title} text-2xl md:text-3xl font-fantasy print:text-3xl print:mb-2`}
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            {npcName || "Unnamed Character"}
          </CardTitle>
          <p className={`text-center ${styles.subtitle} italic print:text-lg font-medium`}>
            {profession || "Unknown Profession"}
          </p>
        </CardHeader>
        <CardContent className={`p-6 ${styles.background} print:p-8 print:bg-white paper-texture space-y-6`}>
          {/* Description */}
          {description && (
            <div className="print:break-inside-avoid">
              <div className={`flex items-center gap-2 mb-2 ${styles.title} print:mb-4`}>
                <div className="p-1 rounded card-3d bg-gradient-to-br from-white/20 to-white/10">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-lg print:text-xl font-fantasy">Description</h3>
              </div>
              <div className={`h-1 ${styles.divider} mb-3 print:mb-4 print:h-px rounded-full`}></div>
              <p className={`${styles.text} leading-relaxed print:leading-relaxed`}>{description}</p>
            </div>
          )}

          {/* Vocal Notes */}
          {vocalNotes && (
            <div className="print:break-inside-avoid">
              <div className={`flex items-center gap-2 mb-2 ${styles.title} print:mb-4`}>
                <div className="p-1 rounded card-3d bg-gradient-to-br from-white/20 to-white/10">
                  <Eye className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-lg print:text-xl font-fantasy">Vocal Notes</h3>
              </div>
              <div className={`h-1 ${styles.divider} mb-3 print:mb-4 print:h-px rounded-full`}></div>
              <p className={`${styles.text} leading-relaxed print:leading-relaxed italic`}>{vocalNotes}</p>
            </div>
          )}

          {/* Ability Scores */}
          <div className="print:break-inside-avoid">
            <div className={`flex items-center gap-2 mb-2 ${styles.title} print:mb-4`}>
              <div className="p-1 rounded card-3d bg-gradient-to-br from-white/20 to-white/10">
                <Brain className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-lg print:text-xl font-fantasy">Ability Scores</h3>
            </div>
            <div className={`h-1 ${styles.divider} mb-3 print:mb-4 print:h-px rounded-full`}></div>
            <div className="grid grid-cols-3 gap-3 print:grid-cols-6">
              {Object.entries(stats)
                .slice(0, 6)
                .map(([ability, score]) => (
                  <div
                    key={ability}
                    className={`text-center p-3 rounded-lg ${styles.itemBg} ${styles.border} border-opacity-30 card-3d`}
                  >
                    <div className={`font-bold text-sm ${styles.itemText}`}>{ability}</div>
                    <div className={`text-xl font-bold ${styles.title}`}>{score}</div>
                    <div className={`text-sm ${styles.subtitle}`}>{getModifier(score)}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Combat Stats */}
          <div className="print:break-inside-avoid">
            <div className={`flex items-center gap-2 mb-2 ${styles.title} print:mb-4`}>
              <div className="p-1 rounded card-3d bg-gradient-to-br from-white/20 to-white/10">
                <Sword className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-lg print:text-xl font-fantasy">Combat Stats</h3>
            </div>
            <div className={`h-1 ${styles.divider} mb-3 print:mb-4 print:h-px rounded-full`}></div>
            <div className="grid grid-cols-2 gap-3 print:grid-cols-4">
              <div className={`text-center p-3 rounded-lg ${styles.itemBg} ${styles.border} border-opacity-30 card-3d`}>
                <div className={`font-bold text-sm ${styles.itemText}`}>AC</div>
                <div className={`text-xl font-bold ${styles.title}`}>{stats.armorClass}</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${styles.itemBg} ${styles.border} border-opacity-30 card-3d`}>
                <div className={`font-bold text-sm ${styles.itemText}`}>HP</div>
                <div className={`text-xl font-bold ${styles.title}`}>{stats.hitPoints}</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${styles.itemBg} ${styles.border} border-opacity-30 card-3d`}>
                <div className={`font-bold text-sm ${styles.itemText}`}>Speed</div>
                <div className={`text-xl font-bold ${styles.title}`}>{stats.speed} ft</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${styles.itemBg} ${styles.border} border-opacity-30 card-3d`}>
                <div className={`font-bold text-sm ${styles.itemText}`}>Prof</div>
                <div className={`text-xl font-bold ${styles.title}`}>+{stats.proficiencyBonus}</div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          {inventory.length > 0 && (
            <div className="print:break-inside-avoid">
              <div className={`flex items-center gap-2 mb-2 ${styles.title} print:mb-4`}>
                <div className="p-1 rounded card-3d bg-gradient-to-br from-white/20 to-white/10">
                  <Shield className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-lg print:text-xl font-fantasy">Inventory</h3>
              </div>
              <div className={`h-1 ${styles.divider} mb-3 print:mb-4 print:h-px rounded-full`}></div>
              <ul className="space-y-2 print:space-y-3">
                {inventory.map((item) => (
                  <li
                    key={item.id}
                    className={`p-3 rounded-lg ${styles.itemText} ${styles.itemBg} hover:shadow-md transition-all duration-200 print:py-2 print:px-3 print:bg-opacity-20 print:rounded-none print:border-b print:border-dotted print:border-gray-300 card-3d border ${styles.border} border-opacity-30 print:item-spacing print:line-spacing`}
                  >
                    <div className="font-medium print:font-medium print:item-name">{item.name}</div>
                    {item.description && (
                      <div className={`text-sm ${styles.subtitle} mt-1 print:text-sm`}>{item.description}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Empty State */}
          {!description && !vocalNotes && inventory.length === 0 && (
            <div className={`text-center py-8 ${styles.text} italic print:py-12 print:text-lg`}>
              Start creating your NPC by filling in the details on the left.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
