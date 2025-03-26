import Anthropic from '@anthropic-ai/sdk';
import { fal } from '@fal-ai/client';

// Claudeクライアントの初期化
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// fal.aiクライアントの初期化
fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY,
});

export interface GenerateDesignParams {
  prompt: string;
  type: 'banner' | 'poster' | 'magazineCover' | 'flyer' | 'youtubeThumbnail';
  size: '1:1' | '4:3' | '16:9' | '9:16' | 'custom';
  customSize?: { width: number; height: number };
  referenceImage?: string;
}

export async function generateDesign(params: GenerateDesignParams) {
  try {
    // 1. fal.aiで画像を生成
    const imageResult = await fal.subscribe('flux-pro/v1.1-ultra', {
      input: {
        prompt: params.prompt,
        image_size: getImageSize(params.size, params.customSize),
        num_images: 4,
      },
    });

    // 2. ClaudeでSVGを生成
    const svgPrompt = `以下の要件に従ってSVGデザインを生成してください：
    タイプ: ${params.type}
    サイズ: ${params.size}
    画像URL: ${imageResult.images[0].url}
    プロンプト: ${params.prompt}

    注意点：
    1. 出力は<svg>タグを含む正しいXML形式で出力してください
    2. 余計な文字列は含めず、必要なら<!-- -->でコメントを入れてください
    3. アートワークとして見栄えを重視し、適切に<defs>や<g>などを活用してください
    4. テキスト要素のフォントや色、パス描画、グラデーションなどを使い、美しいデザインになるように工夫してください
    5. ユーザーの指示にあったテーマや配置を忠実に再現しつつ、バランスや余白を考慮してください
    6. 可能な限りベクターデータを利用し、画像のエンベッドは必要最低限にしてください
    7. サイズは指定の比率を踏まえて必要に応じてviewBoxで調整してください`;

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      messages: [{ role: 'user', content: svgPrompt }],
    });

    return {
      images: imageResult.images,
      svg: message.content[0].text,
    };
  } catch (error) {
    console.error('Error generating design:', error);
    throw error;
  }
}

function getImageSize(size: string, customSize?: { width: number; height: number }) {
  if (size === 'custom' && customSize) {
    return `${customSize.width}x${customSize.height}`;
  }

  const sizes = {
    '1:1': '1024x1024',
    '4:3': '1024x768',
    '16:9': '1024x576',
    '9:16': '576x1024',
  };

  return sizes[size as keyof typeof sizes];
} 