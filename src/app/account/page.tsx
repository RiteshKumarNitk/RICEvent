"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="container text-center py-12">Loading your account details...</div>;
  }

  // Mock registered events
  const registeredEvents = [
    { id: "1", name: "Starlight Symphony Orchestra", date: "2024-09-15" },
    { id: "3", name: "Modern Art & Abstract Forms", date: "2024-09-20" },
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback>{user.displayName ? user.displayName[0] : user.email ? user.email[0].toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.displayName || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">Edit Profile</Button>
              <Button variant="destructive" className="w-full" onClick={logout}>Log Out</Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Registered Events</CardTitle>
              <CardDescription>Events you have booked.</CardDescription>
            </CardHeader>
            <CardContent>
              {registeredEvents.length > 0 ? (
                <ul className="space-y-4">
                  {registeredEvents.map((event, index) => (
                    <li key={event.id}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{event.name}</p>
                          <p className="text-sm text-muted-foreground">Date: {new Date(event.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">View Booking</Button>
                          <Button variant="destructive" size="sm">Cancel</Button>
                        </div>
                      </div>
                      {index < registeredEvents.length - 1 && <Separator className="mt-4" />}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center">You have no registered events.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
