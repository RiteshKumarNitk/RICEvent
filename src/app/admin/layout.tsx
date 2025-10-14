
"use client"

import { Home, Calendar, Users, Settings, ShieldAlert, BadgePercent, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const ADMIN_EMAIL = "admin@example.com";

const NavLink = ({ href, children, isActive }: { href: string, children: React.ReactNode, isActive: boolean }) => (
    <Link
        href={href}
        className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-muted text-primary"
        )}
    >
        {children}
    </Link>
)

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/admin");
    }
  }, [user, loading, router]);
  
   useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);


  const isActive = (path: string) => {
    return pathname === path || (pathname.startsWith(path) && path !== '/admin');
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

  const sidebarContent = (
      <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                    <svg className="h-6 w-6 text-primary" viewBox="0 0 214 214" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M107 214C166.11 214 214 166.11 214 107C214 47.8903 166.11 0 107 0C47.8903 0 0 47.8903 0 107C0 166.11 47.8903 214 107 214Z" fill="currentColor"/>
                        <path d="M106.999 187.25C151.102 187.25 187.249 151.103 187.249 107C187.249 62.8971 151.102 26.75 106.999 26.75C62.8962 26.75 26.749 62.8971 26.749 107C26.749 151.103 62.8962 187.25 106.999 187.25Z" fill="white"/>
                        <path d="M107 167.75C140.692 167.75 167.75 140.692 167.75 107C167.75 73.3076 140.692 46.25 107 46.25C73.3076 46.25 46.25 73.3076 46.25 107C46.25 140.692 73.3076 167.75 107 167.75Z" fill="currentColor"/>
                    </svg>
                    <span className="">Admin Panel</span>
                </Link>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <NavLink href="/admin" isActive={pathname === '/admin'}><Home className="h-4 w-4" />Dashboard</NavLink>
                    <NavLink href="/admin/events" isActive={isActive('/admin/events')}><Calendar className="h-4 w-4" />Events</NavLink>
                    <NavLink href="/admin/members" isActive={isActive('/admin/members')}><BadgePercent className="h-4 w-4" />Members</NavLink>
                    <NavLink href="/admin/users" isActive={isActive('/admin/users')}><Users className="h-4 w-4" />Users</NavLink>
                </nav>
            </div>
            <div className="mt-auto p-4 border-t">
                 <div className="flex items-center gap-3">
                     <Avatar>
                        <AvatarImage src={user.photoURL || undefined} />
                        <AvatarFallback>{user.displayName ? user.displayName[0] : user.email ? user.email[0].toUpperCase() : 'A'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm truncate">{user.displayName || 'Admin'}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                </div>
                <Button variant="destructive" className="w-full mt-4" onClick={logout}>Log Out</Button>
            </div>
        </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-[220px] lg:w-[280px] bg-muted/40 border-r transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {sidebarContent}
        </div>
        <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                    <Menu className="h-5 w-5"/>
                </Button>
                 <Link href="/admin" className="flex items-center gap-2 font-semibold">
                     <svg className="h-6 w-6 text-primary" viewBox="0 0 214 214" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M107 214C166.11 214 214 166.11 214 107C214 47.8903 166.11 0 107 0C47.8903 0 0 47.8903 0 107C0 166.11 47.8903 214 107 214Z" fill="currentColor"/>
                        <path d="M106.999 187.25C151.102 187.25 187.249 151.103 187.249 107C187.249 62.8971 151.102 26.75 106.999 26.75C62.8962 26.75 26.749 62.8971 26.749 107C26.749 151.103 62.8962 187.25 106.999 187.25Z" fill="white"/>
                        <path d="M107 167.75C140.692 167.75 167.75 140.692 167.75 107C167.75 73.3076 140.692 46.25 107 46.25C73.3076 46.25 46.25 73.3076 46.25 107C46.25 140.692 73.3076 167.75 107 167.75Z" fill="currentColor"/>
                    </svg>
                    <span>Admin Panel</span>
                </Link>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
                {children}
            </main>
        </div>
        {isSidebarOpen && isMobile && (
            <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}
    </div>
  )
}

    