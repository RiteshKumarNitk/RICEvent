"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { events } from '@/lib/data';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  cardName: z.string().min(2, 'Name on card is required.'),
  cardNumber: z.string().length(16, 'Card number must be 16 digits.'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format.'),
  cvc: z.string().min(3, 'CVC must be 3 or 4 digits.').max(4),
});

const DISCOUNT_CODE = "SAVE10";

export function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const eventId = searchParams.get('eventId');
  const seatIds = searchParams.get('seats')?.split(',') || [];

  const event = useMemo(() => events.find((e) => e.id === eventId), [eventId]);
  
  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    },
  });

  if (!event) {
    return <div className="text-center text-destructive">Event not found. Please go back and try again.</div>;
  }
  
  const ticketPrice = event.ticketTypes.find(t => t.type === 'Standard')?.price || 0;
  const subtotal = seatIds.length * ticketPrice;
  const discountAmount = discountApplied ? subtotal * 0.10 : 0;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === DISCOUNT_CODE) {
        setDiscountApplied(true);
        toast({ title: 'Success', description: 'Discount applied successfully!' });
    } else {
        toast({ variant: 'destructive', title: 'Invalid Code', description: 'The discount code is not valid.' });
    }
  };

  function onSubmit(values: z.infer<typeof checkoutSchema>) {
    console.log('Form submitted with values:', values);
    router.push('/confirmation');
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <Image src={event.image} alt={event.name} width={100} height={100} className="rounded-lg" />
            <div>
              <CardTitle>{event.name}</CardTitle>
              <CardDescription>{format(new Date(event.date), 'MMMM d, yyyy')} at {event.venue}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Seats</span><span>{seatIds.join(', ')} ({seatIds.length})</span></div>
              <div className="flex justify-between"><span>Price per ticket</span><span>${ticketPrice.toFixed(2)}</span></div>
              <Separator />
              <div className="flex justify-between font-semibold"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            </div>
            <Separator className="my-4" />
             <div className="space-y-2">
                <Label htmlFor="discount">Discount Code</Label>
                <div className="flex space-x-2">
                    <Input id="discount" value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder="e.g. SAVE10" disabled={discountApplied}/>
                    <Button type="button" variant="secondary" onClick={handleApplyDiscount} disabled={discountApplied}>Apply</Button>
                </div>
            </div>
            {discountApplied && (
                <div className="flex justify-between text-destructive mt-2"><span>Discount (10%)</span><span>-${discountAmount.toFixed(2)}</span></div>
            )}
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-xl"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Details</h2>
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Payment Details</h3>
                     <FormField control={form.control} name="cardName" render={({ field }) => (
                        <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="cardNumber" render={({ field }) => (
                        <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input {...field} placeholder="0000 0000 0000 0000" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="flex space-x-4">
                        <FormField control={form.control} name="expiryDate" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input {...field} placeholder="MM/YY" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="cvc" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>CVC</FormLabel><FormControl><Input {...field} placeholder="123" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>

                <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Confirm Purchase</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
