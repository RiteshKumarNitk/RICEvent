"use client";

import { useSearchParams, notFound, useRouter, useParams } from "next/navigation";
import { useEvents } from "@/app/admin/events/events-provider";
import { events as staticEvents } from "@/lib/data";
import { SeatingChart } from "@/components/events/seating-chart";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SeatsPage() {
  const params = useParams();
  const { id } = params;
  const { events } = useEvents();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const ticketCountParam = searchParams.get('tickets');
  const ticketCount = ticketCountParam ? parseInt(ticketCountParam, 10) : 0;

  const event = events.find((e) => e.id === id) || staticEvents.find(e => e.id === id);

  if (!event || !ticketCount) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
            <Button asChild variant="outline">
                <Link href={`/events/${id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Event
                </Link>
            </Button>
        </div>
        <SeatingChart event={event} ticketCount={ticketCount} />
    </div>
  );
}
