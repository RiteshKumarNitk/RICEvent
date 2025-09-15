import { Suspense } from 'react';
import { CheckoutForm } from '@/components/checkout/checkout-form';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-16">
        <h1 className="text-4xl font-bold font-headline mb-8 text-center">Complete Your Purchase</h1>
        <Suspense fallback={<div className="text-center">Loading your order...</div>}>
            <CheckoutForm />
        </Suspense>
    </div>
  );
}
