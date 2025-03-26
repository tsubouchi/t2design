"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Design {
  id: string
  prompt: string
  type: string
  size: string
  images: { url: string }[]
  svg: string
  createdAt: string
  userId: string
}

export default function DesignEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [design, setDesign] = useState<Design | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!design) return

    try {
      setSaving(true)
      const designRef = doc(db, 'designs', design.id)
      await updateDoc(designRef, {
        prompt: design.prompt,
        type: design.type,
        size: design.size,
      })

      toast({
        title: '更新完了',
        description: 'デザインを更新しました',
      })
      router.push(`/designs/${design.id}`)
    } catch (error) {
      console.error('Error updating design:', error)
      toast({
        title: 'エラー',
        description: 'デザインの更新に失敗しました',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
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
              <h1 className="text-3xl font-bold">デザイン編集</h1>
              <Button variant="outline" asChild>
                <Link href={`/designs/${design.id}`}>キャンセル</Link>
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>デザイン情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="prompt" className="text-sm font-medium">
                      プロンプト
                    </label>
                    <Textarea
                      id="prompt"
                      value={design.prompt}
                      onChange={(e) => setDesign({ ...design, prompt: e.target.value })}
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="type" className="text-sm font-medium">
                        タイプ
                      </label>
                      <Select
                        value={design.type}
                        onValueChange={(value) => setDesign({ ...design, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="banner">バナー</SelectItem>
                          <SelectItem value="poster">ポスター</SelectItem>
                          <SelectItem value="magazineCover">雑誌カバー</SelectItem>
                          <SelectItem value="flyer">フライヤー</SelectItem>
                          <SelectItem value="youtubeThumbnail">YouTubeサムネイル</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="size" className="text-sm font-medium">
                        サイズ
                      </label>
                      <Select
                        value={design.size}
                        onValueChange={(value) => setDesign({ ...design, size: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1:1">1:1（正方形）</SelectItem>
                          <SelectItem value="4:3">4:3（横長）</SelectItem>
                          <SelectItem value="16:9">16:9（ワイド）</SelectItem>
                          <SelectItem value="9:16">9:16（縦長）</SelectItem>
                          <SelectItem value="custom">カスタム</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button type="submit" disabled={saving}>
                  {saving ? '保存中...' : '保存'}
                </Button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
} 