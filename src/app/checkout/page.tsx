import { Suspense } from 'react';
import { CheckoutForm } from '@/components/checkout/checkout-form';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Complete Your Registration</h1>
        <Suspense fallback={<div className="text-center">Loading your order...</div>}>
            <CheckoutForm />
        </Suspense>
    </div>
  );
}
