import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full h-16 w-16 flex items-center justify-center mb-4">
             <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl">Registration Confirmed!</CardTitle>
          <CardDescription className="text-lg">Thank you for your booking.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Your ticket and event details have been sent to your email address. You can also view your bookings in your account dashboard.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
             <Button asChild variant="outline">
              <Link href="/account">View My Bookings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
