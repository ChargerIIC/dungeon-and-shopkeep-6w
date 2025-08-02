"use client"

import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PrintButtonProps {
  onPrint: () => void
  disabled?: boolean
}

export function PrintButton({ onPrint, disabled = false }: PrintButtonProps) {
  return (
    <Button
      onClick={onPrint}
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
