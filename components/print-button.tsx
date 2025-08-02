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
      className="flex items-center space-x-2 card-3d text-foreground border-border hover:shadow-md transition-all duration-200 bg-transparent"
    >
      <Printer className="w-4 h-4" />
      <span>Print Shop</span>
    </Button>
  )
}
