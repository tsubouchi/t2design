"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">エラーが発生しました</h1>
            <p className="text-muted-foreground">
              予期せぬエラーが発生しました。もう一度お試しください。
            </p>
            <Button onClick={reset}>再試行</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 