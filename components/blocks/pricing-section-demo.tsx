import { PricingSection } from "@/components/blocks/pricing-section"

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"]

export const TIERS = [
  {
    id: "free",
    name: "Free",
    price: {
      monthly: "無料",
      yearly: "無料",
    },
    description: "個人利用や試用に最適",
    features: [
      "月5回（合計20枚）まで生成可能",
      "20ptクレジット付与",
      "基本機能利用可能",
      "コミュニティアクセス",
      "標準解像度出力",
    ],
    cta: "無料で始める",
  },
  {
    id: "standard",
    name: "Standard",
    price: {
      monthly: 3500,
      yearly: 2275,
    },
    description: "一般的な利用に最適",
    features: [
      "月100回（合計400枚）まで生成",
      "500ptクレジット付与",
      "すべての機能利用可能",
      "優先サポート",
      "高解像度出力",
    ],
    cta: "アップグレード",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: {
      monthly: 10500,
      yearly: 6825,
    },
    description: "プロフェッショナル向け",
    features: [
      "月500回（合計2000枚）まで生成",
      "1500ptクレジット付与",
      "すべての機能利用可能",
      "優先サポート",
      "最高解像度出力",
    ],
    cta: "アップグレード",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: {
      monthly: "カスタム",
      yearly: "カスタム",
    },
    description: "大規模チーム向け",
    features: ["無制限の生成回数", "カスタムクレジット", "専用サポート", "API連携", "カスタム機能開発"],
    cta: "お問い合わせ",
    highlighted: true,
  },
]

export function PricingSectionDemo() {
  return (
    <div className="relative flex justify-center items-center w-full mt-20 scale-90">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>
      <PricingSection
        title="シンプルな料金プラン"
        subtitle="あなたのニーズに合ったプランをお選びください"
        frequencies={PAYMENT_FREQUENCIES}
        tiers={TIERS}
      />
    </div>
  )
}

