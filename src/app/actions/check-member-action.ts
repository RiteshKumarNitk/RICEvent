
"use server";

import { z } from "zod";
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

    // 1. Check if Member ID is valid by querying the members collection
    let memberData: any = null;
    try {
        const membersQuery = query(collection(db, "members"), where("memberId", "==", memberId));
        const querySnapshot = await getDocs(membersQuery);
        if (querySnapshot.empty) {
            return { isValid: false, isAlreadyUsed: false, memberName: null };
        }
        memberData = querySnapshot.docs[0].data();
    } catch(e) {
        console.error("Error querying members collection:", e);
        return { isValid: false, isAlreadyUsed: false, memberName: null, error: 'Could not verify member ID.' };
    }
    
    // 2. Check if Member ID has already been used for this event
    try {
        const bookingsQuery = query(
            collection(db, "bookings"),
            where("eventId", "==", eventId),
            where("attendees", "array-contains", { memberId: memberId, isMember: true }) // This is a simplification, Firestore requires the full object match for array-contains
        );
        const bookingSnapshots = await getDocs(collection(db, "bookings"));
        
        let isUsed = false;
        bookingSnapshots.forEach(doc => {
            const booking = doc.data();
            if (booking.eventId === eventId && Array.isArray(booking.attendees)) {
                 if (booking.attendees.some((attendee: any) => attendee.isMember && String(attendee.memberId) === memberId)) {
                    isUsed = true;
                }
            }
        });

        if (isUsed) {
            return { isValid: true, isAlreadyUsed: true, memberName: memberData.name };
        }

    } catch (e: any) {
        console.error("Firestore booking query failed:", e);
        // If the query fails, we can't confirm, so deny the special access.
        return { isValid: false, isAlreadyUsed: false, memberName: null, error: 'Could not verify member ID during booking check.' };
    }
    
    // If we reach here, the member is valid and hasn't booked for this event
    return { isValid: true, isAlreadyUsed: false, memberName: memberData.name };
}
