"use client"

import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PrintButtonProps {
  onPrint: () => void
  disabled?: boolean
  shopTitle: string
}

export function PrintButton({ onPrint, disabled = false, shopTitle }: PrintButtonProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "", "height=400,width=600")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Print - ${shopTitle} | Dungeon and Shopkeeps</title>
          </head>
          <body>
            <!-- Content to be printed goes here -->
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <Button
      onClick={handlePrint}
      disabled={disabled}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2 bg-transparent dark:bg-transparent dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <Printer className="w-4 h-4" />
      <span>Print Shop</span>
    </Button>
  )
}
