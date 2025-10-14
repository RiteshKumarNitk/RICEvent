

"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Member } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const memberSchema = z.object({
  couponCode: z.string().min(1, 'Coupon Code is required'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  doa: z.string().min(1, 'Date of association is required'),
});

type MemberFormData = z.infer<typeof memberSchema>;

const MemberForm = ({ member, onSave, closeDialog, newCouponCode }: { member?: Member | null, onSave: (data: MemberFormData, id?: string) => void, closeDialog: () => void, newCouponCode: string }) => {
  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: member || { couponCode: newCouponCode, name: '', email: '', phone: '', doa: '' },
  });

  useEffect(() => {
    if (!member && newCouponCode) {
      form.setValue('couponCode', newCouponCode);
    } else if (member) {
      form.reset({
        ...member,
        doa: member.doa || ''
      });
    }
  }, [member, newCouponCode, form]);

  const onSubmit = (data: MemberFormData) => {
    onSave(data, member?.id);
    closeDialog();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="couponCode" render={({ field }) => (
          <FormItem><FormLabel>Coupon Code</FormLabel><FormControl><Input {...field} readOnly /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="doa" render={({ field }) => (
          <FormItem><FormLabel>Date of Association</FormLabel><FormControl><Input placeholder="DD-MM-YYYY" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
          <Button type="submit">Save Member</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [newCouponCode, setNewCouponCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'members'), 
      (snapshot) => {
        const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
        setMembers(membersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching members:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch members.' });
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [toast]);
  
  const generateNewCouponCode = async () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    let isUnique = false;
    
    const querySnapshot = await getDocs(collection(db, 'members'));
    const existingCodes = new Set(querySnapshot.docs.map(doc => doc.data().couponCode));

    while (!isUnique) {
        code = 'RIC-MEMBER-';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (!existingCodes.has(code)) {
            isUnique = true;
            setNewCouponCode(code);
        }
    }
  }


  const handleSaveMember = async (data: MemberFormData, id?: string) => {
    try {
      if (id) {
        await updateDoc(doc(db, 'members', id), data);
        toast({ title: 'Success', description: 'Member updated successfully.' });
      } else {
        const newMemberData = { ...data, couponCode: newCouponCode };
        await addDoc(collection(db, 'members'), newMemberData);
        toast({ title: 'Success', description: 'Member added successfully.' });
      }
    } catch (error) {
      console.error("Error saving member:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save member.' });
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'members', id));
      toast({ title: 'Success', description: 'Member deleted successfully.' });
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete member.' });
    }
  };

  const openDialog = async (member: Member | null = null) => {
    setEditingMember(member);
    if (!member) {
      await generateNewCouponCode();
    } else {
        setNewCouponCode(member.couponCode);
    }
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">RIC Members</h1>
            <p className="text-muted-foreground">Manage your list of registered members.</p>
        </div>
        <Button onClick={() => openDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Member
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          </DialogHeader>
          { (isDialogOpen && (editingMember || newCouponCode)) &&
            <MemberForm 
              member={editingMember}
              onSave={handleSaveMember}
              closeDialog={() => setIsDialogOpen(false)}
              newCouponCode={newCouponCode}
            />
          }
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
          <CardDescription>A total of {members.length} members found in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>DOA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading members...</TableCell></TableRow>
              ) : members.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center">No members found. Add one!</TableCell></TableRow>
              ) : members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.couponCode}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.doa}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDialog(member)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete the member "{member.name}". This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteMember(member.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
