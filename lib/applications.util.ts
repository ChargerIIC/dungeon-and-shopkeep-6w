export interface Application {
  title: string
  description: string
  icon: string
  href: string
  color: string
  comingSoon?: boolean
}

export const applications: Application[] = [
  {
    title: "Shop Creator",
    description: "Create your own shop",
    icon: "shop",
    href: "/shopkeeper",
    color: "blue",
  },
  {
    title: "Stat Generator",
    description: "Roll ability scores",
    icon: "dice",
    href: "/stat-generator",
    color: "purple",
  },
  {
    title: "NPC Cards",
    description: "Create character cards",
    icon: "users",
    href: "/npc-cards",
    color: "green",
    comingSoon: true,
  },
  {
    title: "Vicious Insult Generator",
    description: "Generate creative insults",
    icon: "zap",
    href: "/mockery",
    color: "red",
  },
]
