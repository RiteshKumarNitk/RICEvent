
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, Calendar, Database, AlertTriangle } from "lucide-react";
import { useEvents } from "./events/events-provider";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";

export default function AdminDashboard() {
  const { seedDatabase, events, deleteAllEvents } = useEvents();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
        setLoadingStats(false);
        return;
    }
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        // Fetch all bookings to calculate total revenue
        const bookingsSnapshot = await getDocs(collection(db, "bookings"));
        const bookings = bookingsSnapshot.docs.map(doc => doc.data() as Booking);
        const revenue = bookings.reduce((acc, booking) => acc + booking.total, 0);
        setTotalRevenue(revenue);
        
        // Fetch all users to get total user count
        const usersSnapshot = await getDocs(collection(db, "users"));
        setTotalUsers(usersSnapshot.size);

      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [events, user]); // Re-fetch stats if events change or user logs in

  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;
  
  const handleClearAndReseed = async () => {
    await deleteAllEvents();
    await seedDatabase();
  }

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
            {loadingStats ? <div className="text-2xl font-bold">...</div> : <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? <div className="text-2xl font-bold">...</div> : <div className="text-2xl font-bold">+{totalUsers.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">Total users in database</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{upcomingEvents}</div>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
               <div className="flex items-center gap-2">
                    <Button onClick={seedDatabase}>
                        <Database className="mr-2 h-4 w-4" />
                        Seed Sample Events
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Clear and Reseed
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will permanently delete all events from the database and replace them with the default sample events. This cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearAndReseed}>Yes, clear and reseed</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
               </div>
               <p className="text-sm text-muted-foreground">
                Seed adds sample events if the database is empty. Clear and Reseed will delete all current events first.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
