"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TicketIcon } from "../icons/ticket-icon";
import { ChevronDown, Menu, Search } from "lucide-react";
import { Input } from "../ui/input";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-4 flex items-center space-x-2">
          <TicketIcon className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl hidden sm:inline-block">
            Eventide
          </span>
        </Link>
        
        <div className="flex-1 max-w-xl">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input placeholder="Search for Movies, Events, Plays, Sports and Activities" className="pl-10 h-10" />
           </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-2">
             <Button variant="ghost" className="text-sm">
                Mumbai <ChevronDown className="h-4 w-4 ml-1" />
             </Button>
             <Button className="bg-primary hover:bg-primary/90 text-sm h-8">
               Sign In
             </Button>
          </nav>
          <Button variant="ghost" className="md:hidden">
              <Search className="h-5 w-5"/>
              <span className="sr-only">Search</span>
          </Button>
           <Button variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5"/>
              <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
       <nav className="bg-background text-sm text-muted-foreground">
        <div className="container max-w-screen-2xl mx-auto flex items-center justify-between h-10">
            <div className="flex items-center gap-6">
                <Link href="#" className="hover:text-primary">Movies</Link>
                <Link href="#" className="hover:text-primary">Stream</Link>
                <Link href="#" className="hover:text-primary">Events</Link>
                <Link href="#" className="hover:text-primary">Plays</Link>
                <Link href="#" className="hover:text-primary">Sports</Link>
                <Link href="#" className="hover:text-primary">Activities</Link>
            </div>
             <div className="hidden md:flex items-center gap-6">
                <Link href="#" className="hover:text-primary">ListYourShow</Link>
                <Link href="#" className="hover:text-primary">Corporates</Link>
                <Link href="#" className="hover:text-primary">Offers</Link>
                <Link href="#" className="hover:text-primary">Gift Cards</Link>
            </div>
        </div>
      </nav>
    </header>
  );
}
