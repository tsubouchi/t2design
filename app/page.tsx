"use client"

import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import { GoogleLoginButton } from "@/components/google-login-button"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, History, CreditCard, Layers } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { signIn, loading, user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {!user ? (
          <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">t2design</h1>
              <p className="text-xl text-muted-foreground">AIを使って高品質なデザインを自動生成</p>
              <div className="mt-8">
                <GoogleLoginButton onClick={signIn} isLoading={loading} />
              </div>
            </div>
          </div>
        ) : (
          <div className="container py-8">
            <div className="grid gap-8">
              <div className="grid gap-4">
                <h1 className="text-3xl font-bold">ようこそ、{user.displayName || 'ユーザー'}さん</h1>
                <p className="text-muted-foreground">AIを使って高品質なデザインを自動生成しましょう</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlusCircle className="h-5 w-5" />
                      デザイン作成
                    </CardTitle>
                    <CardDescription>新しいデザインを作成します</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/create">作成を始める</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      履歴
                    </CardTitle>
                    <CardDescription>過去に作成したデザインを確認</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/designs">履歴を見る</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      クレジット
                    </CardTitle>
                    <CardDescription>クレジットの購入と管理</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/credits">クレジット管理</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      デモ
                    </CardTitle>
                    <CardDescription>デザインのサンプルを確認</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/demo">デモを見る</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

