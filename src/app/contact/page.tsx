"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  subject: z.string().min(5, 'Subject must be at least 5 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export default function ContactPage() {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    function onSubmit(values: z.infer<typeof contactSchema>) {
        console.log(values);
        toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We'll get back to you shortly.",
        });
        form.reset();
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
                <p className="mt-4 text-xl text-muted-foreground">We&apos;d love to hear from you. Get in touch with us.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
                    <Card>
                        <CardContent className="pt-6">
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} placeholder="John Doe" /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input {...field} placeholder="you@example.com" /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="subject" render={({ field }) => (
                                        <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} placeholder="Inquiry about an event" /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="message" render={({ field }) => (
                                        <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea {...field} placeholder="Your message..." rows={5} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <Button type="submit" className="w-full">Send Message</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
                 <div>
                    <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                    <div className="space-y-6 text-lg">
                        <div className="flex items-start">
                            <MapPin className="h-8 w-8 mr-4 mt-1 text-primary" />
                            <div>
                                <h3 className="font-semibold">Address</h3>
                                <p className="text-muted-foreground">Jhalana Institutional Area, Jhalana Doongri, Jaipur, Rajasthan 302004</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Phone className="h-8 w-8 mr-4 mt-1 text-primary" />
                            <div>
                                <h3 className="font-semibold">Phone</h3>
                                <p className="text-muted-foreground">+91-141-1234567</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Mail className="h-8 w-8 mr-4 mt-1 text-primary" />
                            <div>
                                <h3 className="font-semibold">Email</h3>
                                <p className="text-muted-foreground">contact@ricjaipur.in</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
