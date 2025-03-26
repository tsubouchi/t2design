"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Download } from "lucide-react"
import Image from "next/image"
import { ProtectedRoute } from "@/components/protected-route"

export default function CommunityPage() {
  // Mock community data
  const communityItems = [
    {
      id: "1",
      title: "モダンなバナーデザイン",
      type: "banner",
      createdAt: "2023-05-01",
      imageUrl: "/placeholder.svg?height=400&width=800",
      user: {
        name: "田中一郎",
        avatar: "/placeholder-user.jpg",
      },
      likes: 24,
      comments: 5,
    },
    {
      id: "2",
      title: "スタイリッシュな雑誌表紙",
      type: "magazine",
      createdAt: "2023-05-02",
      imageUrl: "/placeholder.svg?height=600&width=400",
      user: {
        name: "佐藤花子",
        avatar: "/placeholder-user.jpg",
      },
      likes: 42,
      comments: 8,
    },
    {
      id: "3",
      title: "イベントポスター",
      type: "poster",
      createdAt: "2023-05-03",
      imageUrl: "/placeholder.svg?height=800&width=600",
      user: {
        name: "鈴木太郎",
        avatar: "/placeholder-user.jpg",
      },
      likes: 18,
      comments: 3,
    },
    {
      id: "4",
      title: "セールチラシ",
      type: "flyer",
      createdAt: "2023-05-04",
      imageUrl: "/placeholder.svg?height=600&width=600",
      user: {
        name: "高橋次郎",
        avatar: "/placeholder-user.jpg",
      },
      likes: 31,
      comments: 6,
    },
    {
      id: "5",
      title: "動画用テロップ",
      type: "youtube",
      createdAt: "2023-05-05",
      imageUrl: "/placeholder.svg?height=400&width=800",
      user: {
        name: "山本三郎",
        avatar: "/placeholder-user.jpg",
      },
      likes: 56,
      comments: 12,
    },
    {
      id: "6",
      title: "プロモーションバナー",
      type: "banner",
      createdAt: "2023-05-06",
      imageUrl: "/placeholder.svg?height=400&width=800",
      user: {
        name: "伊藤四郎",
        avatar: "/placeholder-user.jpg",
      },
      likes: 37,
      comments: 9,
    },
  ]

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header showCredits={true} />
        <main className="flex-1">
          <div className="container py-8">
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">コミュニティ</h1>
                <div className="w-[200px]">
                  <Label htmlFor="filter-type" className="sr-only">
                    タイプで絞り込み
                  </Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="filter-type">
                      <SelectValue placeholder="すべて表示" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて表示</SelectItem>
                      <SelectItem value="banner">バナー</SelectItem>
                      <SelectItem value="magazine">雑誌表紙</SelectItem>
                      <SelectItem value="poster">ポスター</SelectItem>
                      <SelectItem value="flyer">チラシ</SelectItem>
                      <SelectItem value="youtube">Youtubeテロップ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{item.title}</h3>
                          <span className="text-xs text-muted-foreground">{item.createdAt}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.type === "banner" && "バナー"}
                          {item.type === "magazine" && "雑誌表紙"}
                          {item.type === "poster" && "ポスター"}
                          {item.type === "flyer" && "チラシ"}
                          {item.type === "youtube" && "Youtubeテロップ"}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={item.user.avatar} alt={item.user.name} />
                              <AvatarFallback>{item.user.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{item.user.name}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Heart className="h-4 w-4" />
                              <span className="sr-only">いいね</span>
                              <span className="text-xs ml-1">{item.likes}</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MessageSquare className="h-4 w-4" />
                              <span className="sr-only">コメント</span>
                              <span className="text-xs ml-1">{item.comments}</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">ダウンロード</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}

