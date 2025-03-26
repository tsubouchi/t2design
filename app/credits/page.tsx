"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { PricingSectionDemo } from "@/components/blocks/pricing-section-demo"
import { CreditManager } from '@/components/CreditManager'

export default function CreditsPage() {
  const { user } = useAuth()

  // Mock transaction history
  const transactions = [
    {
      id: "tx_1",
      date: "2023-05-01",
      type: "subscription",
      plan: "Standard",
      amount: 3500,
      points: 500,
    },
    {
      id: "tx_2",
      date: "2023-05-15",
      type: "creditPurchase",
      amount: 700,
      points: 100,
    },
    {
      id: "tx_3",
      date: "2023-06-01",
      type: "subscription",
      plan: "Standard",
      amount: 3500,
      points: 500,
    },
  ]

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header showCredits={true} />
        <main className="flex-1">
          <div className="container py-8">
            <div className="grid gap-6">
              <h1 className="text-3xl font-bold">クレジット管理</h1>

              <Tabs defaultValue="plans">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="plans">プラン変更</TabsTrigger>
                  <TabsTrigger value="history">購入履歴</TabsTrigger>
                </TabsList>

                <TabsContent value="plans">
                  <PricingSectionDemo />
                </TabsContent>

                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>購入履歴</CardTitle>
                      <CardDescription>過去の購入履歴を確認できます</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {transactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
                            <div>
                              <div className="font-medium">
                                {transaction.type === "subscription"
                                  ? `${transaction.plan}プラン購入`
                                  : `クレジット追加購入 (${transaction.points}pt)`}
                              </div>
                              <div className="text-sm text-muted-foreground">{transaction.date}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="text-right">
                                <div className="font-medium">¥{transaction.amount.toLocaleString()}</div>
                                {transaction.points && (
                                  <div className="text-sm text-muted-foreground">+{transaction.points}pt</div>
                                )}
                              </div>
                              <CreditCard className="ml-4 h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}

