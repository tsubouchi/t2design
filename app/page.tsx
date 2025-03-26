"use client"

import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import { GoogleLoginButton } from "@/components/google-login-button"
import { Header } from "@/components/header"

export default function HomePage() {
  const { signIn, loading, user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">t2design</h1>
            <p className="text-muted-foreground">AIを使って高品質なデザインを自動生成</p>
          </div>
          {!user && (
            <div className="w-full max-w-md space-y-6">
              <div className="grid gap-6">
                <GoogleLoginButton onClick={signIn} isLoading={loading} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

