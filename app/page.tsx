"use client"

import { useState } from "react"
import { PlusCircle, Trash2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShopDisplay } from "@/components/shop-display"
import { redirect } from "next/navigation"

// Item categories
const categories = ["Weapon", "Armor", "Potions", "Gear", "Scroll"]
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

// Item type definition
type Item = {
  id: string
  name: string
  category: string
  price: number
  currency: string
}

export default function ShopCreator() {
  redirect("/home")

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

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Editor Section */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold">Shop Creator</CardTitle>
                    <CardDescription>Create your fantasy RPG shop inventory</CardDescription>
                  </div>
                  <div className="w-40">
                    <Label htmlFor="theme" className="text-sm font-medium">
                      Theme
                    </Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme.id} value={theme.id}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Shop Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shop-title">Shop Title</Label>
                      <Input
                        id="shop-title"
                        value={shopTitle}
                        onChange={(e) => setShopTitle(e.target.value)}
                        placeholder="Enter shop name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-name">Shop Owner</Label>
                      <Input
                        id="owner-name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Enter owner name"
                      />
                    </div>
                  </div>

                  {/* Add New Item */}
                  <div className="border rounded-md p-4 bg-stone-50">
                    <h3 className="font-medium mb-3">Add New Item</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="item-name">Item Name</Label>
                        <Input
                          id="item-name"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder="Enter item name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="item-category">Category</Label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                        >
                          <SelectTrigger id="item-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="item-price">Price</Label>
                          <Input
                            id="item-price"
                            type="number"
                            min="0"
                            value={newItem.price || ""}
                            onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-currency">Currency</Label>
                          <Select
                            value={newItem.currency}
                            onValueChange={(value) => setNewItem({ ...newItem, currency: value })}
                          >
                            <SelectTrigger id="item-currency">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((currency) => (
                                <SelectItem key={currency} value={currency}>
                                  {currency}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="md:col-span-4 flex justify-end">
                        <Button onClick={addItem} className="flex items-center gap-2">
                          <PlusCircle className="h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div>
                    <h3 className="font-medium mb-3">Shop Inventory</h3>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="w-[80px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Input
                                  value={item.name}
                                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                                  className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={item.category}
                                  onValueChange={(value) => updateItem(item.id, "category", value)}
                                >
                                  <SelectTrigger className="border-0 p-0 h-auto focus:ring-0">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((category) => (
                                      <SelectItem key={category} value={category}>
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
                                    className="border-0 p-0 h-auto w-16 focus-visible:ring-0 focus-visible:ring-offset-0"
                                  />
                                  <Select
                                    value={item.currency}
                                    onValueChange={(value) => updateItem(item.id, "currency", value)}
                                  >
                                    <SelectTrigger className="border-0 p-0 h-auto w-16 focus:ring-0">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {currencies.map((currency) => (
                                        <SelectItem key={currency} value={currency}>
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
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {items.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
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
            <ShopDisplay shopTitle={shopTitle} ownerName={ownerName} items={items} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  )
}
