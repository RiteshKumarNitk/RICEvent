"use client"

import { SidebarProvider, Sidebar, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { Home, Calendar, Users, Settings, ShieldAlert, BadgePercent } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "admin@example.com";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/admin");
    }
  }, [user, loading, router]);


  const isActive = (path: string) => {
    // This will highlight "/admin/events/*" as well
    return pathname.startsWith(path) && (pathname === path || path !== '/admin');
  }

  if (loading || !user) {
    return <div className="container text-center py-12">Loading admin dashboard...</div>;
  }
  
  // Check if the user is the designated admin
  if (user.email !== ADMIN_EMAIL) {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 rounded-full p-3 w-fit">
                        <ShieldAlert className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="mt-4">Not Authorized</CardTitle>
                    <CardDescription>
                        You do not have permission to access this page. Please sign in with the admin account (<strong className="text-primary">{ADMIN_EMAIL}</strong>).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/login?redirect=/admin">Login as Admin</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                 <svg className="h-8 w-8 text-primary" viewBox="0 0 214 214" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M107 214C166.11 214 214 166.11 214 107C214 47.8903 166.11 0 107 0C47.8903 0 0 47.8903 0 107C0 166.11 47.8903 214 107 214Z" fill="currentColor"/>
                    <path d="M106.999 187.25C151.102 187.25 187.249 151.103 187.249 107C187.249 62.8971 151.102 26.75 106.999 26.75C62.8962 26.75 26.749 62.8971 26.749 107C26.749 151.103 62.8962 187.25 106.999 187.25Z" fill="white"/>
                    <path d="M107 167.75C140.692 167.75 167.75 140.692 167.75 107C167.75 73.3076 140.692 46.25 107 46.25C73.3076 46.25 46.25 73.3076 46.25 107C46.25 140.692 73.3076 167.75 107 167.75Z" fill="currentColor"/>
                  </svg>
                <h1 className="font-semibold text-xl">Admin Panel</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                 <Link href="/admin" passHref>
                    <SidebarMenuButton isActive={pathname === '/admin'}>
                        <Home />
                        <span>Dashboard</span>
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/admin/events" passHref>
                    <SidebarMenuButton isActive={isActive('/admin/events')}>
                        <Calendar />
                        <span>Events</span>
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
               <SidebarMenuItem>
                 <Link href="/admin/members" passHref>
                    <SidebarMenuButton isActive={isActive('/admin/members')}>
                        <BadgePercent />
                        <span>Members</span>
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/admin/users" passHref>
                    <SidebarMenuButton isActive={isActive('/admin/users')}>
                        <Users />
                        <span>Users</span>
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <div className="p-4 md:p-8">
             {children}
            </div>
        </SidebarInset>
    </SidebarProvider>
  )
}
