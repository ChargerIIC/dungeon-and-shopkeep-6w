"use client"
import { useState, useEffect } from "react"
import { PlusCircle, Trash2, LogOut, User, AlertCircle, Package2, Save, FolderOpen, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { useAuth } from "@/components/auth-provider"
import { signOutUser, saveShop, updateShop, getUserShops, deleteShop, type Shop } from "@/lib/firebase"
import { openPrintWindow } from "@/lib/print-utils"
import {
  validateShopTitle,
  validateOwnerName,
  validateItemName,
  validateItemPrice,
  validateItemCategory,
  validateItemCurrency,
  validateTheme,
  validateShop,
  sanitizeString,
  sanitizeInputString,
} from "@/lib/validation"
import { useFormValidation } from "@/hooks/use-validation"
import { ValidatedInput } from "@/components/ui/validated-input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { commonItems } from "@/app/shopkeeper/commonItems"
import { SharedHeader } from "@/components/shared-header"
import { LazyShopDisplay } from "@/lib/lazy-components"

// Item categories
const categories = ["Weapon", "MartialWeapon", "Armor", "Potions", "Gear", "Scroll", "Misc"]
// Currency types
const currencies = ["GP", "SP", "CP"]
// Theme options
const themes = [
  { id: "parchment", name: "Parchment" },
  { id: "tavern", name: "Tavern" },
  { id: "arcane", name: "Arcane" },
  { id: "forest", name: "Forest" },
  { id: "dungeon", name: "Dungeon" },
]

// Pre-configured common items by category
type CommonItem = {
  name: string
  price: number
  currency: string
}

export type CommonItemsByCategory = {
  [key in (typeof categories)[number]]: CommonItem[]
}

// Item type definition
type Item = {
  id: string
  name: string
  category: string
  price: number
  currency: string
}

export default function ShopCreator() {
  const { user, loading, isConfigured } = useAuth()
  const router = useRouter()

  // Shop details state
  const [shopTitle, setShopTitle] = useState("Mystic Emporium")
  const [ownerName, setOwnerName] = useState("Eldrin the Merchant")
  const [currentShopId, setCurrentShopId] = useState<string | null>(null)

  // Items state
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Steel Longsword", category: "Weapon", price: 15, currency: "GP" },
    { id: "2", name: "Leather Armor", category: "Armor", price: 10, currency: "GP" },
    { id: "3", name: "Healing Potion", category: "Potions", price: 50, currency: "SP" },
    { id: "4", name: "Backpack", category: "Gear", price: 2, currency: "GP" },
    { id: "5", name: "Fireball Scroll", category: "Scroll", price: 150, currency: "GP" },
  ])

  // New item state
  const [newItem, setNewItem] = useState<Item>({
    id: "",
    name: "",
    category: "Weapon",
    price: 0,
    currency: "GP",
  })

  // Selected theme state
  const [theme, setTheme] = useState("parchment")

  // Form validation setup
  const shopFormValidation = useFormValidation(
    {
      shopTitle: validateShopTitle,
      ownerName: validateOwnerName,
      theme: validateTheme,
    },
    {
      shopTitle,
      ownerName,
      theme,
    },
  )

  const newItemValidation = useFormValidation(
    {
      name: validateItemName,
      category: validateItemCategory,
      price: validateItemPrice,
      currency: validateItemCurrency,
    },
    {
      name: newItem.name,
      category: newItem.category,
      price: newItem.price,
      currency: newItem.currency,
    },
  )

  // Update form validation when state changes
  useEffect(() => {
    shopFormValidation.updateField("shopTitle", shopTitle)
  }, [shopTitle])

  useEffect(() => {
    shopFormValidation.updateField("ownerName", ownerName)
  }, [ownerName])

  useEffect(() => {
    shopFormValidation.updateField("theme", theme)
  }, [theme])

  useEffect(() => {
    newItemValidation.updateField("name", newItem.name)
    newItemValidation.updateField("category", newItem.category)
    newItemValidation.updateField("price", newItem.price)
    newItemValidation.updateField("currency", newItem.currency)
  }, [newItem])

  // Selected category for common items
  const [selectedCommonCategory, setSelectedCommonCategory] = useState<string>("")

  // Saved shops state
  const [savedShops, setSavedShops] = useState<Shop[]>([])
  const [loadingShops, setLoadingShops] = useState(false)
  const [savingShop, setSavingShop] = useState(false)

  // Load user's shops when they sign in
  useEffect(() => {
    if (user && isConfigured) {
      loadUserShops()
    }
  }, [user, isConfigured])

  const loadUserShops = async () => {
    if (!user || !isConfigured) return

    setLoadingShops(true)
    try {
      const shops = await getUserShops()
      setSavedShops(shops)
    } catch (error) {
      console.error("Failed to load shops:", error)
      toast({
        title: "Error",
        description: "Failed to load your saved shops.",
        variant: "destructive",
      })
    } finally {
      setLoadingShops(false)
    }
  }

  // Handle print functionality
  const handlePrint = () => {
    // Get the shop display content
    const shopDisplayElement = document.getElementById("shop-display-print")
    if (!shopDisplayElement) {
      alert("Unable to find shop display for printing")
      return
    }

    // Use the print utility to open the print window
    openPrintWindow(shopTitle, shopDisplayElement)
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

  // Save current shop
  const handleSaveShop = async () => {
    if (!user || !isConfigured) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your shop.",
        variant: "destructive",
      })
      return
    }

    // Validate all shop form fields
    const shopValidationResult = shopFormValidation.validateAllFields()

    if (!shopValidationResult.isValid) {
      toast({
        title: "Validation Error",
        description: `Please fix the following errors: ${shopValidationResult.errors.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    // Validate the complete shop object
    const shopData = {
      title: sanitizeString(shopTitle),
      owner: sanitizeString(ownerName),
      items: items.map((item) => ({
        ...item,
        name: sanitizeString(item.name),
      })),
      theme: theme,
      creatorId: user?.uid || "",
    }

    const completeShopValidation = validateShop(shopData)

    if (!completeShopValidation.isValid) {
      toast({
        title: "Shop Validation Failed",
        description: `Please fix the following issues: ${completeShopValidation.errors.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setSavingShop(true)
    try {
      if (currentShopId) {
        // Update existing shop
        await updateShop(currentShopId, shopData)
        toast({
          title: "Shop Updated",
          description: `"${sanitizeString(shopTitle)}" has been updated successfully.`,
        })
      } else {
        // Save new shop
        const newShopId = await saveShop(shopData)
        setCurrentShopId(newShopId)
        toast({
          title: "Shop Saved",
          description: `"${shopTitle}" has been saved successfully.`,
        })
      }

      // Reload shops list
      await loadUserShops()
    } catch (error) {
      console.error("Failed to save shop:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save shop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingShop(false)
    }
  }

  // Load a saved shop
  const handleLoadShop = (shop: Shop) => {
    setShopTitle(shop.title)
    setOwnerName(shop.owner)
    setItems(shop.items)
    setTheme(shop.theme)
    setCurrentShopId(shop.id || null)

    toast({
      title: "Shop Loaded",
      description: `"${shop.title}" has been loaded successfully.`,
    })
  }

  // Delete a saved shop
  const handleDeleteShop = async (shopId: string, shopTitle: string) => {
    if (!user || !isConfigured) return

    try {
      await deleteShop(shopId)

      // If we're currently editing this shop, clear the current shop ID
      if (currentShopId === shopId) {
        setCurrentShopId(null)
      }

      // Reload shops list
      await loadUserShops()

      toast({
        title: "Shop Deleted",
        description: `"${shopTitle}" has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Failed to delete shop:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete shop. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Create new shop
  const handleNewShop = () => {
    setShopTitle("New Shop")
    setOwnerName("Shop Owner")
    setItems([])
    setTheme("parchment")
    setCurrentShopId(null)
    setSelectedCommonCategory("")

    toast({
      title: "New Shop",
      description: "Started creating a new shop.",
    })
  }

  // Add new item
  const addItem = () => {
    // Validate all new item fields
    const validationResult = newItemValidation.validateAllFields()

    if (!validationResult.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before adding the item.",
        variant: "destructive",
      })
      return
    }

    // Additional business logic validation
    if (newItem.name.trim() === "" || newItem.price <= 0) {
      toast({
        title: "Invalid Item",
        description: "Item name is required and price must be greater than 0.",
        variant: "destructive",
      })
      return
    }

    // Check for duplicate item names
    const isDuplicate = items.some((item) => item.name.toLowerCase().trim() === newItem.name.toLowerCase().trim())

    if (isDuplicate) {
      toast({
        title: "Duplicate Item",
        description: "An item with this name already exists.",
        variant: "destructive",
      })
      return
    }

    const item = {
      ...newItem,
      id: Date.now().toString(),
      name: sanitizeString(newItem.name),
    }

    setItems([...items, item])
    setNewItem({
      id: "",
      name: "",
      category: "Weapon",
      price: 0,
      currency: "GP",
    })

    // Reset validation for new item form
    newItemValidation.resetForm({
      name: "",
      category: "Weapon",
      price: 0,
      currency: "GP",
    })

    toast({
      title: "Item Added",
      description: `${item.name} has been added to your shop.`,
    })
  }

  // Add common items for a category
  const addCommonItems = (category: string) => {
    const categoryItems = commonItems[category as keyof typeof commonItems]
    if (!categoryItems) return

    const newItems = categoryItems.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      name: item.name,
      category: category,
      price: item.price,
      currency: item.currency,
    }))

    setItems([...items, ...newItems])
    setSelectedCommonCategory(category)
  }

  // Remove item
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  // Update item
  const updateItem = (id: string, field: keyof Item, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
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
                Dungeon and Shopkeeps
              </h1>
            </Link>
            <p className="text-muted-foreground">
              {isFreeMode ? "Free Mode - Create without limits!" : `Welcome back, ${displayName}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <PrintButton onPrint={handlePrint} disabled={items.length === 0} />

            {/* Shop Management Buttons */}
            {user && isConfigured && (
              <>
                <Button
                  onClick={handleNewShop}
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
                      disabled={loadingShops}
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>Load</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="card-3d max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-fantasy">Load Saved Shop</DialogTitle>
                      <DialogDescription>Choose a shop to load from your saved collection.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-96 overflow-y-auto">
                      {loadingShops ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : savedShops.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">No saved shops found.</p>
                      ) : (
                        <div className="space-y-2">
                          {savedShops.map((shop) => (
                            <div
                              key={shop.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">{shop.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Owner: {shop.owner} • {shop.items.length} items •{" "}
                                  {themes.find((t) => t.id === shop.theme)?.name} theme
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Updated: {shop.updatedAt.toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleLoadShop(shop)}
                                  className="button-3d text-primary-foreground"
                                >
                                  Load
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteShop(shop.id!, shop.title)}
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
                  onClick={handleSaveShop}
                  size="sm"
                  disabled={savingShop}
                  className="flex items-center space-x-2 button-3d text-primary-foreground"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingShop ? "Saving..." : currentShopId ? "Update" : "Save"}</span>
                </Button>
              </>
            )}

            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg card-3d">
              {user?.photoURL ? (
                <img
                  src={user.photoURL || "/placeholder.svg"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full shadow-sm"
                />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" />
              )}
              <span className="text-sm text-foreground font-medium">{displayName}</span>
            </div>
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2 button-3d text-primary-foreground bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            ) : (
              <Link href="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 button-3d text-primary-foreground bg-transparent"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Editor Section */}
          <div className="flex-1 print:hidden">
            <Card className="card-3d paper-texture">
              <CardHeader className="wood-grain">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground font-fantasy">Shop Creator</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Create your fantasy RPG shop inventory
                    </CardDescription>
                  </div>
                  <div className="w-40">
                    <Label htmlFor="theme" className="text-sm font-medium text-foreground">
                      Theme
                    </Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme" className="input-3d">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="card-3d">
                        {themes.map((theme) => (
                          <SelectItem key={theme.id} value={theme.id} className="hover:bg-accent/50">
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="paper-texture">
                <div className="space-y-6">
                  {/* Shop Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ValidatedInput
                      id="shop-title"
                      label="Shop Title"
                      onChange={(value) => setShopTitle(sanitizeInputString(value))}
                      onBlur={() => shopFormValidation.markFieldAsTouched("shopTitle")}
                      placeholder="Enter shop name"
                      required
                      {...shopFormValidation.getFieldState("shopTitle")}
                      helperText="Enter a creative name for your shop (1-100 characters)"
                    />
                    <ValidatedInput
                      id="owner-name"
                      label="Shop Owner"
                      onChange={(value) => setOwnerName(sanitizeInputString(value))}
                      onBlur={() => shopFormValidation.markFieldAsTouched("ownerName")}
                      placeholder="Enter owner name"
                      required
                      {...shopFormValidation.getFieldState("ownerName")}
                      helperText="Enter the name of the shop owner (1-100 characters)"
                    />
                  </div>

                  {/* Add New Item */}
                  <div className="border rounded-lg p-4 card-3d">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-foreground font-fantasy">Add New Item</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="flex items-center gap-2 button-3d text-primary-foreground">
                            <Package2 className="h-4 w-4" />
                            Add common items {selectedCommonCategory ? ` (${selectedCommonCategory})` : ""}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="card-3d">
                          {categories.map((category) => (
                            <DropdownMenuItem
                              key={category}
                              onClick={() => addCommonItems(category)}
                              className="hover:bg-accent/50 cursor-pointer"
                            >
                              {category} ({commonItems[category as keyof typeof commonItems]?.length || 0} items)
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Manual Item Entry Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                      <div className="md:col-span-2">
                        <ValidatedInput
                          id="item-name"
                          label="Item Name"
                          value={String(newItemValidation.getFieldState("name").value || "")}
                          onChange={(value) => setNewItem({ ...newItem, name: sanitizeInputString(value) })}
                          onBlur={() => newItemValidation.markFieldAsTouched("name")}
                          placeholder="Enter item name"
                          required
                          isValid={newItemValidation.getFieldState("name").isValid}
                          errors={newItemValidation.getFieldState("name").errors}
                          hasBeenTouched={newItemValidation.getFieldState("name").hasBeenTouched}
                          helperText="Enter a unique item name (1-50 characters)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="item-category" className="text-foreground font-medium">
                          Category
                        </Label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                        >
                          <SelectTrigger id="item-category" className="input-3d mt-2">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="card-3d">
                            {categories.map((category) => (
                              <SelectItem key={category} value={category} className="hover:bg-accent/50">
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="min-h-[1.25rem]" /> {/* Spacer to match ValidatedInput helper text space */}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="item-price" className="text-foreground font-medium">
                            Price
                          </Label>
                          <Input
                            id="item-price"
                            type="number"
                            min="0"
                            value={newItem.price || ""}
                            onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) || 0 })}
                            placeholder="0"
                            className="input-3d mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="item-currency" className="text-foreground font-medium">
                            Currency
                          </Label>
                          <Select
                            value={newItem.currency}
                            onValueChange={(value) => setNewItem({ ...newItem, currency: value })}
                          >
                            <SelectTrigger id="item-currency" className="input-3d mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="card-3d">
                              {currencies.map((currency) => (
                                <SelectItem key={currency} value={currency} className="hover:bg-accent/50">
                                  {currency}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="min-h-[1.25rem] col-span-2" />{" "}
                        {/* Spacer to match ValidatedInput helper text space */}
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button onClick={addItem} className="flex items-center gap-2 button-3d text-primary-foreground">
                        <PlusCircle className="h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div>
                    <h3 className="font-medium mb-3 text-foreground font-fantasy">Shop Inventory</h3>
                    <div className="border rounded-lg overflow-hidden table-3d">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/50">
                            <TableHead className="text-foreground font-medium">Item Name</TableHead>
                            <TableHead className="text-foreground font-medium">Category</TableHead>
                            <TableHead className="text-foreground font-medium">Price</TableHead>
                            <TableHead className="w-[80px] text-foreground font-medium">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item) => (
                            <TableRow key={item.id} className="border-border/30 hover:bg-accent/30 transition-colors">
                              <TableCell>
                                <Input
                                  value={item.name}
                                  onChange={(e) => updateItem(item.id, "name", sanitizeInputString(e.target.value))}
                                  className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-foreground"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={item.category}
                                  onValueChange={(value) => updateItem(item.id, "category", value)}
                                >
                                  <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 bg-transparent text-foreground">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="card-3d">
                                    {categories.map((category) => (
                                      <SelectItem key={category} value={category} className="hover:bg-accent/50">
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min="0"
                                    value={item.price}
                                    onChange={(e) =>
                                      updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)
                                    }
                                    className="border-0 p-0 h-auto w-16 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-foreground"
                                  />
                                  <Select
                                    value={item.currency}
                                    onValueChange={(value) => updateItem(item.id, "currency", value)}
                                  >
                                    <SelectTrigger className="border-0 p-0 h-auto w-16 focus:ring-0 bg-transparent text-foreground">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="card-3d">
                                      {currencies.map((currency) => (
                                        <SelectItem key={currency} value={currency} className="hover:bg-accent/50">
                                          {currency}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem(item.id)}
                                  className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive/20 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {items.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground italic">
                                No items in inventory. Add some items to get started.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="flex-1">
            <LazyShopDisplay shopTitle={shopTitle} ownerName={ownerName} items={items} theme={theme} isPrintMode={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
