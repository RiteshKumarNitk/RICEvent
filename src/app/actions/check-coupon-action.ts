

"use server";

import { z } from "zod";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Member } from "@/lib/types";

const CouponCheckSchema = z.object({
    couponCode: z.string(),
    eventId: z.string(),
});

type CouponCheckResult = {
    isValid: boolean;
    isAlreadyUsed: boolean;
    memberName: string | null;
    error?: string;
}

export async function checkCouponAction(formData: FormData): Promise<CouponCheckResult> {
    const validatedFields = CouponCheckSchema.safeParse({
        couponCode: formData.get('couponCode'),
        eventId: formData.get('eventId'),
    });

    if (!validatedFields.success) {
        return { isValid: false, isAlreadyUsed: false, memberName: null, error: 'Invalid input.' };
    }

    const { couponCode, eventId } = validatedFields.data;

    let memberData: Member | null = null;
    try {
        const membersQuery = query(collection(db, "members"));
        const querySnapshot = await getDocs(membersQuery);
        if (querySnapshot.empty) {
            return { isValid: false, isAlreadyUsed: false, memberName: null };
        }
        
        const allMembers = querySnapshot.docs.map(doc => doc.data() as Member);
        const foundMember = allMembers.find(member => member.couponCode === couponCode);

        if (!foundMember) {
            return { isValid: false, isAlreadyUsed: false, memberName: null };
        }
        memberData = foundMember;

    } catch(e) {
        console.error("Error querying members collection:", e);
        return { isValid: false, isAlreadyUsed: false, memberName: null, error: 'Could not verify coupon code.' };
    }
    
    try {
        const bookingsQuery = query(
            collection(db, "bookings"),
            where("eventId", "==", eventId)
        );
        const bookingSnapshots = await getDocs(bookingsQuery);
        
        let isUsed = false;
        bookingSnapshots.forEach(doc => {
            const booking = doc.data();
            if (Array.isArray(booking.attendees)) {
                 if (booking.attendees.some((attendee: any) => attendee.isMember && attendee.couponCode === couponCode)) {
                    isUsed = true;
                }
            }
        });

        if (isUsed) {
            return { isValid: true, isAlreadyUsed: true, memberName: memberData.name };
        }

    } catch (e: any) {
        console.error("Firestore booking query failed:", e);
        return { isValid: false, isAlreadyUsed: false, memberName: null, error: 'Could not verify coupon during booking check.' };
    }
    
    return { isValid: true, isAlreadyUsed: false, memberName: memberData.name };
}


