import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { auth } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { prompt, type, size, images, svg } = await req.json();
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const design = {
      userId,
      prompt,
      type,
      size,
      images,
      svg,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'designs'), design);
    return NextResponse.json({ id: docRef.id, ...design });
  } catch (error) {
    console.error('Error saving design:', error);
    return NextResponse.json(
      { error: 'デザインの保存中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;

    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 });
    }

    const designsRef = collection(db, 'designs');
    const q = query(
      designsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limit * page)
    );

    const snapshot = await getDocs(q);
    const designs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      { error: 'デザインの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 