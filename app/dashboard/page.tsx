"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, History, CreditCard, Layers } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-8">
            <div className="grid gap-8">
              <div className="grid gap-4">
                <h1 className="text-3xl font-bold">マイページ</h1>
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>新しくデザイン作成</CardTitle>
                      <CardDescription>AIを使って新しいデザインを作成します</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full">
                        <Link href="/create">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          デザイン作成
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>作成履歴</CardTitle>
                      <CardDescription>過去に作成したデザインを確認します</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/history">
                          <History className="mr-2 h-4 w-4" />
                          履歴を見る
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>クレジット管理</CardTitle>
                      <CardDescription>プラン変更やクレジット追加購入</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/credits">
                          <CreditCard className="mr-2 h-4 w-4" />
                          管理画面へ
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>デザインデモ</CardTitle>
                      <CardDescription>UIコンポーネントのデモを確認します</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/demo">
                          <Layers className="mr-2 h-4 w-4" />
                          デモを見る
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>現在のプラン</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user?.plan}</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {user?.plan === "Free" && "月5回（合計20枚）まで生成可能"}
                      {user?.plan === "Standard" && "月100回（合計400枚）まで生成可能"}
                      {user?.plan === "Pro" && "月500回（合計2000枚）まで生成可能"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>クレジット残高</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{user?.credits}/20 pt</div>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${((user?.credits || 0) / 20) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}

