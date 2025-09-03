"use client"

import { useState, useMemo, useEffect } from "react"
import { Save, FolderOpen, PlusCircle, Printer, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { SharedHeader } from "@/components/shared-header"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import {
  saveSpellCard,
  updateSpellCard,
  getUserSpellCards,
  deleteSpellCard,
  type SpellCard as FirebaseSpellCard,
} from "@/lib/firebase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// D&D 5e spell levels
const spellLevels = [
  { value: "0", label: "Cantrip" },
  { value: "1", label: "1st Level" },
  { value: "2", label: "2nd Level" },
  { value: "3", label: "3rd Level" },
  { value: "4", label: "4th Level" },
  { value: "5", label: "5th Level" },
  { value: "6", label: "6th Level" },
  { value: "7", label: "7th Level" },
  { value: "8", label: "8th Level" },
  { value: "9", label: "9th Level" },
]

// Schools of magic
const schoolsOfMagic = [
  "Abjuration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Evocation",
  "Illusion",
  "Necromancy",
  "Transmutation",
]

// D&D 5e classes
const dndClasses = [
  "Artificer",
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
]

// Theme options (matching shopkeeper themes)
const themes = [
  {
    id: "parchment",
    name: "Parchment",
    description: "Classic aged paper look",
    gradient: "from-amber-50 to-amber-100",
    border: "border-amber-800",
    text: "text-amber-900",
    shadow: "shadow-amber-200",
  },
  {
    id: "tavern",
    name: "Tavern",
    description: "Warm, cozy inn atmosphere",
    gradient: "from-orange-50 to-orange-100",
    border: "border-orange-800",
    text: "text-orange-900",
    shadow: "shadow-orange-200",
  },
  {
    id: "arcane",
    name: "Arcane",
    description: "Mystical magical energy",
    gradient: "from-purple-50 to-purple-100",
    border: "border-purple-800",
    text: "text-purple-900",
    shadow: "shadow-purple-200",
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural woodland magic",
    gradient: "from-green-50 to-green-100",
    border: "border-green-800",
    text: "text-green-900",
    shadow: "shadow-green-200",
  },
  {
    id: "dungeon",
    name: "Dungeon",
    description: "Dark underground depths",
    gradient: "from-stone-50 to-stone-100",
    border: "border-stone-800",
    text: "text-stone-900",
    shadow: "shadow-stone-200",
  },
  {
    id: "celestial",
    name: "Celestial",
    description: "Divine holy radiance",
    gradient: "from-blue-50 to-blue-100",
    border: "border-blue-800",
    text: "text-blue-900",
    shadow: "shadow-blue-200",
  },
  {
    id: "infernal",
    name: "Infernal",
    description: "Fiery demonic power",
    gradient: "from-red-50 to-red-100",
    border: "border-red-800",
    text: "text-red-900",
    shadow: "shadow-red-200",
  },
  {
    id: "fey",
    name: "Fey",
    description: "Whimsical fairy magic",
    gradient: "from-pink-50 to-pink-100",
    border: "border-pink-800",
    text: "text-pink-900",
    shadow: "shadow-pink-200",
  },
]

// Border styles
const borderStyles = [
  {
    id: "simple",
    name: "Simple",
    description: "Clean, minimal border",
    classes: "border-2",
    effect: "",
  },
  {
    id: "ornate",
    name: "Ornate",
    description: "Decorative double border",
    classes: "border-4 border-double",
    effect: "shadow-xl",
  },
  {
    id: "mystical",
    name: "Mystical",
    description: "Magical dashed border",
    classes: "border-4 border-dashed",
    effect: "shadow-xl animate-pulse",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined rounded corners",
    classes: "border-3 rounded-xl",
    effect: "shadow-2xl",
  },
  {
    id: "runic",
    name: "Runic",
    description: "Ancient carved appearance",
    classes: "border-4 border-dotted",
    effect: "shadow-2xl",
  },
  {
    id: "royal",
    name: "Royal",
    description: "Regal thick border",
    classes: "border-8 border-solid",
    effect: "shadow-2xl",
  },
]

// Card size options for different use cases
const cardSizes = [
  {
    id: "standard",
    name: "Standard (3x5)",
    description: "Traditional spell card size",
    width: "w-60",
    height: "h-96",
  },
  {
    id: "compact",
    name: "Compact (2.5x4)",
    description: "Smaller for tight spaces",
    width: "w-48",
    height: "h-80",
  },
  {
    id: "large",
    name: "Large (4x6)",
    description: "Bigger for detailed spells",
    width: "w-72",
    height: "h-[28rem]",
  },
]

const typographyStyles = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional serif font",
    titleClass: "font-serif",
    bodyClass: "font-serif",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean sans-serif font",
    titleClass: "font-sans",
    bodyClass: "font-sans",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Decorative fantasy font",
    titleClass: "font-fantasy",
    bodyClass: "font-serif",
  },
]

