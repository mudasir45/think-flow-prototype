import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 p-8 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}