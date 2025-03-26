import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { generateDesign } from '@/lib/ai';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/lib/firebase';

export function DesignForm() {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'banner' | 'poster' | 'magazineCover' | 'flyer' | 'youtubeThumbnail'>('banner');
  const [size, setSize] = useState<'1:1' | '4:3' | '16:9' | '9:16' | 'custom'>('16:9');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ images: any[]; svg: string } | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const design = await generateDesign({
        prompt,
        type,
        size,
      });

      setResult(design);
      await saveDesign(design);
      toast({
        title: 'デザイン生成完了',
        description: '新しいデザインが生成され、保存されました。',
      });
    } catch (error) {
      console.error('Error generating design:', error);
      toast({
        title: 'エラー',
        description: 'デザインの生成中にエラーが発生しました。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveDesign = async (design: { images: any[]; svg: string }) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('ユーザーが認証されていません');
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          type,
          size,
          ...design,
        }),
      });

      if (!response.ok) {
        throw new Error('デザインの保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving design:', error);
      toast({
        title: 'エラー',
        description: 'デザインの保存中にエラーが発生しました。',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              プロンプト
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="デザインの説明を入力してください..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                タイプ
              </label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
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
              <Select value={size} onValueChange={(value: any) => setSize(value)}>
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

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? '生成中...' : 'デザインを生成'}
          </Button>
        </form>
      </Card>

      {result && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">生成結果</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">生成画像</h4>
              <div className="grid grid-cols-2 gap-2">
                {result.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">SVG</h4>
              <div className="border rounded-lg p-4 bg-gray-50">
                <pre className="text-xs overflow-auto">
                  {result.svg}
                </pre>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 