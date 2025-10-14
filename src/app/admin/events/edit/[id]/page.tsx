
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { useEvents } from "../../events-provider";
import { useEffect } from "react";
import { format } from "date-fns";
import { AdminSeatingChart } from "@/components/admin/admin-seating-chart";

const eventSchema = z.object({
  name: z.string().min(5, "Event name must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  category: z.enum(["Music", "Sports", "Art", "Theater", "Seminar", "Cultural", "Talk"]),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  venue: z.string().min(3, "Venue is required."),
  image: z.string().url("Please enter a valid URL."),
  reservedSeats: z.array(z.string()).optional(),
});

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const { events, updateEvent } = useEvents();
    const eventId = params.id as string;

    const event = events.find(e => e.id === eventId);

    const form = useForm<z.infer<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            reservedSeats: [],
        }
    });

    useEffect(() => {
        if (event) {
            form.reset({
                ...event,
                date: format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"),
                reservedSeats: event.reservedSeats || [],
            });
        }
    }, [event, form]);

    async function onSubmit(values: z.infer<typeof eventSchema>) {
        if (!event) return;

        const updatedEventData = {
            ...values,
            date: new Date(values.date).toISOString(),
            reservedSeats: values.reservedSeats?.map(s => s.trim().toUpperCase()).filter(Boolean) || [],
        };

        await updateEvent(event.id, updatedEventData);
        router.push("/admin/events");
    }

    if (!event) {
        return (
            <div>
                <h1 className="text-2xl font-bold">Event not found</h1>
                <p>Loading or event does not exist...</p>
                <Button asChild variant="link">
                    <Link href="/admin/events">Go back</Link>
                </Button>
            </div>
        )
    }
    
    const handleReservedSeatsChange = (newReservedSeats: string[]) => {
        form.setValue('reservedSeats', newReservedSeats, { shouldDirty: true });
    }

    return (
        <div>
            <div className="mb-8">
                <Button asChild variant="outline">
                    <Link href="/admin/events">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Events
                    </Link>
                </Button>
            </div>
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Event</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Event Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Music">Music</SelectItem>
                                        <SelectItem value="Sports">Sports</SelectItem>
                                        <SelectItem value="Art">Art</SelectItem>
                                        <SelectItem value="Theater">Theater</SelectItem>
                                        <SelectItem value="Seminar">Seminar</SelectItem>
                                        <SelectItem value="Cultural">Cultural</SelectItem>
                                        <SelectItem value="Talk">Talk</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="date" render={({ field }) => (
                                    <FormItem><FormLabel>Date & Time</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="venue" render={({ field }) => (
                                    <FormItem><FormLabel>Venue</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                             <FormField control={form.control} name="image" render={({ field }) => (
                                <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} placeholder="https://example.com/image.jpg" /></FormControl><FormMessage /></FormItem>
                            )} />
                             
                            {event.seatingChart && (
                                <FormField
                                    control={form.control}
                                    name="reservedSeats"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reserved Seats</FormLabel>
                                            <FormDescription>
                                                Click on seats in the chart below to reserve or un-reserve them.
                                            </FormDescription>
                                            <FormControl>
                                                <AdminSeatingChart 
                                                    event={event}
                                                    reservedSeats={field.value || []}
                                                    onReservedSeatsChange={handleReservedSeatsChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            
                            <div className="flex justify-end">
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
