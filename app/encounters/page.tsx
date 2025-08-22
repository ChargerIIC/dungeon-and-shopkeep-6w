"use client"

import { DialogDescription } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Save, FolderOpen, Trash, Upload, X, Users, MapPin, Coins, Link2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SharedHeader } from "@/components/shared-header"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import {
  validateEncounterTitle,
  validateEncounterDescription,
  validateNPCName,
  validateNPCRole,
  validateTreasureName,
  validateTreasureValue,
  validateEncounterNotes,
  validateDifficulty,
  validateEnvironment,
  validateTreasureType,
  validatePartyLevel,
  validatePartySize,
  validateEncounter,
  sanitizeString,
  sanitizeInputString,
} from "@/lib/validation"
import { useFormValidation } from "@/hooks/use-validation"
import { ValidatedInput } from "@/components/ui/validated-input"
import {
  saveEncounter,
  updateEncounter,
  getUserEncounters,
  deleteEncounter,
  getUserNPCs,
  uploadMultipleMapFiles, // Added map upload functions
  deleteMapFile,
  type Encounter as FirebaseEncounter,
  type NPC,
} from "@/lib/firebase"
import { PrintButton } from "@/components/print-button"
import { openPrintWindow } from "@/lib/print-utils"

import type React from "react"

// Encounter difficulty levels
const difficultyLevels = ["Easy", "Medium", "Hard", "Deadly"]

// Environment types
const environments = [
  "Dungeon",
  "Forest",
  "Mountain",
  "Desert",
  "Swamp",
  "Urban",
  "Coastal",
  "Underground",
  "Planar",
  "Arctic",
  "Grassland",
  "Hills",
  "Ruins",
  "Temple",
  "Castle",
]

// Treasure types
const treasureTypes = ["Coins", "Gems", "Art Objects", "Magic Items", "Equipment", "Consumables"]

// Encounter types
interface EncounterNPC {
  id: string
  name: string
  role: string
  notes: string
  linkedNPCId?: string
  linkedNPCData?: NPC
}

interface TreasureItem {
  id: string
  name: string
  type: string
  value: string
  description: string
}

interface MapAttachment {
  id: string
  name: string
  file: File | null
  preview: string
  url?: string // Added optional URL for uploaded maps
  uploading?: boolean // Added uploading state
}

interface Encounter {
  id?: string
  title: string
  description: string
  difficulty: string
  environment: string
  partyLevel: number
  partySize: number
  npcs: EncounterNPC[]
  treasures: TreasureItem[]
  maps: MapAttachment[]
  notes: string
  creatorId: string
  createdAt: Date
  updatedAt: Date
}

