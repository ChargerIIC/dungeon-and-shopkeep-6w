"use client"
import { useState, useEffect } from "react"
import { PlusCircle, Trash2, LogOut, AlertCircle, Users, Save, FolderOpen, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { PrintButton } from "@/components/print-button"
import { NPCDisplay } from "@/components/npc-display"
import { useAuth } from "@/components/auth-provider"
import { signOutUser, saveNPC, updateNPC, getUserNPCs, deleteNPC, type NPC } from "@/lib/firebase"
import { openPrintWindow } from "@/lib/print-utils"
import { validateNPCName, validateProfession, validateDescription, validateNPC, sanitizeString } from "@/lib/validation"
import { useFormValidation } from "@/hooks/use-validation"
import { ValidatedInput } from "@/components/ui/validated-input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { SharedHeader } from "@/components/shared-header"
import { LazyNPCDisplay } from "@/lib/lazy-components"

// D&D 5e ability scores
const abilityScores = ["STR", "DEX", "CON", "INT", "WIS", "CHA"]

// Common NPC professions
const professions = [
  "Merchant",
  "Guard",
  "Innkeeper",
  "Blacksmith",
  "Cleric",
  "Wizard",
  "Rogue",
  "Fighter",
  "Ranger",
  "Bard",
  "Noble",
  "Peasant",
  "Scholar",
  "Artisan",
  "Sailor",
  "Soldier",
  "Thief",
  "Assassin",
  "Healer",
  "Scribe",
  "Cook",
  "Stable Hand",
  "Bartender",
  "Other",
]

// Theme options (same as shopkeeper for consistency)
const themes = [
  { id: "parchment", name: "Parchment" },
  { id: "tavern", name: "Tavern" },
  { id: "arcane", name: "Arcane" },
  { id: "forest", name: "Forest" },
  { id: "dungeon", name: "Dungeon" },
]

// NPC type definition
type NPCCharacter = {
  id: string
  name: string
  profession: string
  description: string
  vocalNotes: string
  inventory: InventoryItem[]
  stats: NPCStats
}

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

export default function NPCCreator() {
  const { user, loading, isConfigured } = useAuth()
  const router = useRouter()

  // NPC details state
  const [npcName, setNpcName] = useState("Eldara Moonwhisper")
  const [profession, setProfession] = useState("Merchant")
  const [description, setDescription] = useState("A wise elven merchant with silver hair and knowing eyes.")
  const [vocalNotes, setVocalNotes] = useState("Speaks in a melodic, measured tone with occasional elven phrases.")
  const [currentNPCId, setCurrentNPCId] = useState<string | null>(null)

  // NPC stats state
  const [stats, setStats] = useState<NPCStats>({
    STR: 10,
    DEX: 14,
    CON: 12,
    INT: 16,
    WIS: 13,
    CHA: 15,
    armorClass: 12,
    hitPoints: 22,
    speed: 30,
    proficiencyBonus: 2,
  })

  // Inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "1", name: "Silk Robes", description: "Fine quality traveling robes" },
    { id: "2", name: "Coin Purse", description: "Contains 50 gold pieces" },
    { id: "3", name: "Merchant's Ledger", description: "Records of recent transactions" },
  ])

  // New inventory item state
  const [newInventoryItem, setNewInventoryItem] = useState<InventoryItem>({
    id: "",
    name: "",
    description: "",
  })

  // Selected theme state
  const [theme, setTheme] = useState("parchment")

  // Form validation setup
  const npcFormValidation = useFormValidation(
    {
      npcName: validateNPCName,
      profession: validateProfession,
      description: validateDescription,
    },
    {
      npcName,
      profession,
      description,
    },
  )

  const inventoryItemValidation = useFormValidation(
    {
      name: validateNPCName, // Reuse name validation
      description: validateDescription,
    },
    {
      name: newInventoryItem.name,
      description: newInventoryItem.description,
    },
  )

  // Update form validation when state changes
  useEffect(() => {
    npcFormValidation.updateField("npcName", npcName)
    npcFormValidation.updateField("profession", profession)
    npcFormValidation.updateField("description", description)
  }, [npcName, profession, description])

  useEffect(() => {
    inventoryItemValidation.updateField("name", newInventoryItem.name)
    inventoryItemValidation.updateField("description", newInventoryItem.description)
  }, [newInventoryItem])

  // Saved NPCs state
  const [savedNPCs, setSavedNPCs] = useState<NPC[]>([])
  const [loadingNPCs, setLoadingNPCs] = useState(false)
  const [savingNPC, setSavingNPC] = useState(false)

  // Load user's NPCs when they sign in
  useEffect(() => {
    if (user && isConfigured) {
      loadUserNPCs()
    }
  }, [user, isConfigured])

  const loadUserNPCs = async () => {
    if (!user || !isConfigured) return

    setLoadingNPCs(true)
    try {
      const npcs = await getUserNPCs()
      setSavedNPCs(npcs)
    } catch (error) {
      console.error("Failed to load NPCs:", error)
      toast({
        title: "Error",
        description: "Failed to load your saved NPCs.",
        variant: "destructive",
      })
    } finally {
      setLoadingNPCs(false)
    }
  }

  // Handle print functionality
  const handlePrint = () => {
    const npcDisplayElement = document.getElementById("npc-display-print")
    if (!npcDisplayElement) {
      alert("Unable to find NPC display for printing")
      return
    }

    openPrintWindow(`${npcName} - NPC Card`, npcDisplayElement)
  }

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOutUser()
      router.push("/home")
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  // Save current NPC
  const handleSaveNPC = async () => {
    if (!user || !isConfigured) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your NPC.",
        variant: "destructive",
      })
      return
    }

    // Validate all NPC form fields
    const npcValidationResult = npcFormValidation.validateAllFields()

    if (!npcValidationResult.isValid) {
      toast({
        title: "Validation Error",
        description: `Please fix the following errors: ${npcValidationResult.errors.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    // Create NPC data object
    const npcData = {
      name: sanitizeString(npcName),
      profession: sanitizeString(profession),
      description: sanitizeString(description),
      vocalNotes: sanitizeString(vocalNotes),
      inventory: inventory.map((item) => ({
        ...item,
        name: sanitizeString(item.name),
        description: sanitizeString(item.description),
      })),
      stats,
      theme,
      creatorId: user?.uid || "",
    }

    // Validate the complete NPC object
    const completeNPCValidation = validateNPC(npcData)

    if (!completeNPCValidation.isValid) {
      toast({
        title: "NPC Validation Failed",
        description: `Please fix the following issues: ${completeNPCValidation.errors.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setSavingNPC(true)
    try {
      if (currentNPCId) {
        // Update existing NPC
        await updateNPC(currentNPCId, npcData)
        toast({
          title: "NPC Updated",
          description: `"${sanitizeString(npcName)}" has been updated successfully.`,
        })
      } else {
        // Save new NPC
        const newNPCId = await saveNPC(npcData)
        setCurrentNPCId(newNPCId)
        toast({
          title: "NPC Saved",
          description: `"${npcName}" has been saved successfully.`,
        })
      }

      // Reload NPCs list
      await loadUserNPCs()
    } catch (error) {
      console.error("Failed to save NPC:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save NPC. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingNPC(false)
    }
  }

  // Load a saved NPC
  const handleLoadNPC = (npc: NPC) => {
    setNpcName(npc.name)
    setProfession(npc.profession)
    setDescription(npc.description)
    setVocalNotes(npc.vocalNotes || "")
    setInventory(npc.inventory || [])
    setStats(npc.stats)
    setTheme(npc.theme || "parchment")
    setCurrentNPCId(npc.id || null)

    toast({
      title: "NPC Loaded",
      description: `"${npc.name}" has been loaded successfully.`,
    })
  }

  // Delete a saved NPC
  const handleDeleteNPC = async (npcId: string, npcName: string) => {
    if (!user || !isConfigured) return

    try {
      await deleteNPC(npcId)

      // If we're currently editing this NPC, clear the current NPC ID
      if (currentNPCId === npcId) {
        setCurrentNPCId(null)
      }

      // Reload NPCs list
      await loadUserNPCs()

      toast({
        title: "NPC Deleted",
        description: `"${npcName}" has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Failed to delete NPC:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete NPC. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Create new NPC
  const handleNewNPC = () => {
    setNpcName("New Character")
    setProfession("Merchant")
    setDescription("A mysterious character with an unknown past.")
    setVocalNotes("Speaks with a neutral tone.")
    setInventory([])
    setStats({
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10,
      armorClass: 10,
      hitPoints: 8,
      speed: 30,
      proficiencyBonus: 2,
    })
    setTheme("parchment")
    setCurrentNPCId(null)

    toast({
      title: "New NPC",
      description: "Started creating a new NPC.",
    })
  }

  // Add new inventory item
  const addInventoryItem = () => {
    // Validate all new inventory item fields
    const validationResult = inventoryItemValidation.validateAllFields()

    if (!validationResult.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before adding the item.",
        variant: "destructive",
      })
      return
    }

    // Additional business logic validation
    if (newInventoryItem.name.trim() === "") {
      toast({
        title: "Invalid Item",
        description: "Item name is required.",
        variant: "destructive",
      })
      return
    }

    // Check for duplicate item names
    const isDuplicate = inventory.some(
      (item) => item.name.toLowerCase().trim() === newInventoryItem.name.toLowerCase().trim(),
    )

    if (isDuplicate) {
      toast({
        title: "Duplicate Item",
        description: "An item with this name already exists.",
        variant: "destructive",
      })
      return
    }

    const item = {
      ...newInventoryItem,
      id: Date.now().toString(),
      name: sanitizeString(newInventoryItem.name),
      description: sanitizeString(newInventoryItem.description),
    }

    setInventory([...inventory, item])
    setNewInventoryItem({
      id: "",
      name: "",
      description: "",
    })

    // Reset validation for new inventory item form
    inventoryItemValidation.resetForm({
      name: "",
      description: "",
    })

    toast({
      title: "Item Added",
      description: `${item.name} has been added to the inventory.`,
    })
  }

  // Remove inventory item
  const removeInventoryItem = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id))
  }

  // Update inventory item
  const updateInventoryItem = (id: string, field: keyof InventoryItem, value: string) => {
    setInventory(inventory.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Update stat
  const updateStat = (statName: keyof NPCStats, value: number) => {
    setStats((prev) => ({ ...prev, [statName]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Determine if user is in free mode (not authenticated but using the app)
  const isFreeMode = !isConfigured || !user
  const displayName = isFreeMode ? "Free Mode User" : user?.displayName || user?.email || "User"

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <div className="max-w-7xl mx-auto p-4 md:p-8 print:hidden">
        {/* Free Mode Alert */}
        {isFreeMode && (
          <Alert className="mb-6 border-amber-600/30 bg-amber-50/80 dark:border-amber-400/30 dark:bg-amber-950/30 print:hidden card-3d">
            <AlertCircle className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-300">
              You're using free mode. Your changes won't be saved.{" "}
              {isConfigured && (
                <Link href="/auth" className="underline font-medium">
                  Sign in to save your work
                </Link>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Header with user info */}
        <div className="mb-8 flex justify-between items-center print:hidden">
          <div>
            <Link href="/home">
              <h1 className="text-3xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer font-fantasy">
                NPC Cards
              </h1>
            </Link>
            <p className="text-muted-foreground">
              {isFreeMode ? "Free Mode - Create without limits!" : `Welcome back, ${displayName}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <PrintButton onPrint={handlePrint} disabled={!npcName} />

            {/* NPC Management Buttons */}
            {user && isConfigured && (
              <>
                <Button onClick={handleNewNPC} variant="outline" size="sm" className="button-3d bg-transparent">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New NPC
                </Button>

                <Button onClick={handleSaveNPC} disabled={savingNPC} size="sm" className="button-3d">
                  <Save className="h-4 w-4 mr-2" />
                  {savingNPC ? "Saving..." : currentNPCId ? "Update NPC" : "Save NPC"}
                </Button>

                {/* Load NPC Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="button-3d bg-transparent">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Load NPC
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Load Saved NPC</DialogTitle>
                      <DialogDescription>Choose an NPC to load into the editor.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-96 overflow-y-auto">
                      {loadingNPCs ? (
                        <div className="text-center py-8">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-muted-foreground">Loading NPCs...</p>
                        </div>
                      ) : savedNPCs.length > 0 ? (
                        <div className="space-y-2">
                          {savedNPCs.map((npc) => (
                            <div
                              key={npc.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div>
                                <h4 className="font-medium">{npc.name}</h4>
                                <p className="text-sm text-muted-foreground">{npc.profession}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button onClick={() => handleLoadNPC(npc)} size="sm" variant="outline">
                                  Load
                                </Button>
                                <Button
                                  onClick={() => handleDeleteNPC(npc.id!, npc.name)}
                                  size="sm"
                                  variant="destructive"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No saved NPCs found. Create and save your first NPC!
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {user && isConfigured && (
              <Button onClick={handleSignOut} variant="outline" size="sm" className="button-3d bg-transparent">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* NPC Creation Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="card-3d">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Define the core details of your NPC character.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ValidatedInput
                  label="Character Name"
                  value={npcName}
                  onChange={setNpcName}
                  onBlur={() => npcFormValidation.touchField("npcName")}
                  errors={npcFormValidation.getFieldErrors("npcName")}
                  isValid={npcFormValidation.isFieldValid("npcName")}
                  hasBeenTouched={npcFormValidation.isFieldTouched("npcName")}
                  placeholder="Enter character name"
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Select value={profession} onValueChange={setProfession}>
                    <SelectTrigger className="input-3d">
                      <SelectValue placeholder="Select profession" />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map((prof) => (
                        <SelectItem key={prof} value={prof}>
                          {prof}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the character's appearance and personality"
                    className="input-3d min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vocalNotes">Vocal Notes</Label>
                  <Textarea
                    id="vocalNotes"
                    value={vocalNotes}
                    onChange={(e) => setVocalNotes(e.target.value)}
                    placeholder="How does this character speak? Accent, tone, mannerisms..."
                    className="input-3d min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Display Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="input-3d">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((themeOption) => (
                        <SelectItem key={themeOption.id} value={themeOption.id}>
                          {themeOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="card-3d">
              <CardHeader>
                <CardTitle>Game Statistics</CardTitle>
                <CardDescription>D&D 5e ability scores and combat stats.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ability Scores */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Ability Scores</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {abilityScores.map((ability) => (
                      <div key={ability} className="space-y-1">
                        <Label htmlFor={ability} className="text-sm font-medium">
                          {ability}
                        </Label>
                        <Input
                          id={ability}
                          type="number"
                          min="1"
                          max="30"
                          value={stats[ability as keyof NPCStats]}
                          onChange={(e) => updateStat(ability as keyof NPCStats, Number.parseInt(e.target.value) || 10)}
                          className="input-3d text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Combat Stats */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Combat Stats</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="armorClass" className="text-sm">
                        Armor Class
                      </Label>
                      <Input
                        id="armorClass"
                        type="number"
                        min="1"
                        max="30"
                        value={stats.armorClass}
                        onChange={(e) => updateStat("armorClass", Number.parseInt(e.target.value) || 10)}
                        className="input-3d"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="hitPoints" className="text-sm">
                        Hit Points
                      </Label>
                      <Input
                        id="hitPoints"
                        type="number"
                        min="1"
                        max="999"
                        value={stats.hitPoints}
                        onChange={(e) => updateStat("hitPoints", Number.parseInt(e.target.value) || 1)}
                        className="input-3d"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="speed" className="text-sm">
                        Speed (ft)
                      </Label>
                      <Input
                        id="speed"
                        type="number"
                        min="0"
                        max="120"
                        value={stats.speed}
                        onChange={(e) => updateStat("speed", Number.parseInt(e.target.value) || 30)}
                        className="input-3d"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="proficiencyBonus" className="text-sm">
                        Proficiency Bonus
                      </Label>
                      <Input
                        id="proficiencyBonus"
                        type="number"
                        min="1"
                        max="6"
                        value={stats.proficiencyBonus}
                        onChange={(e) => updateStat("proficiencyBonus", Number.parseInt(e.target.value) || 2)}
                        className="input-3d"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card className="card-3d">
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Items and equipment this NPC carries.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Item */}
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-medium">Add New Item</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <ValidatedInput
                      label="Item Name"
                      value={newInventoryItem.name}
                      onChange={(value) => setNewInventoryItem((prev) => ({ ...prev, name: value }))}
                      onBlur={() => inventoryItemValidation.touchField("name")}
                      errors={inventoryItemValidation.getFieldErrors("name")}
                      isValid={inventoryItemValidation.isFieldValid("name")}
                      hasBeenTouched={inventoryItemValidation.isFieldTouched("name")}
                      placeholder="Enter item name"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="itemDescription">Description</Label>
                      <Textarea
                        id="itemDescription"
                        value={newInventoryItem.description}
                        onChange={(e) => setNewInventoryItem((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the item"
                        className="input-3d min-h-[60px]"
                      />
                    </div>
                    <Button onClick={addInventoryItem} className="button-3d">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>

                {/* Current Inventory */}
                {inventory.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Current Inventory</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Input
                                value={item.name}
                                onChange={(e) => updateInventoryItem(item.id, "name", e.target.value)}
                                className="input-3d"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.description}
                                onChange={(e) => updateInventoryItem(item.id, "description", e.target.value)}
                                className="input-3d"
                              />
                            </TableCell>
                            <TableCell>
                              <Button onClick={() => removeInventoryItem(item.id)} variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* NPC Display Preview */}
          <div className="lg:sticky lg:top-8">
            <LazyNPCDisplay
              npcName={npcName}
              profession={profession}
              description={description}
              vocalNotes={vocalNotes}
              inventory={inventory}
              stats={stats}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
