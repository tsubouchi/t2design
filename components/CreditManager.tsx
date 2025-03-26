import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/lib/firebase';
import { realtimeDb } from '@/lib/firebase';
import { ref, onValue, set } from 'firebase/database';
import { loadStripe } from '@stripe/stripe-js';

export function CreditManager() {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const creditsRef = ref(realtimeDb, `users/${user.uid}/credits`);
    const unsubscribe = onValue(creditsRef, (snapshot) => {
      setCredits(snapshot.val() || 0);
    });

    return () => unsubscribe();
  }, []);

  const handlePurchaseCredits = async (amount: number) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        throw new Error('ユーザーが認証されていません');
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId: getPriceIdForCredits(amount),
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('支払いセッションの作成に失敗しました');
      }

      const { sessionId } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) {
        throw new Error('Stripeの読み込みに失敗しました');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast({
        title: 'エラー',
        description: 'クレジットの購入中にエラーが発生しました。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriceIdForCredits = (amount: number): string => {
    const priceIds: Record<number, string> = {
      100: process.env.NEXT_PUBLIC_STRIPE_CREDIT_100_PRICE_ID!,
      500: process.env.NEXT_PUBLIC_STRIPE_CREDIT_500_PRICE_ID!,
      1000: process.env.NEXT_PUBLIC_STRIPE_CREDIT_1000_PRICE_ID!,
      3000: process.env.NEXT_PUBLIC_STRIPE_CREDIT_3000_PRICE_ID!,
    };
    return priceIds[amount] || '';
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">クレジット残高</h3>
          <span className="text-2xl font-bold">{credits}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handlePurchaseCredits(100)}
            disabled={loading}
          >
            100クレジット
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePurchaseCredits(500)}
            disabled={loading}
          >
            500クレジット
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePurchaseCredits(1000)}
            disabled={loading}
          >
            1000クレジット
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePurchaseCredits(3000)}
            disabled={loading}
          >
            3000クレジット
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          <p>※ クレジットは1回のデザイン生成に1クレジット使用されます。</p>
          <p>※ 支払いはStripeを通じて安全に処理されます。</p>
        </div>
      </div>
    </Card>
  );
} 