
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Member } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import sampleMembers from '@/lib/members.json';

// Helper to convert DD-MM-YYYY to a date object string
const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('-');
  return new Date(`${year}-${month}-${day}`).toISOString();
};


interface MembersContextType {
  members: Member[];
  loading: boolean;
  addMember: (member: Omit<Member, 'id'>) => Promise<void>;
  updateMember: (id: string, member: Partial<Omit<Member, 'id'>>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  seedDatabase: () => Promise<void>;
}

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export const MembersProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'members'), (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Member, 'id'>,
      }));
      setMembers(membersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching members: ", error);
      toast({ variant: 'destructive', title: "Error", description: "Could not fetch members from the database."});
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const addMember = async (member: Omit<Member, 'id'>) => {
    try {
        await addDoc(collection(db, "members"), member);
        toast({ title: "Success", description: "Member created successfully."});
    } catch (error) {
        console.error("Error adding member: ", error);
        toast({ variant: 'destructive', title: "Error", description: "Could not create member."});
    }
  };

  const updateMember = async (id: string, member: Partial<Omit<Member, 'id'>>) => {
    try {
      const memberRef = doc(db, 'members', id);
      await updateDoc(memberRef, member);
      toast({ title: "Success", description: "Member updated successfully."});
    } catch (error) {
      console.error("Error updating member: ", error);
      toast({ variant: 'destructive', title: "Error", description: "Could not update member."});
    }
  };

  const deleteMember = async (id: string) => {
    try {
        await deleteDoc(doc(db, "members", id));
        toast({ title: "Success", description: "Member deleted successfully."});
    } catch (error) {
        console.error("Error deleting member: ", error);
        toast({ variant: 'destructive', title: "Error", description: "Could not delete member."});
    }
  };

  const seedDatabase = useCallback(async () => {
    try {
      const membersCollection = collection(db, 'members');
      const snapshot = await getDocs(membersCollection);

      if (snapshot.empty) {
        const batch = writeBatch(db);
        sampleMembers.forEach((member) => {
          const memberData = {
            applicationId: member["Application ID"],
            memberId: member["Member ID"],
            categoryType: member["Category Type"],
            categoryAcronym: member["Category Acronym"],
            doa: parseDate(member["DOA"]),
            name: member["Member Details"].Name.trim(),
            phone: member["Member Details"].Phone,
            email: member["Member Details"].Email,
            dob: parseDate(member["Member Details"].DOB),
            address: member["Member Details"].Address,
            emergencyContact: member["Member Details"]["Emergency Contact"],
          };
          const docRef = doc(membersCollection);
          batch.set(docRef, memberData);
        });
        await batch.commit();
        toast({ title: 'Database Seeded', description: 'Sample members have been added to Firestore.' });
      }
    } catch (error) {
      console.error('Error seeding members database:', error);
      toast({
        variant: 'destructive',
        title: 'Member Seeding Failed',
        description: 'Could not add sample members. Check Firestore security rules.',
      });
    }
  }, [toast]);
  
  useEffect(() => {
    if (!loading) {
      seedDatabase();
    }
  }, [loading, seedDatabase]);

  return (
    <MembersContext.Provider value={{ members, loading, addMember, updateMember, deleteMember, seedDatabase }}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => {
  const context = useContext(MembersContext);
  if (context === undefined) {
    throw new Error('useMembers must be used within a MembersProvider');
  }
  return context;
};
