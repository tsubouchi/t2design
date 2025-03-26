"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface GoogleLoginButtonProps {
  onClick: () => void
  isLoading: boolean
  className?: string
}

export function GoogleLoginButton({ onClick, isLoading, className }: GoogleLoginButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>ログイン中...</span>
        </>
      ) : (
        <span>Googleでログイン</span>
      )}
    </Button>
  )
}