// Spell card type
type SpellCard = {
  id: string
  title: string
  level: string
  school: string
  castingTime: string
  range: string
  duration: string
  description: string
  classes: string[]
  isRitual: boolean
  requiresConcentration: boolean
  theme: string
  borderStyle: string
}

export default function SpellCardCreator() {
  const { user, loading, isConfigured } = useAuth()

  // Spell card state
  const [spellCard, setSpellCard] = useState<SpellCard>({
    id: "",
    title: "Fireball",
    level: "3",
    school: "Evocation",
    castingTime: "1 action",
    range: "150 feet",
    duration: "Instantaneous",
    description:
      "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.",
    classes: ["Sorcerer", "Wizard"],
    isRitual: false,
    requiresConcentration: false,
    theme: "parchment",
    borderStyle: "simple",
  })

  // Current spell card ID for saving/updating
  const [currentSpellId, setCurrentSpellId] = useState<string | null>(null)

  // Card customization options
  const [cardSize, setCardSize] = useState("standard")
  const [typographyStyle, setTypographyStyle] = useState("classic")

  // Saved spell cards state
  const [savedSpellCards, setSavedSpellCards] = useState<FirebaseSpellCard[]>([])
  const [loadingSpellCards, setLoadingSpellCards] = useState(false)
  const [savingSpellCard, setSavingSpellCard] = useState(false)

  // Load user's spell cards when they sign in
  useEffect(() => {
    if (user && isConfigured) {
      loadUserSpellCards()
    }
  }, [user, isConfigured])

  const loadUserSpellCards = async () => {
    if (!user || !isConfigured) return

    setLoadingSpellCards(true)
    try {
      const spellCards = await getUserSpellCards()
      setSavedSpellCards(spellCards)
    } catch (error) {
      console.error("Failed to load spell cards:", error)
      toast({
        title: "Error",
        description: "Failed to load your saved spell cards.",
        variant: "destructive",
      })
    } finally {
      setLoadingSpellCards(false)
    }
  }

  // Save current spell card
  const handleSaveSpellCard = async () => {
    if (!user || !isConfigured) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your spell card.",
        variant: "destructive",
      })
      return
    }

    // Basic validation
    if (!spellCard.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Spell title is required.",
        variant: "destructive",
      })
      return
    }

    setSavingSpellCard(true)
    try {
      const spellCardData = {
        title: spellCard.title.trim(),
        level: spellCard.level,
        school: spellCard.school,
        castingTime: spellCard.castingTime.trim(),
        range: spellCard.range.trim(),
        duration: spellCard.duration.trim(),
        description: spellCard.description.trim(),
        classes: spellCard.classes,
        isRitual: spellCard.isRitual,
        requiresConcentration: spellCard.requiresConcentration,
        theme: spellCard.theme,
        borderStyle: spellCard.borderStyle,
        creatorId: user?.uid || "",
      }

      if (currentSpellId) {
        // Update existing spell card
        await updateSpellCard(currentSpellId, spellCardData)
        toast({
          title: "Spell Card Updated",
          description: `"${spellCard.title}" has been updated successfully.`,
        })
      } else {
        // Save new spell card
        const newSpellId = await saveSpellCard(spellCardData)
        setCurrentSpellId(newSpellId)
        toast({
          title: "Spell Card Saved",
          description: `"${spellCard.title}" has been saved successfully.`,
        })
      }

      // Reload spell cards list
      await loadUserSpellCards()
    } catch (error) {
      console.error("Failed to save spell card:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save spell card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingSpellCard(false)
    }
  }

  // Load a saved spell card
  const handleLoadSpellCard = (spellCardData: FirebaseSpellCard) => {
    setSpellCard({
      id: spellCardData.id || "",
      title: spellCardData.title,
      level: spellCardData.level,
      school: spellCardData.school,
      castingTime: spellCardData.castingTime,
      range: spellCardData.range,
      duration: spellCardData.duration,
      description: spellCardData.description,
      classes: spellCardData.classes,
      isRitual: spellCardData.isRitual,
      requiresConcentration: spellCardData.requiresConcentration,
      theme: spellCardData.theme,
      borderStyle: spellCardData.borderStyle,
    })
    setCurrentSpellId(spellCardData.id || null)

    toast({
      title: "Spell Card Loaded",
      description: `"${spellCardData.title}" has been loaded successfully.`,
    })
  }

  // Delete a saved spell card
  const handleDeleteSpellCard = async (spellCardId: string, spellCardTitle: string) => {
    if (!user || !isConfigured) return

    try {
      await deleteSpellCard(spellCardId)

      // If we're currently editing this spell card, clear the current spell ID
      if (currentSpellId === spellCardId) {
        setCurrentSpellId(null)
      }

      // Reload spell cards list
      await loadUserSpellCards()

      toast({
        title: "Spell Card Deleted",
        description: `"${spellCardTitle}" has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Failed to delete spell card:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete spell card. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Determine if user is in free mode
  const isFreeMode = !isConfigured || !user
  const displayName = isFreeMode ? "Free Mode User" : user?.displayName || user?.email || "User"

  // Theme classes memoization
  const themeClasses = useMemo(() => {
    const selectedTheme = themes.find((t) => t.id === spellCard.theme) || themes[0]
    const selectedBorder = borderStyles.find((b) => b.id === spellCard.borderStyle) || borderStyles[0]
    const selectedSize = cardSizes.find((s) => s.id === cardSize) || cardSizes[0]

    const baseClasses = `${selectedSize.width} ${selectedSize.height} rounded-lg p-4 relative transition-all duration-300`
    const themeClasses = `bg-gradient-to-br ${selectedTheme.gradient} ${selectedTheme.border} ${selectedTheme.text} ${selectedTheme.shadow}`
    const borderClasses = `${selectedBorder.classes} ${selectedBorder.effect}`

    return `${baseClasses} ${themeClasses} ${borderClasses}`
  }, [spellCard.theme, spellCard.borderStyle, cardSize])

  // Typography classes memoization
  const typographyClasses = useMemo(() => {
    const selectedTypography = typographyStyles.find((t) => t.id === typographyStyle) || typographyStyles[0]
    return {
      title: selectedTypography.titleClass,
      body: selectedTypography.bodyClass,
    }
  }, [typographyStyle])

  // Formatted spell level memoization
  const formattedSpellLevel = useMemo(() => {
    const level = spellLevels.find((l) => l.value === spellCard.level)
    return level ? level.label : "Unknown Level"
  }, [spellCard.level])

  // Formatted description memoization
  const formattedDescription = useMemo(() => {
    if (!spellCard.description) return "No description provided."

    // Split long descriptions into paragraphs for better readability
    const sentences = spellCard.description.split(". ")
    if (sentences.length > 3) {
      const midPoint = Math.ceil(sentences.length / 2)
      const firstPart = sentences.slice(0, midPoint).join(". ")
      const secondPart = sentences.slice(midPoint).join(". ")
      return (
        <>
          <div className="mb-2">
            {firstPart}
            {firstPart.endsWith(".") ? "" : "."}
          </div>
          <div>{secondPart}</div>
        </>
      )
    }
    return spellCard.description
  }, [spellCard.description])

  // Card completeness memoization
  const cardCompleteness = useMemo(() => {
    const requiredFields = ["title", "level", "school", "castingTime", "range", "duration", "description"]
    const completedFields = requiredFields.filter(
      (field) => spellCard[field as keyof SpellCard] && String(spellCard[field as keyof SpellCard]).trim() !== "",
    )
    return {
      completed: completedFields.length,
      total: requiredFields.length,
      percentage: Math.round((completedFields.length / requiredFields.length) * 100),
    }
  }, [spellCard])

  // Handle class selection
  const handleClassToggle = (className: string) => {
    setSpellCard((prev) => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter((c) => c !== className)
        : [...prev.classes, className],
    }))
  }

  const handlePrint = () => {
    const printContent = document.getElementById("spell-card-preview")
    if (!printContent) {
      toast({
        title: "Print Error",
        description: "Unable to find spell card for printing",
        variant: "destructive",
      })
      return
    }

    const printWindow = window.open("", "_blank", "width=400,height=600,scrollbars=yes,resizable=yes")
    if (!printWindow) {
      toast({
        title: "Print Blocked",
        description: "Please allow pop-ups to print spell cards",
        variant: "destructive",
      })
      return
    }

    // Get theme-specific colors for print
    const selectedTheme = themes.find((t) => t.id === spellCard.theme) || themes[0]
    const selectedBorder = borderStyles.find((b) => b.id === spellCard.borderStyle) || borderStyles[0]

    // Generate theme-specific CSS
    const getThemeColors = (theme: typeof selectedTheme) => {
      switch (theme.id) {
        case "parchment":
          return { bg: "#FEF3C7", border: "#92400E", text: "#92400E" }
        case "tavern":
          return { bg: "#FED7AA", border: "#C2410C", text: "#C2410C" }
        case "arcane":
          return { bg: "#E9D5FF", border: "#7C2D12", text: "#7C2D12" }
        case "forest":
          return { bg: "#D1FAE5", border: "#065F46", text: "#065F46" }
        case "dungeon":
          return { bg: "#E7E5E4", border: "#44403C", text: "#44403C" }
        case "celestial":
          return { bg: "#DBEAFE", border: "#1E40AF", text: "#1E40AF" }
        case "infernal":
          return { bg: "#FEE2E2", border: "#B91C1C", text: "#B91C1C" }
        case "fey":
          return { bg: "#FCE7F3", border: "#BE185D", text: "#BE185D" }
        default:
          return { bg: "#FEF3C7", border: "#92400E", text: "#92400E" }
      }
    }

    const themeColors = getThemeColors(selectedTheme)
    const borderStyle =
      selectedBorder.id === "ornate"
        ? "double"
        : selectedBorder.id === "mystical"
          ? "dashed"
          : selectedBorder.id === "elegant"
            ? "solid"
            : "solid"
    const borderWidth = selectedBorder.id === "royal" ? "4px" : selectedBorder.id === "ornate" ? "3px" : "2px"

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spell Card - ${spellCard.title}</title>
          <style>
            @page {
              size: 3in 5in;
              margin: 0.1in;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            body {
              font-family: ${
                typographyStyle === "modern"
                  ? "'Arial', sans-serif"
                  : typographyStyle === "fantasy"
                    ? "'Georgia', serif"
                    : "'Times New Roman', serif"
              };
              margin: 0;
              padding: 0;
              width: 3in;
              height: 5in;
              overflow: hidden;
            }
            
            .spell-card {
              width: 100%;
              height: 100%;
              border: ${borderWidth} ${borderStyle} ${themeColors.border};
              border-radius: ${selectedBorder.id === "elegant" ? "12px" : "8px"};
              padding: 8px;
              box-sizing: border-box;
              background: ${themeColors.bg};
              color: ${themeColors.text};
              position: relative;
              display: flex;
              flex-direction: column;
            }
            
            .spell-header {
              text-align: center;
              margin-bottom: 8px;
              padding-right: 40px;
            }
            
            .spell-title {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 4px;
              border-bottom: 2px solid ${themeColors.border};
              padding-bottom: 2px;
              word-wrap: break-word;
              line-height: 1.2;
            }
            
            .spell-meta {
              font-size: 8px;
              font-style: italic;
              margin-top: 2px;
            }
            
            .spell-stats {
              background: rgba(0,0,0,0.05);
              border-radius: 4px;
              padding: 6px;
              margin-bottom: 8px;
              font-size: 8px;
            }
            
            .stat-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }
            
            .stat-row:last-child {
              margin-bottom: 0;
            }
            
            .stat-label {
              font-weight: bold;
            }
            
            .spell-description {
              font-size: 9px;
              line-height: 1.3;
              flex: 1;
              overflow: hidden;
              margin-bottom: 8px;
            }
            
            .spell-classes {
              position: absolute;
              bottom: 8px;
              left: 8px;
              right: 8px;
              font-size: 7px;
              text-align: center;
              font-style: italic;
              background: rgba(0,0,0,0.1);
              border-radius: 4px;
              padding: 4px;
            }
            
            .indicators {
              position: absolute;
              top: 8px;
              right: 8px;
              display: flex;
              flex-direction: column;
              gap: 2px;
            }
            
            .indicator {
              font-size: 6px;
              font-weight: bold;
              padding: 2px 4px;
              border-radius: 3px;
              border: 1px solid;
            }
            
            .ritual {
              background: #DBEAFE;
              color: #1E40AF;
              border-color: #3B82F6;
            }
            
            .concentration {
              background: #FEE2E2;
              color: #B91C1C;
              border-color: #EF4444;
            }
            
            .no-classes {
              color: #6B7280;
              background: rgba(0,0,0,0.05);
            }
          </style>
        </head>
        <body>
          <div class="spell-card">
            <div class="indicators">
              ${spellCard.isRitual ? '<div class="indicator ritual">RITUAL</div>' : ""}
              ${spellCard.requiresConcentration ? '<div class="indicator concentration">CONC.</div>' : ""}
            </div>
            
            <div class="spell-header">
              <div class="spell-title">${spellCard.title || "Untitled Spell"}</div>
              <div class="spell-meta">${formattedSpellLevel} ${spellCard.school}</div>
            </div>
            
            <div class="spell-stats">
              <div class="stat-row">
                <span class="stat-label">Casting Time:</span>
                <span>${spellCard.castingTime || "—"}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Range:</span>
                <span>${spellCard.range || "—"}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Duration:</span>
                <span>${spellCard.duration || "—"}</span>
              </div>
            </div>
            
            <div class="spell-description">
              ${spellCard.description || "No description provided."}
            </div>
            
            <div class="spell-classes ${spellCard.classes.length === 0 ? "no-classes" : ""}">
              ${
                spellCard.classes.length > 0
                  ? `<strong>Classes:</strong> ${spellCard.classes.join(", ")}`
                  : "No classes selected"
              }
            </div>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
      printWindow.onafterprint = () => printWindow.close()
    }
  }

  // Create new spell card
  const handleNewSpell = () => {
    setSpellCard({
      id: "",
      title: "New Spell",
      level: "1",
      school: "Evocation",
      castingTime: "1 action",
      range: "Touch",
      duration: "Instantaneous",
      description: "Enter your spell description here...",
      classes: [],
      isRitual: false,
      requiresConcentration: false,
      theme: "parchment",
      borderStyle: "simple",
    })
    setCurrentSpellId(null)

    toast({
      title: "New Spell Card",
      description: "Started creating a new spell card.",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Free Mode Alert */}
        {isFreeMode && (
          <Alert className="mb-6 border-amber-600/30 bg-amber-50/80 dark:border-amber-400/30 dark:bg-amber-950/30 card-3d">
            <AlertCircle className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-300">
              You're using free mode. Your spell cards won't be saved.{" "}
              {isConfigured && (
                <Link href="/auth" className="underline font-medium">
                  Sign in to save your work
                </Link>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-fantasy">Spell Card Creator</h1>
            <p className="text-muted-foreground">
              {isFreeMode ? "Free Mode - Create spell cards without limits!" : `Welcome back, ${displayName}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 button-3d bg-transparent text-primary-foreground"
              disabled={!spellCard.title.trim()}
            >
              <Printer className="w-4 h-4" />
              <span>Print 3x5 Card</span>
            </Button>

            {user && isConfigured && (
              <>
                <Button
                  onClick={handleNewSpell}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 button-3d text-primary-foreground bg-transparent"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New</span>
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2 button-3d bg-transparent text-primary-foreground"
                      disabled={loadingSpellCards}
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>Load</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="card-3d max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-fantasy">Load Saved Spell Card</DialogTitle>
                      <DialogDescription>Choose a spell card to load from your saved collection.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-96 overflow-y-auto">
                      {loadingSpellCards ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : savedSpellCards.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">No saved spell cards found.</p>
                      ) : (
                        <div className="space-y-2">
                          {savedSpellCards.map((spellCardData) => (
                            <div
                              key={spellCardData.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">{spellCardData.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Level {spellCardData.level} {spellCardData.school} • {spellCardData.classes.length}{" "}
                                  classes
                                  {spellCardData.isRitual && " • Ritual"}
                                  {spellCardData.requiresConcentration && " • Concentration"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Updated: {spellCardData.updatedAt.toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleLoadSpellCard(spellCardData)}
                                  className="button-3d text-primary-foreground"
                                >
                                  Load
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteSpellCard(spellCardData.id!, spellCardData.title)}
                                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive/20"
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  className="flex items-center space-x-2 button-3d text-primary-foreground"
                  onClick={handleSaveSpellCard}
                  disabled={savingSpellCard}
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSpellCard ? "Saving..." : currentSpellId ? "Update" : "Save"}</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Editor Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Editor Section */}
          <div className="flex-1">
            <Card className="card-3d paper-texture">
              <CardHeader className="wood-grain">
                <CardTitle className="text-2xl font-bold text-foreground font-fantasy">Spell Design</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Create custom spell cards for D&D 5th Edition
                </CardDescription>
              </CardHeader>
              <CardContent className="paper-texture space-y-6">
                {/* Basic Spell Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="spell-title" className="text-foreground font-medium">
                      Spell Title
                    </Label>
                    <Input
                      id="spell-title"
                      value={spellCard.title}
                      onChange={(e) => setSpellCard((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter spell name"
                      className="input-3d mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="spell-level" className="text-foreground font-medium">
                      Spell Level
                    </Label>
                    <Select
                      value={spellCard.level}
                      onValueChange={(value) => setSpellCard((prev) => ({ ...prev, level: value }))}
                    >
                      <SelectTrigger id="spell-level" className="input-3d mt-2">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="card-3d">
                        {spellLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value} className="hover:bg-accent/50">
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* School and Casting Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="school" className="text-foreground font-medium">
                      School of Magic
                    </Label>
                    <Select
                      value={spellCard.school}
                      onValueChange={(value) => setSpellCard((prev) => ({ ...prev, school: value }))}
                    >
                      <SelectTrigger id="school" className="input-3d mt-2">
                        <SelectValue placeholder="Select school" />
                      </SelectTrigger>
                      <SelectContent className="card-3d">
                        {schoolsOfMagic.map((school) => (
                          <SelectItem key={school} value={school} className="hover:bg-accent/50">
                            {school}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="casting-time" className="text-foreground font-medium">
                      Casting Time
                    </Label>
                    <Input
                      id="casting-time"
                      value={spellCard.castingTime}
                      onChange={(e) => setSpellCard((prev) => ({ ...prev, castingTime: e.target.value }))}
                      placeholder="e.g., 1 action"
                      className="input-3d mt-2"
                    />
                  </div>
                </div>

                {/* Range and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="range" className="text-foreground font-medium">
                      Range
                    </Label>
                    <Input
                      id="range"
                      value={spellCard.range}
                      onChange={(e) => setSpellCard((prev) => ({ ...prev, range: e.target.value }))}
                      placeholder="e.g., 60 feet"
                      className="input-3d mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-foreground font-medium">
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      value={spellCard.duration}
                      onChange={(e) => setSpellCard((prev) => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., Instantaneous"
                      className="input-3d mt-2"
                    />
                  </div>
                </div>

                {/* Spell Description */}
                <div>
                  <Label htmlFor="description" className="text-foreground font-medium">
                    Spell Description
                  </Label>
                  <Textarea
                    id="description"
                    value={spellCard.description}
                    onChange={(e) => setSpellCard((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter the full spell description..."
                    className="input-3d mt-2 min-h-[120px]"
                  />
                </div>

                {/* Class Selection */}
                <div>
                  <Label className="text-foreground font-medium mb-3 block">Available Classes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {dndClasses.map((className) => (
                      <div key={className} className="flex items-center space-x-2">
                        <Checkbox
                          id={`class-${className}`}
                          checked={spellCard.classes.includes(className)}
                          onCheckedChange={() => handleClassToggle(className)}
                        />
                        <Label htmlFor={`class-${className}`} className="text-sm text-foreground cursor-pointer">
                          {className}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ritual"
                      checked={spellCard.isRitual}
                      onCheckedChange={(checked) => setSpellCard((prev) => ({ ...prev, isRitual: !!checked }))}
                    />
                    <Label htmlFor="ritual" className="text-foreground font-medium cursor-pointer">
                      Ritual Spell
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="concentration"
                      checked={spellCard.requiresConcentration}
                      onCheckedChange={(checked) =>
                        setSpellCard((prev) => ({ ...prev, requiresConcentration: !!checked }))
                      }
                    />
                    <Label htmlFor="concentration" className="text-foreground font-medium cursor-pointer">
                      Requires Concentration
                    </Label>
                  </div>
                </div>

                {/* Theme and Border Selection */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-foreground font-medium mb-3 block">Card Theme</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {themes.map((theme) => (
                        <div
                          key={theme.id}
                          className={`
                            cursor-pointer rounded-lg p-3 border-2 transition-all duration-200
                            ${
                              spellCard.theme === theme.id
                                ? `${theme.border} bg-gradient-to-br ${theme.gradient}`
                                : "border-border bg-background hover:border-primary/50"
                            }
                          `}
                          onClick={() => setSpellCard((prev) => ({ ...prev, theme: theme.id }))}
                        >
                          <div
                            className={`w-full h-8 rounded mb-2 bg-gradient-to-br ${theme.gradient} border ${theme.border}`}
                          />
                          <div className="text-sm font-medium text-foreground">{theme.name}</div>
                          <div className="text-xs text-muted-foreground">{theme.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground font-medium mb-3 block">Border Style</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {borderStyles.map((border) => (
                        <div
                          key={border.id}
                          className={`
                            cursor-pointer rounded-lg p-3 border-2 transition-all duration-200
                            ${
                              spellCard.borderStyle === border.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-background hover:border-primary/50"
                            }
                          `}
                          onClick={() => setSpellCard((prev) => ({ ...prev, borderStyle: border.id }))}
                        >
                          <div className={`w-full h-8 rounded mb-2 bg-muted ${border.classes}`} />
                          <div className="text-sm font-medium text-foreground">{border.name}</div>
                          <div className="text-xs text-muted-foreground">{border.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="card-size" className="text-foreground font-medium">
                        Card Size
                      </Label>
                      <Select value={cardSize} onValueChange={setCardSize}>
                        <SelectTrigger id="card-size" className="input-3d mt-2">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent className="card-3d">
                          {cardSizes.map((size) => (
                            <SelectItem key={size.id} value={size.id} className="hover:bg-accent/50">
                              <div>
                                <div className="font-medium">{size.name}</div>
                                <div className="text-xs text-muted-foreground">{size.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="typography" className="text-foreground font-medium">
                        Typography Style
                      </Label>
                      <Select value={typographyStyle} onValueChange={setTypographyStyle}>
                        <SelectTrigger id="typography" className="input-3d mt-2">
                          <SelectValue placeholder="Select typography" />
                        </SelectTrigger>
                        <SelectContent className="card-3d">
                          {typographyStyles.map((typography) => (
                            <SelectItem key={typography.id} value={typography.id} className="hover:bg-accent/50">
                              <div>
                                <div className="font-medium">{typography.name}</div>
                                <div className="text-xs text-muted-foreground">{typography.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview Section */}
          <div className="flex-1">
            <Card className="card-3d paper-texture">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground font-fantasy">Live Preview</CardTitle>
                    <CardDescription className="text-muted-foreground">3x5 inch spell card preview</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Completeness</div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${cardCompleteness.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{cardCompleteness.percentage}%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div id="spell-card-preview" className={themeClasses}>
                    <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                      {spellCard.isRitual && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300"
                        >
                          RITUAL
                        </Badge>
                      )}
                      {spellCard.requiresConcentration && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-bold bg-red-100 text-red-800 border border-red-300"
                        >
                          CONC.
                        </Badge>
                      )}
                    </div>

                    <div className={`text-center mb-4 pr-16 ${typographyClasses.title}`}>
                      <h3 className="text-lg font-bold border-b-2 pb-2 mb-2 tracking-wide">
                        {spellCard.title || "Untitled Spell"}
                      </h3>
                      <p className="text-xs font-medium italic">
                        {formattedSpellLevel} {spellCard.school}
                      </p>
                    </div>

                    <div className={`space-y-2 text-xs mb-4 bg-black/5 rounded p-2 ${typographyClasses.body}`}>
                      <div className="flex justify-between">
                        <strong>Casting Time:</strong>
                        <span className="text-right">{spellCard.castingTime || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Range:</strong>
                        <span className="text-right">{spellCard.range || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Duration:</strong>
                        <span className="text-right">{spellCard.duration || "—"}</span>
                      </div>
                    </div>

                    <div className={`text-xs leading-relaxed mb-4 flex-1 overflow-hidden ${typographyClasses.body}`}>
                      {formattedDescription}
                    </div>

                    {spellCard.classes.length > 0 && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="text-xs text-center italic bg-black/10 rounded p-2">
                          <strong>Classes:</strong> {spellCard.classes.join(", ")}
                        </div>
                      </div>
                    )}

                    {spellCard.classes.length === 0 && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="text-xs text-center italic text-muted-foreground bg-black/5 rounded p-2">
                          No classes selected
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSpellCard((prev) => ({
                        ...prev,
                        theme: themes[(themes.findIndex((t) => t.id === prev.theme) + 1) % themes.length].id,
                      }))
                    }
                    className="text-xs"
                  >
                    Next Theme
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSpellCard((prev) => ({
                        ...prev,
                        borderStyle:
                          borderStyles[
                            (borderStyles.findIndex((b) => b.id === prev.borderStyle) + 1) % borderStyles.length
                          ].id,
                      }))
                    }
                    className="text-xs"
                  >
                    Next Border
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCardSize(cardSizes[(cardSizes.findIndex((s) => s.id === cardSize) + 1) % cardSizes.length].id)
                    }
                    className="text-xs"
                  >
                    Next Size
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setTypographyStyle(
                        typographyStyles[
                          (typographyStyles.findIndex((t) => t.id === typographyStyle) + 1) % typographyStyles.length
                        ].id,
                      )
                    }
                    className="text-xs"
                  >
                    Next Font
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
