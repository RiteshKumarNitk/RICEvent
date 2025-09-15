"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const eventSchema = z.object({
  name: z.string().min(5, "Event name must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  category: z.enum(["Music", "Sports", "Art", "Theater", "Seminar", "Cultural", "Talk"]),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  venue: z.string().min(3, "Venue is required."),
  image: z.string().url("Please enter a valid URL."),
});

export default function CreateEventPage() {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "Seminar",
            date: "",
            venue: "",
            image: "",
        },
    });

    function onSubmit(values: z.infer<typeof eventSchema>) {
        console.log(values);
        toast({
            title: "Event Created!",
            description: "The new event has been added successfully.",
        });
        // Here you would typically send the data to your backend
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
                    <CardTitle>Create New Event</CardTitle>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <div className="flex justify-end">
                                <Button type="submit">Create Event</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}