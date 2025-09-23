
'use server';

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Member, Booking } from '@/lib/types';


export async function checkMemberIdAction(memberId: string, eventId: string): Promise<{ isValid: boolean; message: string; memberName?: string }> {
  if (!memberId || !eventId) {
    return { isValid: false, message: 'Member ID and Event ID are required.' };
  }

  try {
    // 1. Check if the member ID exists in the members collection
    const membersQuery = query(collection(db, 'members'), where('memberId', '==', parseInt(memberId, 10)));
    const memberSnapshot = await getDocs(membersQuery);

    if (memberSnapshot.empty) {
      return { isValid: false, message: 'Invalid Member ID. This ID is not valid.' };
    }

    const memberData = memberSnapshot.docs[0].data() as Member;

    // 2. Check if the member ID has already been used for this event
    const bookingsQuery = query(collection(db, 'bookings'), where('eventId', '==', eventId));
    const bookingSnapshots = await getDocs(bookingsQuery);
    
    const allBookingsForEvent = bookingSnapshots.docs.map(doc => doc.data() as Booking);

    const isMemberIdUsed = allBookingsForEvent.some(booking => 
        booking.attendees.some(attendee => 
            attendee.isMember && String(attendee.memberId) === String(memberId)
        )
    );

    if (isMemberIdUsed) {
      return { isValid: false, message: 'This Member ID has already been used for a booking at this event.' };
    }

    // If we reach here, the ID is valid and has not been used for this event
    return { isValid: true, message: 'Member ID verified successfully!', memberName: memberData.name };

  } catch (error) {
    console.error("Error verifying member ID:", error);
    return { isValid: false, message: 'An unexpected error occurred during verification.' };
  }
}
