"use client"
import { useState } from "react"
import { PlusCircle, Trash2, LogOut, User, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { PrintButton } from "@/components/print-button"
import { ShopDisplay } from "@/components/shop-display"
import { useAuth } from "@/components/auth-provider"
import { signOutUser } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Item categories
const categories = ["Weapon", "Armor", "Potions", "Gear", "Scroll", "Misc"]
// Currency types
const currencies = ["GP", "SP", "CP", "Credits", "Coins"]
// Theme options
const themes = [
  { id: "parchment", name: "Parchment" },
  { id: "tavern", name: "Tavern" },
  { id: "arcane", name: "Arcane" },
  { id: "forest", name: "Forest" },
  { id: "dungeon", name: "Dungeon" },
]

// Item type definition
type Item = {
  id: string
  name: string
  category: string
  price: number
  currency: string
}

// Shop type definition
type Shop = {
  id?: string
  title: string
  owner: string
  items: Item[]
  theme: string
  description?: string
}

export default function ShopCreator() {
  const { user, loading, isConfigured } = useAuth()
  const router = useRouter()

  // Shop details state
  const [shopTitle, setShopTitle] = useState("Mystic Emporium")
  const [ownerName, setOwnerName] = useState("Eldrin the Merchant")

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

  // Handle print functionality
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow pop-ups to enable printing")
      return
    }

    // Get the shop display content
    const shopDisplayElement = document.getElementById("shop-display-print")
    if (!shopDisplayElement) {
      alert("Unable to find shop display for printing")
      return
    }

    // Create the print document
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Print - ${shopTitle}</title>
          <style>
            /* Import Tailwind CSS for print */
            @import url('https://cdn.tailwindcss.com/3.4.0');
            
            /* Print-specific styles */
            @media print {
              @page {
                margin: 0.75in;
                size: letter;
              }
              
              body {
                font-family: 'Georgia', 'Times New Roman', serif;
                line-height: 1.4;
                color: #000;
                background: white !important;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              .print-hide {
                display: none !important;
              }
              
              .print-mode {
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              
              /* Card styling for print */
              [data-slot="card"] {
                box-shadow: none !important;
                border: 2px solid #666 !important;
                border-radius: 8px !important;
                background: white !important;
                page-break-inside: avoid;
              }
              
              /* Header styling */
              [data-slot="card-header"] {
                border-bottom: 2px solid #666 !important;
                padding: 1.5rem !important;
                background: #f8f9fa !important;
              }
              
              /* Content styling */
              [data-slot="card-content"] {
                padding: 2rem !important;
                background: white !important;
              }
              
              /* Typography */
              .font-fantasy {
                font-family: 'Georgia', 'Times New Roman', serif !important;
                font-weight: bold !important;
              }
              
              /* Category sections */
              .print\\:break-inside-avoid {
                break-inside: avoid;
                page-break-inside: avoid;
              }
              
              /* Item list styling */
              li {
                border-bottom: 1px dotted #999 !important;
                padding: 0.5rem 0.75rem !important;
                margin: 0.25rem 0 !important;
                background: rgba(0,0,0,0.02) !important;
              }
              
              /* Ensure icons print */
              svg {
                width: 16px !important;
                height: 16px !important;
                display: inline-block !important;
              }
              
              /* Theme-specific print colors */
              .print\\:text-amber-900 { color: #92400e !important; }
              .print\\:text-amber-800 { color: #a16207 !important; }
              .print\\:text-amber-950 { color: #451a03 !important; }
              .print\\:text-stone-800 { color: #292524 !important; }
              .print\\:text-purple-800 { color: #6b21a8 !important; }
              .print\\:text-purple-900 { color: #581c87 !important; }
              .print\\:text-emerald-800 { color: #065f46 !important; }
              .print\\:text-emerald-900 { color: #064e3b !important; }
              .print\\:text-red-700 { color: #b91c1c !important; }
              
              .print\\:bg-amber-100\\/30 { background-color: rgba(254, 243, 199, 0.3) !important; }
              .print\\:bg-stone-200 { background-color: #e7e5e4 !important; }
              .print\\:bg-purple-100 { background-color: #f3e8ff !important; }
              .print\\:bg-emerald-100 { background-color: #dcfce7 !important; }
              
              .print\\:border-amber-900\\/40 { border-color: rgba(120, 53, 15, 0.4) !important; }
              .print\\:border-stone-600 { border-color: #57534e !important; }
              .print\\:border-purple-700 { border-color: #7c3aed !important; }
              .print\\:border-emerald-700 { border-color: #047857 !important; }
              .print\\:border-red-900\\/50 { border-color: rgba(127, 29, 29, 0.5) !important; }
            }
            
            /* Base styles that work in both screen and print */
            body {
              margin: 0;
              padding: 20px;
              font-family: 'Georgia', 'Times New Roman', serif;
            }
            
            .font-fantasy {
              font-family: 'Georgia', 'Times New Roman', serif;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${shopDisplayElement.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `

    // Write content to print window and trigger print
    printWindow.document.write(printContent)
    printWindow.document.close()
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

  // Add new item
  const addItem = () => {
    if (newItem.name.trim() === "" || newItem.price <= 0) return

    const item = {
      ...newItem,
      id: Date.now().toString(),
    }

    setItems([...items, item])
    setNewItem({
      id: "",
      name: "",
      category: "Weapon",
      price: 0,
      currency: "GP",
    })
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
    <div className="min-h-screen bg-background p-4 md:p-8 print:hidden">
      <div className="max-w-7xl mx-auto">
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
                    <div className="space-y-2">
                      <Label htmlFor="shop-title" className="text-foreground font-medium">
                        Shop Title
                      </Label>
                      <Input
                        id="shop-title"
                        value={shopTitle}
                        onChange={(e) => setShopTitle(e.target.value)}
                        placeholder="Enter shop name"
                        className="input-3d"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-name" className="text-foreground font-medium">
                        Shop Owner
                      </Label>
                      <Input
                        id="owner-name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Enter owner name"
                        className="input-3d"
                      />
                    </div>
                  </div>

                  {/* Add New Item */}
                  <div className="border rounded-lg p-4 card-3d">
                    <h3 className="font-medium mb-3 text-foreground font-fantasy">Add New Item</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="item-name" className="text-foreground font-medium">
                          Item Name
                        </Label>
                        <Input
                          id="item-name"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder="Enter item name"
                          className="input-3d"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="item-category" className="text-foreground font-medium">
                          Category
                        </Label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                        >
                          <SelectTrigger id="item-category" className="input-3d">
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
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 space-y-2">
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
                            className="input-3d"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-currency" className="text-foreground font-medium">
                            Currency
                          </Label>
                          <Select
                            value={newItem.currency}
                            onValueChange={(value) => setNewItem({ ...newItem, currency: value })}
                          >
                            <SelectTrigger id="item-currency" className="input-3d">
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
                      </div>
                      <div className="md:col-span-4 flex justify-end">
                        <Button onClick={addItem} className="flex items-center gap-2 button-3d text-primary-foreground">
                          <PlusCircle className="h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
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
                                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
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
            <ShopDisplay shopTitle={shopTitle} ownerName={ownerName} items={items} theme={theme} isPrintMode={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
