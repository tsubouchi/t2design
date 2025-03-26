"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { ProtectedRoute } from "@/components/protected-route"

export default function HistoryPage() {
  // Mock history data
  const historyItems = [
    {
      id: "1",
      title: "バナーデザイン",
      type: "banner",
      createdAt: "2023-05-01",
      imageUrl: "/placeholder.svg?height=400&width=800",
    },
    {
      id: "2",
      title: "雑誌表紙",
      type: "magazine",
      createdAt: "2023-05-02",
      imageUrl: "/placeholder.svg?height=600&width=400",
    },
    {
      id: "3",
      title: "ポスターデザイン",
      type: "poster",
      createdAt: "2023-05-03",
      imageUrl: "/placeholder.svg?height=800&width=600",
    },
    {
      id: "4",
      title: "チラシデザイン",
      type: "flyer",
      createdAt: "2023-05-04",
      imageUrl: "/placeholder.svg?height=600&width=600",
    },
    {
      id: "5",
      title: "Youtubeテロップ",
      type: "youtube",
      createdAt: "2023-05-05",
      imageUrl: "/placeholder.svg?height=400&width=800",
    },
    {
      id: "6",
      title: "バナーデザイン2",
      type: "banner",
      createdAt: "2023-05-06",
      imageUrl: "/placeholder.svg?height=400&width=800",
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
                <h1 className="text-3xl font-bold">作成履歴</h1>
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
                {historyItems.map((item) => (
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

