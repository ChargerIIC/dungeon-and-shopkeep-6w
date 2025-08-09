import { Package, Dice6, BookOpen, MapPin, Scroll } from "lucide-react";

export   const applications = [
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
      title: "Dungeon Coach Stat Generation",
      description: "Lets you roll and arrange stats for Dungeon Coach's 4d6 dice generation system",
      icon: Dice6,
      color: "emerald",
      demoLink: "#",
      features: ["Multiple Systems", "Stat Tracking", "Select Dice to Drop"],
      comingSoon: true
    },
    {
      id: "npc-cards",
      title: "NPC Cards",
      description: "Organize your NPCs and print summary cards that you can refernce as part of your DM deck or behind a Gamemaster screen",
      icon: BookOpen,
      color: "purple",
      demoLink: "#",
      features: ["NPC Stats", "Inventory Customization", "Vocal Notes"],
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
