"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, Calendar, Database } from "lucide-react";
import { useEvents } from "./events/events-provider";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { seedDatabase, events } = useEvents();

  // Mock data, to be replaced with real data from backend
  const stats = {
    totalRevenue: 45231.89,
    registeredUsers: 1250,
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length,
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
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity to display.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Database Tools</CardTitle>
            <CardDescription>Use these actions to manage your database.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button onClick={seedDatabase}>
                <Database className="mr-2 h-4 w-4" />
                Seed Sample Events
              </Button>
               <p className="text-sm text-muted-foreground">
                Adds sample events if the database is empty.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
