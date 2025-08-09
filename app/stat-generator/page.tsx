"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Printer, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { SharedHeader } from "@/components/shared-header"
import Link from "next/link"

// Ability score options
const abilities = [
  { value: "strength", label: "Strength" },
  { value: "dexterity", label: "Dexterity" },
  { value: "constitution", label: "Constitution" },
  { value: "intelligence", label: "Intelligence" },
  { value: "wisdom", label: "Wisdom" },
  { value: "charisma", label: "Charisma" },
]

// Dice component mapping
const DiceComponents = {
  1: Dice1,
  2: Dice2,
  3: Dice3,
  4: Dice4,
  5: Dice5,
  6: Dice6,
}

type DiceValue = 1 | 2 | 3 | 4 | 5 | 6

interface DiceState {
  value: DiceValue
  ignored: boolean
}

interface StatColumn {
  dice: DiceState[]
  ability: string
}

export default function StatGenerator() {
  // Initialize 5 columns with 4 dice each
  const [columns, setColumns] = useState<StatColumn[]>(() =>
    Array.from({ length: 5 }, () => ({
      dice: Array.from({ length: 4 }, () => ({
        value: Math.ceil(Math.random() * 6) as DiceValue,
        ignored: false,
      })),
      ability: "",
    })),
  )

  // State for the remaining points column ability assignment
  const [remainingColumnAbility, setRemainingColumnAbility] = useState<string>("")

  // Roll all dice
  const rollDice = () => {
    setColumns(
      columns.map((column) => ({
        ...column,
        dice: column.dice.map(() => ({
          value: Math.ceil(Math.random() * 6) as DiceValue,
          ignored: false,
        })),
      })),
    )
  }

  // Toggle dice ignored state
  const toggleDiceIgnored = (columnIndex: number, diceIndex: number) => {
    setColumns(
      columns.map((column, colIdx) => {
        if (colIdx === columnIndex) {
          return {
            ...column,
            dice: column.dice.map((die, dieIdx) => {
              if (dieIdx === diceIndex) {
                return { ...die, ignored: !die.ignored }
              }
              return die
            }),
          }
        }
        return column
      }),
    )
  }

  // Update ability assignment - ensure no duplicates
  const updateAbility = (columnIndex: number, ability: string) => {
    // Clear the ability from the remaining column if it matches
    if (remainingColumnAbility === ability) {
      setRemainingColumnAbility("")
    }

    setColumns(
      columns.map((column, idx) => {
        if (idx === columnIndex) {
          return { ...column, ability }
        }
        // Clear the ability from other columns if it's already assigned
        if (column.ability === ability) {
          return { ...column, ability: "" }
        }
        return column
      }),
    )
  }

  // Update remaining column ability assignment
  const updateRemainingColumnAbility = (ability: string) => {
    // Clear the ability from other columns if it's already assigned
    setColumns(
      columns.map((column) => {
        if (column.ability === ability) {
          return { ...column, ability: "" }
        }
        return column
      }),
    )
    setRemainingColumnAbility(ability)
  }

  // Calculate column total (sum of non-ignored dice)
  const getColumnTotal = (column: StatColumn) => {
    return column.dice.filter((die) => !die.ignored).reduce((sum, die) => sum + die.value, 0)
  }

  // Calculate total of all columns
  const getTotalUsed = () => {
    return columns.reduce((total, column) => total + getColumnTotal(column), 0)
  }

  // Calculate remaining points
  const getRemainingPoints = () => {
    return Math.max(0, 72 - getTotalUsed())
  }

  // Get assigned abilities summary including remaining column
  const getAbilitySummary = () => {
    const columnStats = columns
      .filter((column) => column.ability)
      .map((column) => ({
        ability: column.ability,
        score: getColumnTotal(column),
      }))

    // Add remaining column if it has an ability assigned
    if (remainingColumnAbility) {
      columnStats.push({
        ability: remainingColumnAbility,
        score: getRemainingPoints(),
      })
    }

    return columnStats
  }

  // Get available abilities for a column (excluding already assigned ones)
  const getAvailableAbilities = (currentColumnIndex: number) => {
    const assignedAbilities = columns
      .map((column, index) => (index !== currentColumnIndex ? column.ability : ""))
      .filter(Boolean)

    // Also exclude the remaining column ability
    if (remainingColumnAbility) {
      assignedAbilities.push(remainingColumnAbility)
    }

    return abilities.filter((ability) => !assignedAbilities.includes(ability.value))
  }

  // Get available abilities for remaining column
  const getAvailableAbilitiesForRemaining = () => {
    const assignedAbilities = columns.map((column) => column.ability).filter(Boolean)
    return abilities.filter((ability) => !assignedAbilities.includes(ability.value))
  }

  // Print function
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>D&D Ability Scores - Dungeon Coach Method</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              background: white;
              color: black;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .stats-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 20px; 
              margin-bottom: 30px;
            }
            .stat-card { 
              border: 2px solid #333; 
              padding: 15px; 
              text-align: center;
              background: #f9f9f9;
            }
            .stat-name { 
              font-weight: bold; 
              font-size: 18px; 
              margin-bottom: 10px;
              text-transform: capitalize;
            }
            .stat-score { 
              font-size: 36px; 
              font-weight: bold; 
              color: #d97706;
              margin-bottom: 5px;
            }
            .stat-modifier { 
              font-size: 14px; 
              color: #666;
            }
            .dice-details {
              margin-top: 30px;
              border-top: 2px solid #333;
              padding-top: 20px;
            }
            .column-details {
              margin-bottom: 15px;
              padding: 10px;
              border: 1px solid #ccc;
              background: #f5f5f5;
            }
            .dice-row {
              display: flex;
              gap: 10px;
              align-items: center;
              margin-top: 5px;
            }
            .die {
              width: 30px;
              height: 30px;
              border: 1px solid #333;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
            }
            .ignored {
              background: #ffcccc;
              text-decoration: line-through;
            }
            .summary {
              margin-top: 20px;
              text-align: center;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>D&D Ability Scores</h1>
            <h2>Dungeon Coach Stat Generation Method</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="stats-grid">
            ${getAbilitySummary()
              .map(
                (item) => `
              <div class="stat-card">
                <div class="stat-name">${item.ability}</div>
                <div class="stat-score">${item.score}</div>
                <div class="stat-modifier">
                  Modifier: ${Math.floor((item.score - 10) / 2) >= 0 ? "+" : ""}${Math.floor((item.score - 10) / 2)}
                </div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="dice-details">
            <h3>Dice Roll Details</h3>
            ${columns
              .map(
                (column, index) => `
              <div class="column-details">
                <strong>Column ${index + 1}${column.ability ? ` (${column.ability})` : ""}: ${getColumnTotal(column)}</strong>
                <div class="dice-row">
                  Dice: ${column.dice
                    .map(
                      (die) => `
                    <span class="die ${die.ignored ? "ignored" : ""}">${die.value}</span>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            `,
              )
              .join("")}
            ${
              remainingColumnAbility
                ? `
              <div class="column-details">
                <strong>Remaining Points Column (${remainingColumnAbility}): ${getRemainingPoints()}</strong>
                <div class="dice-row">
                  Calculated: 72 - ${getTotalUsed()} = ${getRemainingPoints()}
                </div>
              </div>
            `
                : ""
            }
          </div>

          <div class="summary">
            <p><strong>Total Points Used:</strong> ${getTotalUsed()} / 72</p>
            <p><strong>Remaining Points:</strong> ${getRemainingPoints()}</p>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/home"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-fantasy">Dungeon Coach Stat Generation</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Roll 4d6 for each ability score and drop the lowest die. Assign your rolls to different abilities while
            maintaining a total point budget of 72 points.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button onClick={rollDice} size="lg" className="button-3d text-primary-foreground text-lg px-8 py-3">
            🎲 Roll Dice
          </Button>

          {getAbilitySummary().length > 0 && (
            <Button
              onClick={handlePrint}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 card-3d bg-transparent"
            >
              <Printer className="mr-2 h-5 w-5" />
              Print Results
            </Button>
          )}
        </div>

        {/* Dice Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* First 5 columns with dice */}
          {columns.map((column, columnIndex) => (
            <Card
              key={columnIndex}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-amber-200 dark:border-slate-600"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                  Column {columnIndex + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dice Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {column.dice.map((die, diceIndex) => {
                    const DiceComponent = DiceComponents[die.value]
                    return (
                      <button
                        key={diceIndex}
                        onClick={() => toggleDiceIgnored(columnIndex, diceIndex)}
                        className={cn(
                          "relative p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                          die.ignored
                            ? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600 opacity-50"
                            : "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30",
                        )}
                      >
                        <DiceComponent
                          className={cn(
                            "w-8 h-8 mx-auto",
                            die.ignored ? "text-red-500 dark:text-red-400" : "text-amber-700 dark:text-amber-300",
                          )}
                        />
                        {die.ignored && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-red-500 dark:bg-red-400 rotate-45"></div>
                            <div className="w-full h-0.5 bg-red-500 dark:bg-red-400 -rotate-45"></div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Column Total */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 bg-amber-100 dark:bg-amber-900/30 rounded-lg py-2 border-2 border-amber-300 dark:border-amber-600">
                    {getColumnTotal(column)}
                  </div>
                </div>

                {/* Ability Assignment */}
                <Select value={column.ability} onValueChange={(value) => updateAbility(columnIndex, value)}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-amber-300 dark:border-slate-600">
                    <SelectValue placeholder="Assign ability" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableAbilities(columnIndex).map((ability) => (
                      <SelectItem key={ability.value} value={ability.value}>
                        {ability.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}

          {/* Sixth column - Remaining Points */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-emerald-200 dark:border-emerald-600">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                Remaining
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg py-2 border-2 border-emerald-300 dark:border-emerald-600">
                  {getRemainingPoints()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Points left from 72</p>
              </div>

              {/* Ability Assignment for Remaining Column */}
              <Select value={remainingColumnAbility} onValueChange={updateRemainingColumnAbility}>
                <SelectTrigger className="bg-white dark:bg-slate-700 border-emerald-300 dark:border-emerald-600">
                  <SelectValue placeholder="Assign ability" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableAbilitiesForRemaining().map((ability) => (
                    <SelectItem key={ability.value} value={ability.value}>
                      {ability.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Ability Summary */}
        {getAbilitySummary().length > 0 && (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-600">
            <CardHeader>
              <CardTitle className="text-center text-slate-800 dark:text-slate-100">Ability Score Summary</CardTitle>
              <CardDescription className="text-center">Your assigned ability scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {getAbilitySummary().map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                  >
                    <div className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{item.ability}</div>
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{item.score}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Modifier: {Math.floor((item.score - 10) / 2) >= 0 ? "+" : ""}
                      {Math.floor((item.score - 10) / 2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                Total Points Used: <span className="font-semibold">{getTotalUsed()}</span> / 72
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
