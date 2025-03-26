import { FocusCards } from "@/components/ui/focus-cards"

export function FocusCardsDemo() {
  const cards = [
    {
      title: "バナー",
      src: "/placeholder.svg?height=600&width=1200",
    },
    {
      title: "雑誌表紙",
      src: "/placeholder.svg?height=800&width=600",
    },
    {
      title: "ポスター",
      src: "/placeholder.svg?height=800&width=600",
    },
    {
      title: "チラシ",
      src: "/placeholder.svg?height=600&width=600",
    },
    {
      title: "Youtubeテロップ",
      src: "/placeholder.svg?height=600&width=1200",
    },
    {
      title: "ロゴ",
      src: "/placeholder.svg?height=600&width=600",
    },
  ]

  return <FocusCards cards={cards} />
}

