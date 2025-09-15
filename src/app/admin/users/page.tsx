import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for users
const users = [
  { id: "1", name: "John Doe", email: "john.doe@example.com", registeredOn: "2024-08-01" },
  { id: "2", name: "Jane Smith", email: "jane.smith@example.com", registeredOn: "2024-08-02" },
  { id: "3", name: "Peter Jones", email: "peter.jones@example.com", registeredOn: "2024-08-02" },
  { id: "4", name: "Susan Williams", email: "susan.williams@example.com", registeredOn: "2024-08-03" },
];

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Registered Users</h1>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.registeredOn).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}