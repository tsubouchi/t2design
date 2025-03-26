"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase"

export default function LoginPage() {
  const { user, signIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">ログイン</h1>
            <p className="text-muted-foreground">
              T2Designにログインして、AIデザイン生成を始めましょう
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={() => signIn()}
            >
              Googleでログイン
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 