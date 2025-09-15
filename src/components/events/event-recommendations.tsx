// src/components/events/event-recommendations.tsx
"use client";

import { getPersonalizedEventRecommendations, PersonalizedEventRecommendationsOutput } from "@/ai/flows/personalized-event-recommendations";
import { events } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function getRecommendationsAction(): Promise<PersonalizedEventRecommendationsOutput> {
  // In a real app, this would come from a user profile
  const userPreferences =
    "Loves indie rock bands, frequently visits The Grand Amphitheater, and has attended several art gallery openings. Enjoys classical music and dramatic plays.";

  const availableEventsString = JSON.stringify(
    events.map((e) => ({
      name: e.name,
      description: e.description,
      venue: e.venue,
      date: e.date,
      category: e.category,
    }))
  );

  const recommendations = await getPersonalizedEventRecommendations({
    userPreferences,
    availableEvents: availableEventsString,
  });

  return recommendations;
}

export function EventRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleGetRecommendations = () => {
    startTransition(async () => {
      const result = await getRecommendationsAction();
      // Simple parsing assuming the AI returns a newline-separated list
      setRecommendations(result.recommendations.split('\n').filter(r => r.trim() !== ''));
    });
  };
  
  return (
    <section className="mb-16">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="text-center">
          <Wand2 className="mx-auto h-8 w-8 text-primary mb-2"/>
          <CardTitle className="font-headline text-2xl">Personalized For You</CardTitle>
          <CardDescription>
            Get event recommendations based on your interests.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {recommendations.length === 0 && !isPending && (
            <Button onClick={handleGetRecommendations} disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Wand2 className="w-4 h-4 mr-2"/>
              Generate Recommendations
            </Button>
          )}

          {isPending && (
             <div className="space-y-2 max-w-md mx-auto">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
             </div>
          )}

          {recommendations.length > 0 && !isPending && (
            <div className="text-left max-w-md mx-auto bg-card p-4 rounded-lg">
                <h4 className="font-bold mb-2">Here are some events you might like:</h4>
                <ul className="list-disc list-inside space-y-1 text-card-foreground">
                    {recommendations.map((rec, index) => (
                        <li key={index}>{rec.replace(/^- /, '')}</li>
                    ))}
                </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
