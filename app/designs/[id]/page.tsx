"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import { doc, getDoc, deleteDoc } from "firebase/firestore"
import Link from "next/link"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface Design {
  id: string
  prompt: string
  type: string
  size: string
  images: { url: string }[]
  svg: string
  createdAt: string
}

export default function DesignDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [design, setDesign] = useState<Design | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const designRef = doc(db, 'designs', id as string)
        const designSnap = await getDoc(designRef)

        if (!designSnap.exists()) {
          throw new Error('デザインが見つかりません')
        }

        const designData = designSnap.data() as Design
        if (designData.userId !== user?.uid) {
          throw new Error('このデザインへのアクセス権がありません')
        }

        setDesign({ id: designSnap.id, ...designData })
      } catch (error) {
        console.error('Error fetching design:', error)
        toast({
          title: 'エラー',
          description: error instanceof Error ? error.message : 'デザインの取得に失敗しました',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    if (user && id) {
      fetchDesign()
    }
  }, [user, id, toast])

  const handleDelete = async () => {
    if (!design) return

    try {
      await deleteDoc(doc(db, 'designs', design.id))
      toast({
        title: '削除完了',
        description: 'デザインを削除しました',
      })
      // デザイン一覧ページにリダイレクト
      window.location.href = '/designs'
    } catch (error) {
      console.error('Error deleting design:', error)
      toast({
        title: 'エラー',
        description: 'デザインの削除に失敗しました',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <div className="container py-8">
              <div className="text-center">読み込み中...</div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  if (!design) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <div className="container py-8">
              <div className="text-center">デザインが見つかりません</div>
              <Button asChild className="mt-4">
                <Link href="/designs">デザイン一覧に戻る</Link>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">デザイン詳細</h1>
              <div className="space-x-4">
                <Button variant="outline" asChild>
                  <Link href={`/designs/${design.id}/edit`}>編集</Link>
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  削除
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>生成画像</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {design.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-auto rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>デザイン情報</CardTitle>
                  <CardDescription>
                    {format(new Date(design.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">プロンプト</h3>
                    <p className="text-muted-foreground">{design.prompt}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">タイプ</h3>
                    <p className="text-muted-foreground">{design.type}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">サイズ</h3>
                    <p className="text-muted-foreground">{design.size}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">SVG</h3>
                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                      {design.svg}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
} 