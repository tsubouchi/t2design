"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Download, RefreshCw, Upload } from "lucide-react"
import Image from "next/image"
import { ProtectedRoute } from "@/components/protected-route"
import { FocusCards } from "@/components/ui/focus-cards"

export default function CreatePage() {
  const [step, setStep] = useState(1)
  const [designType, setDesignType] = useState("")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [customWidth, setCustomWidth] = useState("1200")
  const [customHeight, setCustomHeight] = useState("1200")
  const [prompt, setPrompt] = useState("")
  const [referenceUrl, setReferenceUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<string[]>([])
  const [selectedResult, setSelectedResult] = useState<number | null>(null)

  const designCards = [
    {
      title: "バナー",
      src: "/placeholder.svg?height=600&width=1200",
      type: "banner",
    },
    {
      title: "雑誌表紙",
      src: "/placeholder.svg?height=800&width=600",
      type: "magazine",
    },
    {
      title: "ポスター",
      src: "/placeholder.svg?height=800&width=600",
      type: "poster",
    },
    {
      title: "チラシ",
      src: "/placeholder.svg?height=600&width=600",
      type: "flyer",
    },
    {
      title: "Youtubeテロップ",
      src: "/placeholder.svg?height=600&width=1200",
      type: "youtube",
    },
    {
      title: "ロゴ",
      src: "/placeholder.svg?height=600&width=600",
      type: "logo",
    },
  ]

  const handleSelectDesignType = (index: number) => {
    setDesignType(designCards[index].type)
    setStep(2)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)

    try {
      // プロンプトの作成
      const designPrompt = `Create a ${designType} design with the following specifications:
        - Aspect ratio: ${aspectRatio}
        - Width: ${customWidth}px
        - Height: ${customHeight}px
        - Description: ${prompt}
        ${referenceUrl ? `- Reference URL: ${referenceUrl}` : ''}
      `

      // AIモデルを呼び出してデザインを生成
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: designPrompt,
          type: designType,
          size: `${customWidth}x${customHeight}`,
          aspectRatio,
        }),
      })

      if (!response.ok) {
        throw new Error('デザインの生成に失敗しました')
      }

      const data = await response.json()
      setResults(data.images)
      setProgress(100)
    } catch (error) {
      console.error('Error generating design:', error)
      // エラー処理を追加する必要があります
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = () => {
    setSelectedResult(null)
    handleGenerate()
  }

  const handleDownload = async (format: "svg" | "png") => {
    if (selectedResult === null) return

    try {
      const response = await fetch(`/api/designs/${results[selectedResult]}/download?format=${format}`)
      if (!response.ok) {
        throw new Error('ダウンロードに失敗しました')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `design.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading design:', error)
      // エラー処理を追加する必要があります
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header showCredits={true} />
        <main className="flex-1">
          <div className="container py-8">
            <div className="grid gap-6">
              <h1 className="text-3xl font-bold">デザイン作成</h1>

              {step === 1 && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>1) 目的を選ぶ</Label>
                    <p className="text-sm text-muted-foreground mb-4">作成したいデザインの種類を選択してください</p>
                    <FocusCards cards={designCards} onSelect={handleSelectDesignType} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                      戻る
                    </Button>
                    <h2 className="text-xl font-semibold">
                      {designCards.find((card) => card.type === designType)?.title} デザイン
                    </h2>
                  </div>

                  <div className="grid gap-2">
                    <Label>2) サイズを選ぶ</Label>
                    <RadioGroup value={aspectRatio} onValueChange={setAspectRatio} className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1:1" id="ratio-1-1" />
                        <Label htmlFor="ratio-1-1">1:1</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4:3" id="ratio-4-3" />
                        <Label htmlFor="ratio-4-3">4:3</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="16:9" id="ratio-16-9" />
                        <Label htmlFor="ratio-16-9">16:9</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="9:16" id="ratio-9-16" />
                        <Label htmlFor="ratio-9-16">9:16</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="ratio-custom" />
                        <Label htmlFor="ratio-custom">カスタム</Label>
                      </div>
                    </RadioGroup>

                    {aspectRatio === "custom" && (
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="grid gap-2">
                          <Label htmlFor="custom-width">幅 (px)</Label>
                          <Input
                            id="custom-width"
                            type="number"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="custom-height">高さ (px)</Label>
                          <Input
                            id="custom-height"
                            type="number"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="prompt">要望テキスト</Label>
                    <Textarea
                      id="prompt"
                      placeholder="デザインの要望を詳しく入力してください"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reference-url">参照URL (任意)</Label>
                    <Input
                      id="reference-url"
                      placeholder="参考にしたいデザインのURLを入力"
                      value={referenceUrl}
                      onChange={(e) => setReferenceUrl(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>参照画像 (任意)</Label>
                    <div className="border-2 border-dashed rounded-lg p-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">ここに画像をドラッグ＆ドロップ、または</p>
                        <Button variant="outline" size="sm">
                          ファイルを選択
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          または{" "}
                          <Button variant="link" className="p-0 h-auto">
                            参照画像を省略
                          </Button>
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleGenerate} disabled={!prompt || isGenerating} className="w-full">
                    生成する
                  </Button>

                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>生成中...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}

                  {results.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold">生成結果</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {results.map((result, index) => (
                          <Card
                            key={index}
                            className={`cursor-pointer overflow-hidden ${selectedResult === index ? "ring-2 ring-primary" : ""}`}
                            onClick={() => setSelectedResult(index)}
                          >
                            <CardContent className="p-0">
                              <div className="relative aspect-square">
                                <Image
                                  src={result || "/placeholder.svg"}
                                  alt={`生成結果 ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <Button onClick={handleRegenerate} variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          再生成
                        </Button>
                        <Button onClick={() => handleDownload("svg")} disabled={selectedResult === null}>
                          <Download className="mr-2 h-4 w-4" />
                          SVGダウンロード
                        </Button>
                        <Button
                          onClick={() => handleDownload("png")}
                          disabled={selectedResult === null}
                          variant="outline"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          PNGダウンロード
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}