export default function EncounterDesigner() {
  const { user, loading, isConfigured } = useAuth()

  // Encounter state
  const [encounter, setEncounter] = useState<Encounter>({
    title: "New Encounter",
    description: "",
    difficulty: "Medium",
    environment: "Dungeon",
    partyLevel: 1,
    partySize: 4,
    npcs: [],
    treasures: [],
    maps: [],
    notes: "",
    creatorId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const [currentEncounterId, setCurrentEncounterId] = useState<string | null>(null)

  // New item states
  const [newNPC, setNewNPC] = useState<EncounterNPC>({
    id: "",
    name: "",
    role: "",
    notes: "",
  })

  const [newTreasure, setNewTreasure] = useState<TreasureItem>({
    id: "",
    name: "",
    type: "Coins",
    value: "",
    description: "",
  })

  // Loading states
  const [savingEncounter, setSavingEncounter] = useState(false)
  const [savedEncounters, setSavedEncounters] = useState<FirebaseEncounter[]>([])
  const [loadingEncounters, setLoadingEncounters] = useState(false)
  const [savedNPCs, setSavedNPCs] = useState<NPC[]>([])
  const [loadingNPCs, setLoadingNPCs] = useState(false)
  const [uploadingMaps, setUploadingMaps] = useState(false) // Added map upload state

  const encounterFormValidation = useFormValidation(
    {
      title: validateEncounterTitle,
      description: validateEncounterDescription,
      difficulty: validateDifficulty,
      environment: validateEnvironment,
      partyLevel: validatePartyLevel,
      partySize: validatePartySize,
      notes: validateEncounterNotes,
    },
    {
      title: encounter.title,
      description: encounter.description,
      difficulty: encounter.difficulty,
      environment: encounter.environment,
      partyLevel: encounter.partyLevel,
      partySize: encounter.partySize,
      notes: encounter.notes,
    },
  )

  const newNPCValidation = useFormValidation(
    {
      name: validateNPCName,
      role: validateNPCRole,
    },
    {
      name: newNPC.name,
      role: newNPC.role,
    },
  )

  const newTreasureValidation = useFormValidation(
    {
      name: validateTreasureName,
      type: validateTreasureType,
      value: validateTreasureValue,
    },
    {
      name: newTreasure.name,
      type: newTreasure.type,
      value: newTreasure.value,
    },
  )

  useEffect(() => {
    encounterFormValidation.updateField("title", encounter.title)
    encounterFormValidation.updateField("description", encounter.description)
    encounterFormValidation.updateField("difficulty", encounter.difficulty)
    encounterFormValidation.updateField("environment", encounter.environment)
    encounterFormValidation.updateField("partyLevel", encounter.partyLevel)
    encounterFormValidation.updateField("partySize", encounter.partySize)
    encounterFormValidation.updateField("notes", encounter.notes)
  }, [encounter])

  useEffect(() => {
    newNPCValidation.updateField("name", newNPC.name)
    newNPCValidation.updateField("role", newNPC.role)
  }, [newNPC])

  useEffect(() => {
    newTreasureValidation.updateField("name", newTreasure.name)
    newTreasureValidation.updateField("type", newTreasure.type)
    newTreasureValidation.updateField("value", newTreasure.value)
  }, [newTreasure])

  useEffect(() => {
    if (user && isConfigured) {
      loadUserEncounters()
      loadUserNPCs() // Load user NPCs when authenticated
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

  const loadUserEncounters = async () => {
    if (!user || !isConfigured) return

    setLoadingEncounters(true)
    try {
      const encounters = await getUserEncounters()
      setSavedEncounters(encounters)
    } catch (error) {
      console.error("Failed to load encounters:", error)
      toast({
        title: "Error",
        description: "Failed to load your saved encounters.",
        variant: "destructive",
      })
    } finally {
      setLoadingEncounters(false)
    }
  }

  const handleSaveEncounter = async () => {
    if (!user || !isConfigured) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your encounter.",
        variant: "destructive",
      })
      return
    }

    const encounterValidationResult = encounterFormValidation.validateAllFields()

    if (!encounterValidationResult.isValid) {
      toast({
        title: "Validation Error",
        description: `Please fix the following errors: ${encounterValidationResult.errors.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    const hasUploadingMaps = encounter.maps.some((map) => map.uploading)
    if (hasUploadingMaps) {
      toast({
        title: "Upload in Progress",
        description: "Please wait for all maps to finish uploading before saving.",
        variant: "destructive",
      })
      return
    }

    const encounterData = {
      title: sanitizeString(encounter.title),
      description: sanitizeString(encounter.description),
      difficulty: encounter.difficulty,
      environment: encounter.environment,
      partyLevel: encounter.partyLevel,
      partySize: encounter.partySize,
      npcs: encounter.npcs.map((npc) => ({
        ...npc,
        name: sanitizeString(npc.name),
        role: sanitizeString(npc.role),
        notes: sanitizeString(npc.notes),
      })),
      treasures: encounter.treasures.map((treasure) => ({
        ...treasure,
        name: sanitizeString(treasure.name),
        value: sanitizeString(treasure.value),
        description: sanitizeString(treasure.description),
      })),
      maps: encounter.maps.map((map) => ({
        id: map.id,
        name: sanitizeString(map.name),
        url: map.url || "", // Use uploaded URL or empty string
      })),
      notes: sanitizeString(encounter.notes),
      creatorId: user?.uid || "",
    }

    const completeEncounterValidation = validateEncounter(encounterData)

    if (!completeEncounterValidation.isValid) {
      toast({
        title: "Encounter Validation Failed",
        description: `Please fix the following issues: ${completeEncounterValidation.errors.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setSavingEncounter(true)
    try {
      if (currentEncounterId) {
        await updateEncounter(currentEncounterId, encounterData)
        toast({
          title: "Encounter Updated",
          description: `"${sanitizeString(encounter.title)}" has been updated successfully.`,
        })
      } else {
        const newEncounterId = await saveEncounter(encounterData)
        setCurrentEncounterId(newEncounterId)
        toast({
          title: "Encounter Saved",
          description: `"${encounter.title}" has been saved successfully.`,
        })
      }

      await loadUserEncounters()
    } catch (error) {
      console.error("Failed to save encounter:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save encounter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingEncounter(false)
    }
  }

  const handlePrint = () => {
    const encounterDisplayElement = document.getElementById("encounter-display-print")
    if (!encounterDisplayElement) {
      alert("Unable to find encounter display for printing")
      return
    }
    openPrintWindow(`${encounter.title} - Encounter`, encounterDisplayElement)
  }

  const handleLoadEncounter = (savedEncounter: FirebaseEncounter) => {
    setEncounter({
      ...savedEncounter,
      maps: savedEncounter.maps.map((map) => ({
        ...map,
        file: null,
        preview: map.url || "",
        url: map.url, // Preserve the uploaded URL
      })),
      createdAt: savedEncounter.createdAt,
      updatedAt: savedEncounter.updatedAt,
    })
    setCurrentEncounterId(savedEncounter.id || null)

    toast({
      title: "Encounter Loaded",
      description: `"${savedEncounter.title}" has been loaded successfully.`,
    })
  }

  const handleDeleteEncounter = async (encounterId: string, encounterTitle: string) => {
    if (!user || !isConfigured) return

    try {
      await deleteEncounter(encounterId)

      if (currentEncounterId === encounterId) {
        setCurrentEncounterId(null)
      }

      await loadUserEncounters()

      toast({
        title: "Encounter Deleted",
        description: `"${encounterTitle}" has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Failed to delete encounter:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete encounter. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleNewEncounter = () => {
    setEncounter({
      title: "New Encounter",
      description: "",
      difficulty: "Medium",
      environment: "Dungeon",
      partyLevel: 1,
      partySize: 4,
      npcs: [],
      treasures: [],
      maps: [],
      notes: "",
      creatorId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    setCurrentEncounterId(null)

    toast({
      title: "New Encounter",
      description: "Started creating a new encounter.",
    })
  }

  const addNPC = () => {
    const validationResult = newNPCValidation.validateAllFields()

    if (!validationResult.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before adding the NPC.",
        variant: "destructive",
      })
      return
    }

    if (!newNPC.name.trim()) {
      toast({
        title: "Invalid NPC",
        description: "NPC name is required.",
        variant: "destructive",
      })
      return
    }

    const npc = {
      ...newNPC,
      id: Date.now().toString(),
      name: sanitizeString(newNPC.name),
      role: sanitizeString(newNPC.role),
    }

    setEncounter((prev) => ({
      ...prev,
      npcs: [...prev.npcs, npc],
    }))

    setNewNPC({
      id: "",
      name: "",
      role: "",
      notes: "",
    })

    newNPCValidation.resetForm({
      name: "",
      role: "",
    })

    toast({
      title: "NPC Added",
      description: `${npc.name} has been added to the encounter.`,
    })
  }

  const linkSavedNPC = (savedNPC: NPC) => {
    const encounterNPC: EncounterNPC = {
      id: Date.now().toString(),
      name: savedNPC.name,
      role: savedNPC.profession, // Use profession as role
      notes: `Linked NPC: ${savedNPC.description}`,
      linkedNPCId: savedNPC.id,
      linkedNPCData: savedNPC,
    }

    setEncounter((prev) => ({
      ...prev,
      npcs: [...prev.npcs, encounterNPC],
    }))

    toast({
      title: "NPC Linked",
      description: `${savedNPC.name} has been linked to the encounter.`,
    })
  }

  const unlinkNPC = (npcId: string) => {
    setEncounter((prev) => ({
      ...prev,
      npcs: prev.npcs.map((npc) =>
        npc.id === npcId
          ? {
              ...npc,
              linkedNPCId: undefined,
              linkedNPCData: undefined,
              notes: npc.notes.replace(/^Linked NPC: /, ""),
            }
          : npc,
      ),
    }))

    toast({
      title: "NPC Unlinked",
      description: "NPC has been converted to a regular encounter NPC.",
    })
  }

  const removeNPC = (id: string) => {
    setEncounter((prev) => ({
      ...prev,
      npcs: prev.npcs.filter((npc) => npc.id !== id),
    }))
  }

  const addTreasure = () => {
    const validationResult = newTreasureValidation.validateAllFields()

    if (!validationResult.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before adding the treasure.",
        variant: "destructive",
      })
      return
    }

    if (!newTreasure.name.trim()) {
      toast({
        title: "Invalid Treasure",
        description: "Treasure name is required.",
        variant: "destructive",
      })
      return
    }

    const treasure = {
      ...newTreasure,
      id: Date.now().toString(),
      name: sanitizeString(newTreasure.name),
      value: sanitizeString(newTreasure.value),
      description: sanitizeString(newTreasure.description),
    }

    setEncounter((prev) => ({
      ...prev,
      treasures: [...prev.treasures, treasure],
    }))

    setNewTreasure({
      id: "",
      name: "",
      type: "Coins",
      value: "",
      description: "",
    })

    newTreasureValidation.resetForm({
      name: "",
      type: "Coins",
      value: "",
    })

    toast({
      title: "Treasure Added",
      description: `${treasure.name} has been added to the encounter.`,
    })
  }

  const removeTreasure = (id: string) => {
    setEncounter((prev) => ({
      ...prev,
      treasures: prev.treasures.filter((treasure) => treasure.id !== id),
    }))
  }

  const handleMapUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !user || !isConfigured) return

    const validFiles = Array.from(files).filter((file) => {
      if (file.type.startsWith("image/")) {
        return true
      } else {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a valid image file. Only image files are supported.`,
          variant: "destructive",
        })
        return false
      }
    })

    if (validFiles.length === 0) return

    const tempEncounterId = currentEncounterId || `temp_${Date.now()}`

    // Add files to state with uploading status
    const newMaps: MapAttachment[] = validFiles.map((file, index) => ({
      id: `${Date.now()}_${index}`,
      name: file.name,
      file: file,
      preview: "",
      uploading: true,
    }))

    // Add maps to encounter state
    setEncounter((prev) => ({
      ...prev,
      maps: [...prev.maps, ...newMaps],
    }))

    // Generate previews
    validFiles.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEncounter((prev) => ({
          ...prev,
          maps: prev.maps.map((map) =>
            map.id === newMaps[index].id ? { ...map, preview: e.target?.result as string } : map,
          ),
        }))
      }
      reader.readAsDataURL(file)
    })

    // Upload files to Firebase Storage
    setUploadingMaps(true)
    try {
      const uploadResults = await uploadMultipleMapFiles(validFiles, tempEncounterId, (progress, fileName) => {
        // Update progress if needed
        console.log(`Upload progress for ${fileName}: ${progress}%`)
      })

      // Update maps with upload results
      setEncounter((prev) => ({
        ...prev,
        maps: prev.maps.map((map) => {
          const uploadResult = uploadResults.find((result) => result.name === map.name)
          if (uploadResult) {
            return {
              ...map,
              url: uploadResult.url,
              uploading: false,
            }
          }
          return map
        }),
      }))

      toast({
        title: "Maps Uploaded",
        description: `${uploadResults.length} map(s) uploaded successfully.`,
      })
    } catch (error) {
      console.error("Failed to upload maps:", error)

      // Remove failed uploads from state
      setEncounter((prev) => ({
        ...prev,
        maps: prev.maps.filter((map) => !newMaps.some((newMap) => newMap.id === map.id)),
      }))

      toast({
        title: "Upload Failed",
        description: "Failed to upload some maps. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingMaps(false)
    }

    // Clear the input
    event.target.value = ""
  }

  const removeMap = async (id: string) => {
    const mapToRemove = encounter.maps.find((map) => map.id === id)

    // Remove from state first
    setEncounter((prev) => ({
      ...prev,
      maps: prev.maps.filter((map) => map.id !== id),
    }))

    if (mapToRemove?.url && user && isConfigured) {
      try {
        await deleteMapFile(mapToRemove.url)
      } catch (error) {
        console.warn("Failed to delete map file from storage:", error)
        // Don't show error to user as the map is already removed from the encounter
      }
    }
  }

  const isFreeMode = !isConfigured || !user
  const displayName = isFreeMode ? "Free Mode User" : user?.displayName || user?.email || "User"

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {isFreeMode && (
          <Alert className="mb-6 border-amber-600/30 bg-amber-50/80 dark:border-amber-400/30 dark:bg-amber-950/30 card-3d">
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

        <div className="mb-8 flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-fantasy">Encounter Designer</h1>
            <p className="text-muted-foreground">
              {isFreeMode ? "Free Mode - Create without limits!" : `Welcome back, ${displayName}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {user && isConfigured && (
              <>
                <Button
                  onClick={handleNewEncounter}
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
                      disabled={loadingEncounters}
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>Load</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="card-3d max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-fantasy">Load Saved Encounter</DialogTitle>
                      <DialogDescription>Choose an encounter to load from your saved collection.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-96 overflow-y-auto">
                      {loadingEncounters ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : savedEncounters.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">No saved encounters found.</p>
                      ) : (
                        <div className="space-y-2">
                          {savedEncounters.map((savedEncounter) => (
                            <div
                              key={savedEncounter.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">{savedEncounter.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {savedEncounter.difficulty} • {savedEncounter.environment} • Level{" "}
                                  {savedEncounter.partyLevel} • {savedEncounter.npcs.length} NPCs •{" "}
                                  {savedEncounter.treasures.length} treasures
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Updated: {savedEncounter.updatedAt.toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleLoadEncounter(savedEncounter)}
                                  className="button-3d text-primary-foreground"
                                >
                                  Load
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteEncounter(savedEncounter.id!, savedEncounter.title)}
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
                  onClick={handleSaveEncounter}
                  size="sm"
                  disabled={savingEncounter}
                  className="flex items-center space-x-2 button-3d text-primary-foreground"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingEncounter ? "Saving..." : currentEncounterId ? "Update" : "Save"}</span>
                </Button>
              </>
            )}

            <PrintButton onPrint={handlePrint} disabled={!encounter.title} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <Card className="card-3d paper-texture">
              <CardHeader className="wood-grain">
                <CardTitle className="text-2xl font-bold text-foreground font-fantasy">Encounter Designer</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Create detailed D&D 5e encounters with NPCs, treasures, and maps
                </CardDescription>
              </CardHeader>
              <CardContent className="paper-texture space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ValidatedInput
                    id="encounter-title"
                    label="Encounter Title"
                    value={encounter.title}
                    onChange={(value) => setEncounter((prev) => ({ ...prev, title: sanitizeInputString(value) }))}
                    onBlur={() => encounterFormValidation.markFieldAsTouched("title")}
                    placeholder="Enter encounter name"
                    required
                    {...encounterFormValidation.getFieldState("title")}
                    helperText="Enter a descriptive name for your encounter (1-100 characters)"
                  />
                  <div>
                    <Label htmlFor="difficulty" className="text-foreground font-medium">
                      Difficulty
                    </Label>
                    <Select
                      value={encounter.difficulty}
                      onValueChange={(value) => setEncounter((prev) => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger id="difficulty" className="input-3d mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="card-3d">
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level} value={level} className="hover:bg-accent/50">
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="environment" className="text-foreground font-medium">
                      Environment
                    </Label>
                    <Select
                      value={encounter.environment}
                      onValueChange={(value) => setEncounter((prev) => ({ ...prev, environment: value }))}
                    >
                      <SelectTrigger id="environment" className="input-3d mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="card-3d">
                        {environments.map((env) => (
                          <SelectItem key={env} value={env} className="hover:bg-accent/50">
                            {env}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="party-level" className="text-foreground font-medium">
                        Party Level
                      </Label>
                      <Input
                        id="party-level"
                        type="number"
                        min="1"
                        max="20"
                        value={encounter.partyLevel}
                        onChange={(e) =>
                          setEncounter((prev) => ({ ...prev, partyLevel: Number.parseInt(e.target.value) || 1 }))
                        }
                        className="input-3d mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="party-size" className="text-foreground font-medium">
                        Party Size
                      </Label>
                      <Input
                        id="party-size"
                        type="number"
                        min="1"
                        max="10"
                        value={encounter.partySize}
                        onChange={(e) =>
                          setEncounter((prev) => ({ ...prev, partySize: Number.parseInt(e.target.value) || 4 }))
                        }
                        className="input-3d mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={encounter.description}
                    onChange={(e) =>
                      setEncounter((prev) => ({ ...prev, description: sanitizeInputString(e.target.value) }))
                    }
                    onBlur={() => encounterFormValidation.markFieldAsTouched("description")}
                    placeholder="Describe the encounter setup, environment details, and initial conditions..."
                    className="input-3d mt-2 min-h-[100px]"
                  />
                  {encounterFormValidation.getFieldState("description").hasBeenTouched &&
                    !encounterFormValidation.getFieldState("description").isValid && (
                      <div className="mt-1 space-y-1">
                        {encounterFormValidation.getFieldState("description").errors.map((error, index) => (
                          <p key={index} className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                </div>

                {/* NPCs Section */}
                <div className="border rounded-lg p-4 card-3d">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="font-medium text-foreground font-fantasy">NPCs & Creatures</h3>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2 button-3d bg-transparent text-primary-foreground"
                          disabled={loadingNPCs}
                        >
                          <Link2 className="w-4 h-4" />
                          <span>Link Saved NPC</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="card-3d max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="font-fantasy">Link Saved NPC</DialogTitle>
                          <DialogDescription>
                            Choose an NPC from your saved collection to link to this encounter.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-96 overflow-y-auto">
                          {loadingNPCs ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : !user || !isConfigured ? (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground mb-4">Please sign in to access your saved NPCs.</p>
                            </div>
                          ) : savedNPCs.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground mb-4">No saved NPCs found.</p>
                              <Link href="/npc-cards">
                                <Button className="button-3d text-primary-foreground">Create NPCs</Button>
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {savedNPCs.map((savedNPC) => (
                                <div
                                  key={savedNPC.id}
                                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                  <div className="flex-1">
                                    <h4 className="font-medium text-foreground">{savedNPC.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {savedNPC.profession} • AC {savedNPC.stats.armorClass} • HP{" "}
                                      {savedNPC.stats.hitPoints}
                                    </p>
                                    {savedNPC.description && (
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {savedNPC.description}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => linkSavedNPC(savedNPC)}
                                    className="button-3d text-primary-foreground"
                                  >
                                    Link
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <ValidatedInput
                      placeholder="NPC/Creature name"
                      value={newNPC.name}
                      onChange={(value) => setNewNPC((prev) => ({ ...prev, name: sanitizeInputString(value) }))}
                      onBlur={() => newNPCValidation.markFieldAsTouched("name")}
                      required
                      {...newNPCValidation.getFieldState("name")}
                      helperText="Enter NPC name (1-50 characters)"
                    />
                    <ValidatedInput
                      placeholder="Role (e.g., Boss, Minion, Ally)"
                      value={newNPC.role}
                      onChange={(value) => setNewNPC((prev) => ({ ...prev, role: sanitizeInputString(value) }))}
                      onBlur={() => newNPCValidation.markFieldAsTouched("role")}
                      {...newNPCValidation.getFieldState("role")}
                      helperText="Optional role description"
                    />
                    <Button onClick={addNPC} className="button-3d text-primary-foreground">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add NPC
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {encounter.npcs.map((npc) => (
                      <div
                        key={npc.id}
                        className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent/30 transition-colors ${
                          npc.linkedNPCId ? "border-primary/50 bg-primary/5" : ""
                        }`} // Added visual distinction for linked NPCs
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-foreground">{npc.name}</div>
                            {npc.linkedNPCId && (
                              <div className="flex items-center gap-1 text-xs text-primary">
                                <Link2 className="w-3 h-3" />
                                <span>Linked</span>
                              </div>
                            )}
                          </div>
                          {npc.role && <div className="text-sm text-muted-foreground">{npc.role}</div>}
                          {npc.linkedNPCData && (
                            <div className="text-xs text-muted-foreground mt-1">
                              AC {npc.linkedNPCData.stats.armorClass} • HP {npc.linkedNPCData.stats.hitPoints} • Speed{" "}
                              {npc.linkedNPCData.stats.speed}ft
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {npc.linkedNPCId && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => unlinkNPC(npc.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                              title="Unlink NPC"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeNPC(npc.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {encounter.npcs.length === 0 && (
                      <p className="text-center py-4 text-muted-foreground italic">No NPCs added yet.</p>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4 card-3d">
                  <div className="flex items-center gap-2 mb-4">
                    <Coins className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-foreground font-fantasy">Treasures & Rewards</h3>
                  </div>

                  <div className="space-y-4 mb-4">
                    {/* Row 1: Treasure name input */}
                    <div>
                      <ValidatedInput
                        placeholder="Treasure name"
                        value={newTreasure.name}
                        onChange={(value) => setNewTreasure((prev) => ({ ...prev, name: sanitizeInputString(value) }))}
                        onBlur={() => newTreasureValidation.markFieldAsTouched("name")}
                        required
                        {...newTreasureValidation.getFieldState("name")}
                        helperText="Enter treasure name"
                      />
                    </div>

                    {/* Row 2: Value input */}
                    <div>
                      <Label className="text-foreground font-medium">Value (Optional)</Label>
                      <ValidatedInput
                        placeholder="Value (e.g., 100 gp)"
                        value={newTreasure.value}
                        onChange={(value) => setNewTreasure((prev) => ({ ...prev, value: sanitizeInputString(value) }))}
                        onBlur={() => newTreasureValidation.markFieldAsTouched("value")}
                        {...newTreasureValidation.getFieldState("value")}
                      />
                    </div>

                    {/* Row 3: Add Treasure button */}
                    <div>
                      <Button onClick={addTreasure} className="button-3d text-primary-foreground">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Treasure
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {encounter.treasures.map((treasure) => (
                      <div
                        key={treasure.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/30 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{treasure.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {treasure.type} • {treasure.value}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTreasure(treasure.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {encounter.treasures.length === 0 && (
                      <p className="text-center py-4 text-muted-foreground italic">No treasures added yet.</p>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4 card-3d">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-foreground font-fantasy">Battle Maps</h3>
                  </div>

                  {/* Upload Maps */}
                  <div className="mb-4">
                    <Label htmlFor="map-upload" className="cursor-pointer">
                      <div
                        className={`border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors ${uploadingMaps ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {uploadingMaps ? "Uploading maps..." : "Click to upload image files or drag and drop"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports PNG, JPG, JPEG, GIF, and WebP formats
                        </p>
                      </div>
                    </Label>
                    <Input
                      id="map-upload"
                      type="file"
                      accept="image/*" // Accept all image types
                      multiple
                      onChange={handleMapUpload}
                      className="hidden"
                      disabled={uploadingMaps || !user || !isConfigured}
                    />
                    {!user ||
                      (!isConfigured && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Sign in to upload and save maps permanently
                        </p>
                      ))}
                  </div>

                  {/* Maps List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {encounter.maps.map((map) => (
                      <div key={map.id} className="border rounded-lg p-3 card-3d">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground truncate">{map.name}</span>
                          <div className="flex items-center space-x-2">
                            {map.uploading && (
                              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            )}
                            {map.url && !map.uploading && (
                              <div className="w-2 h-2 bg-green-500 rounded-full" title="Uploaded" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMap(map.id)}
                              className="h-6 w-6 text-destructive hover:text-destructive-foreground hover:bg-destructive/20"
                              disabled={map.uploading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {map.preview && (
                          <div className="relative">
                            <img
                              src={map.preview || "/placeholder.svg"}
                              alt={map.name}
                              className={`w-full h-32 object-cover rounded border ${map.uploading ? "opacity-50" : ""}`}
                            />
                            {map.uploading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                                <div className="text-white text-sm">Uploading...</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {encounter.maps.length === 0 && (
                      <p className="text-center py-4 text-muted-foreground italic col-span-full">
                        No maps uploaded yet.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-foreground font-medium">
                    DM Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={encounter.notes}
                    onChange={(e) => setEncounter((prev) => ({ ...prev, notes: sanitizeInputString(e.target.value) }))}
                    onBlur={() => encounterFormValidation.markFieldAsTouched("notes")}
                    placeholder="Add any additional notes, tactics, or reminders for running this encounter..."
                    className="input-3d mt-2 min-h-[100px]"
                  />
                  {encounterFormValidation.getFieldState("notes").hasBeenTouched &&
                    !encounterFormValidation.getFieldState("notes").isValid && (
                      <div className="mt-1 space-y-1">
                        {encounterFormValidation.getFieldState("notes").errors.map((error, index) => (
                          <p key={index} className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <Card className="card-3d paper-texture" id="encounter-display-print">
              <CardHeader>
                <CardTitle className="text-foreground font-fantasy">Encounter Preview</CardTitle>
                <CardDescription className="text-muted-foreground">Preview of your encounter design</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground font-fantasy">{encounter.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{encounter.difficulty} Difficulty</span>
                    <span>{encounter.environment}</span>
                    <span>Level {encounter.partyLevel}</span>
                    <span>{encounter.partySize} Players</span>
                  </div>
                </div>

                {encounter.description && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{encounter.description}</p>
                  </div>
                )}

                {encounter.npcs.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">NPCs & Creatures ({encounter.npcs.length})</h4>
                    <div className="space-y-1">
                      {encounter.npcs.map((npc) => (
                        <div key={npc.id} className="text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{npc.name}</span>
                            {npc.linkedNPCId && (
                              <div className="flex items-center gap-1 text-xs text-primary">
                                <Link2 className="w-3 h-3" />
                              </div>
                            )}
                            {npc.role && <span className="text-muted-foreground"> - {npc.role}</span>}
                          </div>
                          {npc.linkedNPCData && (
                            <div className="text-xs text-muted-foreground ml-4">
                              AC {npc.linkedNPCData.stats.armorClass}, HP {npc.linkedNPCData.stats.hitPoints}, Speed{" "}
                              {npc.linkedNPCData.stats.speed}ft
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {encounter.treasures.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Treasures ({encounter.treasures.length})</h4>
                    <div className="space-y-1">
                      {encounter.treasures.map((treasure) => (
                        <div key={treasure.id} className="text-sm">
                          <span className="font-medium text-foreground">{treasure.name}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            ({treasure.type}, {treasure.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {encounter.maps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Battle Maps ({encounter.maps.length})</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {encounter.maps.map((map) => (
                        <div key={map.id} className="text-xs text-center">
                          {map.preview && (
                            <img
                              src={map.preview || "/placeholder.svg"}
                              alt={map.name}
                              className="w-full h-16 object-cover rounded border mb-1"
                            />
                          )}
                          <span className="text-muted-foreground truncate block">{map.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {encounter.notes && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">DM Notes</h4>
                    <p className="text-sm text-muted-foreground">{encounter.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
