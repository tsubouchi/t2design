import { DesignForm } from '@/components/DesignForm';

export default function GeneratePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">デザイン生成</h1>
      <DesignForm />
    </div>
  );
} 