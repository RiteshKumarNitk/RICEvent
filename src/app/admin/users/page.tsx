
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import membersData from '@/lib/members.json';

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">RIC Members</h1>
      <p className="text-muted-foreground mb-8">This is a list of all registered members.</p>
      <Card>
        <CardHeader>
            <CardTitle>Members List</CardTitle>
            <CardDescription>
                A total of {membersData.length} members found in the system.
            </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>DOA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membersData.map((member) => (
                <TableRow key={member["Member ID"]}>
                  <TableCell className="font-medium">{member["Member ID"]}</TableCell>
                  <TableCell>{member["Member Details"].Name}</TableCell>
                  <TableCell>{member["Member Details"].Email}</TableCell>
                   <TableCell>{member["Member Details"].Phone}</TableCell>
                  <TableCell>{member.DOA}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
