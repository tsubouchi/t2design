import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import sharp from 'sharp'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format')

    // Firestoreからデザインを取得
    const designDoc = await getDoc(doc(db, 'designs', params.id))
    if (!designDoc.exists()) {
      return NextResponse.json(
        { error: 'デザインが見つかりません' },
        { status: 404 }
      )
    }

    const design = designDoc.data()
    const selectedImage = design.images[0] // 最初の画像を使用

    if (format === 'svg') {
      // SVGをそのまま返す
      return new NextResponse(selectedImage.svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': 'attachment; filename="design.svg"'
        }
      })
    } else if (format === 'png') {
      // SVGをPNGに変換
      const pngBuffer = await sharp(Buffer.from(selectedImage.svg))
        .png()
        .toBuffer()

      return new NextResponse(pngBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': 'attachment; filename="design.png"'
        }
      })
    }

    return NextResponse.json(
      { error: '無効なフォーマットです' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error downloading design:', error)
    return NextResponse.json(
      { error: 'ダウンロード中にエラーが発生しました' },
      { status: 500 }
    )
  }
} 