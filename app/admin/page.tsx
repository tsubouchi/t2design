"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Ban, Check, Edit, Key, RefreshCw, Shield, User, Users } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

export default function AdminPage() {
  const { user } = useAuth()

  // Mock users data
  const users = [
    {
      id: "user_1",
      name: "山田太郎",
      email: "yamada@example.com",
      plan: "Free",
      credits: 15,
      status: "active",
      createdAt: "2023-04-01",
    },
    {
      id: "user_2",
      name: "佐藤花子",
      email: "sato@example.com",
      plan: "Standard",
      credits: 320,
      status: "active",
      createdAt: "2023-04-15",
    },
    {
      id: "user_3",
      name: "鈴木一郎",
      email: "suzuki@example.com",
      plan: "Pro",
      credits: 1200,
      status: "active",
      createdAt: "2023-05-01",
    },
    {
      id: "user_4",
      name: "高橋次郎",
      email: "takahashi@example.com",
      plan: "Free",
      credits: 0,
      status: "inactive",
      createdAt: "2023-05-10",
    },
  ]

  // Mock designs data
  const designs = [
    {
      id: "design_1",
      title: "バナーデザイン",
      type: "banner",
      user: "山田太郎",
      status: "public",
      createdAt: "2023-05-01",
    },
    {
      id: "design_2",
      title: "雑誌表紙",
      type: "magazine",
      user: "佐藤花子",
      status: "public",
      createdAt: "2023-05-02",
    },
    {
      id: "design_3",
      title: "ポスターデザイン",
      type: "poster",
      user: "鈴木一郎",
      status: "flagged",
      createdAt: "2023-05-03",
    },
    {
      id: "design_4",
      title: "チラシデザイン",
      type: "flyer",
      user: "高橋次郎",
      status: "public",
      createdAt: "2023-05-04",
    },
  ]

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-8">
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
                <Badge variant="outline" className="px-3 py-1">
                  <Shield className="mr-1 h-3 w-3" />
                  管理者モード
                </Badge>
              </div>

              <Tabs defaultValue="users">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="users">ユーザー管理</TabsTrigger>
                  <TabsTrigger value="designs">作品管理</TabsTrigger>
                  <TabsTrigger value="settings">システム設定</TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <CardTitle>ユーザー管理</CardTitle>
                      <CardDescription>登録ユーザーの管理と操作</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Input placeholder="ユーザー検索..." className="max-w-sm" />
                          <Button variant="outline">検索</Button>
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>名前</TableHead>
                              <TableHead>メール</TableHead>
                              <TableHead>プラン</TableHead>
                              <TableHead>クレジット</TableHead>
                              <TableHead>ステータス</TableHead>
                              <TableHead>登録日</TableHead>
                              <TableHead>操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.plan}</TableCell>
                                <TableCell>{user.credits}</TableCell>
                                <TableCell>
                                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                    {user.status === "active" ? "アクティブ" : "非アクティブ"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{user.createdAt}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">編集</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Ban className="h-4 w-4" />
                                      <span className="sr-only">BAN</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="designs">
                  <Card>
                    <CardHeader>
                      <CardTitle>作品管理</CardTitle>
                      <CardDescription>公開されているデザインのモデレーション</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Input placeholder="作品検索..." className="max-w-sm" />
                          <Button variant="outline">検索</Button>
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>タイトル</TableHead>
                              <TableHead>タイプ</TableHead>
                              <TableHead>ユーザー</TableHead>
                              <TableHead>ステータス</TableHead>
                              <TableHead>作成日</TableHead>
                              <TableHead>操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {designs.map((design) => (
                              <TableRow key={design.id}>
                                <TableCell className="font-medium">{design.title}</TableCell>
                                <TableCell>{design.type}</TableCell>
                                <TableCell>{design.user}</TableCell>
                                <TableCell>
                                  <Badge variant={design.status === "flagged" ? "destructive" : "default"}>
                                    {design.status === "public" ? "公開" : "要確認"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{design.createdAt}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Check className="h-4 w-4" />
                                      <span className="sr-only">承認</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Ban className="h-4 w-4" />
                                      <span className="sr-only">非表示</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>システム設定</CardTitle>
                      <CardDescription>APIキーやシステム設定の管理</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="claude-api-key">Claude Sonet 3.7 APIキー</Label>
                            <div className="flex items-center gap-2">
                              <Input id="claude-api-key" type="password" value="••••••••••••••••••••••••••" />
                              <Button variant="outline" size="icon">
                                <Key className="h-4 w-4" />
                                <span className="sr-only">表示</span>
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fal-api-key">fal.ai APIキー</Label>
                            <div className="flex items-center gap-2">
                              <Input id="fal-api-key" type="password" value="••••••••••••••••••••••••••" />
                              <Button variant="outline" size="icon">
                                <Key className="h-4 w-4" />
                                <span className="sr-only">表示</span>
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="firebase-config">Firebase設定</Label>
                            <div className="flex items-center gap-2">
                              <Input id="firebase-config" type="password" value="••••••••••••••••••••••••••" />
                              <Button variant="outline" size="icon">
                                <Key className="h-4 w-4" />
                                <span className="sr-only">表示</span>
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 pt-4 border-t">
                          <h3 className="text-lg font-medium">システムステータス</h3>
                          <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>アクティブユーザー</span>
                              </div>
                              <Badge variant="outline">42 ユーザー</Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>総ユーザー数</span>
                              </div>
                              <Badge variant="outline">128 ユーザー</Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                                <span>API呼び出し (24時間)</span>
                              </div>
                              <Badge variant="outline">1,245 リクエスト</Badge>
                            </div>
                          </div>
                        </div>

                        <Button>設定を保存</Button>
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

