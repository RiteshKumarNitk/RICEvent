// src/ai/flows/personalized-event-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized event recommendations to users based on their past activity and preferences.
 *
 * - getPersonalizedEventRecommendations - A function that returns personalized event recommendations.
 * - PersonalizedEventRecommendationsInput - The input type for the getPersonalizedEventRecommendations function.
 * - PersonalizedEventRecommendationsOutput - The return type for the getPersonalizedEventRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEventRecommendationsInputSchema = z.object({
  userPreferences: z
    .string()
    .describe(
      'A description of the users past activity and preferences, such as categories of events they have attended, artists they like, and venues they frequent.'
    ),
  availableEvents: z
    .string()
    .describe(
      'A description of the available events including name, description, venue, and date.'
    ),
});
export type PersonalizedEventRecommendationsInput = z.infer<
  typeof PersonalizedEventRecommendationsInputSchema
>;

const PersonalizedEventRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of personalized event recommendations based on the user preferences and available events.'
    ),
});
export type PersonalizedEventRecommendationsOutput = z.infer<
  typeof PersonalizedEventRecommendationsOutputSchema
>;

export async function getPersonalizedEventRecommendations(
  input: PersonalizedEventRecommendationsInput
): Promise<PersonalizedEventRecommendationsOutput> {
  return personalizedEventRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedEventRecommendationsPrompt',
  input: {schema: PersonalizedEventRecommendationsInputSchema},
  output: {schema: PersonalizedEventRecommendationsOutputSchema},
  prompt: `You are an AI assistant that provides personalized event recommendations to users based on their past activity and preferences and the available events.

  User Preferences: {{{userPreferences}}}
  Available Events: {{{availableEvents}}}

  Based on the user preferences, recommend events from the available events that the user would be interested in. Only include events from the Available Events list.
  Return a string list of event recommendations.
  `,
});

const personalizedEventRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedEventRecommendationsFlow',
    inputSchema: PersonalizedEventRecommendationsInputSchema,
    outputSchema: PersonalizedEventRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
