"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Search, User } from "lucide-react";
import { Input } from "../ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 214 214" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M107 214C166.11 214 214 166.11 214 107C214 47.8903 166.11 0 107 0C47.8903 0 0 47.8903 0 107C0 166.11 47.8903 214 107 214Z" fill="currentColor"/>
            <path d="M106.999 187.25C151.102 187.25 187.249 151.103 187.249 107C187.249 62.8971 151.102 26.75 106.999 26.75C62.8962 26.75 26.749 62.8971 26.749 107C26.749 151.103 62.8962 187.25 106.999 187.25Z" fill="white"/>
            <path d="M107 167.75C140.692 167.75 167.75 140.692 167.75 107C167.75 73.3076 140.692 46.25 107 46.25C73.3076 46.25 46.25 73.3076 46.25 107C46.25 140.692 73.3076 167.75 107 167.75Z" fill="currentColor"/>
          </svg>
          <span className="font-bold text-xl hidden sm:inline-block">
            RIC
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
          <Link href="/events" className="transition-colors hover:text-foreground/80 text-foreground/60">Events</Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
          <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">Contact</Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
           <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5"/>
            </Button>
           </div>
           <ThemeToggle />
           <Link href="/account">
              <Button variant="ghost" size="icon" aria-label="My Account">
                <User className="h-5 w-5"/>
              </Button>
           </Link>
           <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open Menu">
                  <Menu className="h-5 w-5"/>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4 p-4">
                  <Link href="/" className="transition-colors hover:text-foreground/80">Home</Link>
                  <Link href="/events" className="transition-colors hover:text-foreground/80">Events</Link>
                  <Link href="/about" className="transition-colors hover:text-foreground/80">About</Link>
                  <Link href="/contact" className="transition-colors hover:text-foreground/80">Contact</Link>
                </div>
              </SheetContent>
            </Sheet>
           </div>
        </div>
      </div>
    </header>
  );
}
