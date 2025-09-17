"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Event, Seat } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CheckCircle2, ArrowRight, ArrowLeft, CreditCard, User, FileText } from 'lucide-react';
import Link from 'next/link';

const isPaidEvent = (event: Event) => {
    return event.ticketTypes.some(t => t.price > 0);
}

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
});

const paymentSchema = z.object({
    cardName: z.string().min(2, 'Name on card is required.'),
    cardNumber: z.string().length(16, 'Card number must be 16 digits.'),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format.'),
    cvc: z.string().min(3, 'CVC must be 3 or 4 digits.').max(4),
});

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  selectedSeats: Seat[];
}

export function CheckoutDialog({ isOpen, onOpenChange, event, selectedSeats }: CheckoutDialogProps) {
  const [step, setStep] = useState(1);
  const eventIsPaid = isPaidEvent(event);

  const steps = eventIsPaid ? ['Seats', 'Payment', 'Invoice'] : ['Confirm', 'Invoice'];
  const icons = eventIsPaid ? [User, CreditCard, FileText] : [User, FileText];

  const finalCheckoutSchema = eventIsPaid ? checkoutSchema.merge(paymentSchema) : checkoutSchema;

  const form = useForm<z.infer<typeof finalCheckoutSchema>>({
    resolver: zodResolver(finalCheckoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      ...(eventIsPaid && {
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
      }),
    },
  });

  const ticketPrice = event.ticketTypes.find(t => t.type === 'Standard')?.price || 0;
  const subtotal = selectedSeats.length * ticketPrice;
  const total = subtotal;

  const onSubmit = (values: z.infer<typeof finalCheckoutSchema>) => {
    console.log('Form submitted with values:', values);
    setStep(steps.length); // Move to the last step (Invoice)
  };

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) { // User Info Step
        isValid = await form.trigger(['fullName', 'email']);
    } else if (step === 2 && eventIsPaid) { // Payment Step
        isValid = await form.trigger(['cardName', 'cardNumber', 'expiryDate', 'cvc']);
    }

    if (isValid) {
        setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };
  
  const resetAndClose = () => {
    form.reset();
    setStep(1);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={resetAndClose}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Complete Your Booking</DialogTitle>
           <div className="flex justify-center items-center my-4">
            {steps.map((s, index) => {
              const Icon = icons[index];
              const isActive = step === index + 1;
              const isCompleted = step > index + 1;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center border-2",
                        isActive ? "bg-primary text-primary-foreground border-primary" :
                        isCompleted ? "bg-green-500 text-white border-green-500" :
                        "bg-muted border-muted-foreground/30"
                    )}>
                        {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                    </div>
                    <p className={cn("text-sm mt-2", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>{s}</p>
                  </div>
                  {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-border mx-2"></div>}
                </React.Fragment>
              )
            })}
           </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div>
                        <h3 className="font-semibold mb-4 text-lg">Your Information</h3>
                         <div className="space-y-4">
                            <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-lg">Order Summary</h3>
                        <div className="space-y-4 rounded-lg border p-4">
                            <div className="flex items-start gap-4">
                                <Image src={event.image} alt={event.name} width={64} height={64} className="rounded-md object-cover aspect-square" />
                                <div>
                                    <h4 className="font-semibold">{event.name}</h4>
                                    <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'MMMM d, yyyy')}</p>
                                </div>
                            </div>
                            <Separator />
                             <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Seats</span>
                                <span className="font-medium">{selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(', ') : 'General Admission'} ({selectedSeats.length})</span>
                            </div>
                            {eventIsPaid && <>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Price per ticket</span>
                                    <span className="font-medium">${ticketPrice.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-base">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </>}
                            {!eventIsPaid && <p className="text-muted-foreground text-sm">This is a free event.</p>}
                        </div>
                    </div>
                </div>
            )}
            
            {step === 2 && eventIsPaid && (
                 <div className="mt-6">
                    <h3 className="font-semibold mb-4 text-lg">Payment Details</h3>
                    <div className="space-y-4">
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
                </div>
            )}
            
            {(step === steps.length) && (
              <div className="text-center py-8">
                  <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                  <p className="text-muted-foreground">Thank you. Your booking for {event.name} is complete.</p>
                   <p className="text-muted-foreground text-sm mt-2">A confirmation has been sent to {form.getValues('email')}.</p>
                  <div className="mt-6 flex justify-center gap-4">
                     <Button asChild variant="outline" onClick={resetAndClose}>
                      <Link href="/account">View My Bookings</Link>
                    </Button>
                    <Button onClick={resetAndClose}>Close</Button>
                  </div>
              </div>
            )}

            <DialogFooter className="mt-8">
                {step > 1 && step < steps.length && (
                    <Button variant="outline" onClick={handleBack} type="button">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                )}
                {step < steps.length -1  && (
                    <Button onClick={handleNext} type="button" className="ml-auto">
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
                {step === steps.length - 1 && (
                     <Button type="submit" className="ml-auto">
                        {eventIsPaid ? 'Confirm Purchase' : 'Register'}
                    </Button>
                )}
                 {step === steps.length && (
                     <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={resetAndClose}>Close</Button>
                     </DialogClose>
                 )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
