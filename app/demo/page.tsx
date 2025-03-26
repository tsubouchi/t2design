"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroDemo } from "@/components/blocks/hero-demo"
import { SquaresDemo } from "@/components/blocks/squares-demo"
import { ProtectedRoute } from "@/components/protected-route"

export default function DemoPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-8">
            <div className="grid gap-12">
              <div>
                <h1 className="text-3xl font-bold mb-6">Hero Component</h1>
                <HeroDemo />
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-6">Squares Background</h1>
                <SquaresDemo />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}

