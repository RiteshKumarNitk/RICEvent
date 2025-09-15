import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Calendar } from "lucide-react";

export default function AdminDashboard() {
  // Mock data, to be replaced with real data from backend
  const stats = {
    totalRevenue: 45231.89,
    registeredUsers: 1250,
    upcomingEvents: 4,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.registeredUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">2 scheduled for this week</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        {/* Placeholder for recent activity or more detailed charts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity to display.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}