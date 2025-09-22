
"use server";

import { z } from "zod";
import membersData from '@/lib/members.json';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const MemberCheckSchema = z.object({
    memberId: z.string(),
    eventId: z.string(),
});

type MemberCheckResult = {
    isValid: boolean;
    isAlreadyUsed: boolean;
    memberName: string | null;
    error?: string;
}

export async function checkMemberIdAction(formData: FormData): Promise<MemberCheckResult> {
    const validatedFields = MemberCheckSchema.safeParse({
        memberId: formData.get('memberId'),
        eventId: formData.get('eventId'),
    });

    if (!validatedFields.success) {
        return { isValid: false, isAlreadyUsed: false, memberName: null, error: 'Invalid input.' };
    }

    const { memberId, eventId } = validatedFields.data;

    // 1. Check if Member ID is valid
    const member = membersData.find(m => String(m["Member ID"]) === memberId);
    
    if (!member) {
        return { isValid: false, isAlreadyUsed: false, memberName: null };
    }

    // 2. Check if Member ID has already been used for this event
    try {
        const bookingsQuery = query(
            collection(db, "bookings"),
            where("eventId", "==", eventId)
        );
        const querySnapshot = await getDocs(bookingsQuery);
        
        let isUsed = false;
        querySnapshot.forEach(doc => {
            const booking = doc.data();
            if (booking.attendees && Array.isArray(booking.attendees)) {
                if (booking.attendees.some((attendee: any) => attendee.isMember && String(attendee.memberId) === memberId)) {
                    isUsed = true;
                }
            }
        });

        if (isUsed) {
            return { isValid: true, isAlreadyUsed: true, memberName: member["Member Details"].Name };
        }

    } catch (e: any) {
        console.error("Firestore query failed:", e);
        // If the query fails, we can't confirm, so deny the special access.
        return { isValid: false, isAlreadyUsed: false, memberName: null, error: 'Could not verify member ID.' };
    }
    
    // If we reach here, the member is valid and hasn't booked for this event
    return { isValid: true, isAlreadyUsed: false, memberName: member["Member Details"].Name };
}
