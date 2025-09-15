import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import { TicketIcon } from "../icons/ticket-icon";

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-8 bg-card border-t border-border/40">
      <div className="container">
        <div className="flex justify-center items-center mb-6">
          <div className="border-t border-muted-foreground flex-grow"></div>
          <div className="mx-4 flex items-center gap-2 text-muted-foreground">
            <TicketIcon className="h-6 w-6 text-primary" />
            <span className="font-bold">Eventide</span>
          </div>
          <div className="border-t border-muted-foreground flex-grow"></div>
        </div>

        <div className="flex justify-center gap-6 mb-8 text-muted-foreground">
          <a href="#" className="hover:text-primary"><Facebook /></a>
          <a href="#" className="hover:text-primary"><Twitter /></a>
          <a href="#" className="hover:text-primary"><Instagram /></a>
          <a href="#" className="hover:text-primary"><Youtube /></a>
          <a href="#" className="hover:text-primary"><Linkedin /></a>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
            <p className="mb-4">
                Copyright {new Date().getFullYear()} &copy; Bigtree Entertainment Pvt. Ltd. All Rights Reserved.
            </p>
            <p>
                The content and images used on this site are copyright protected and copyrights vests with the respective owners. The usage of the content and images on this website is intended to promote the works and no endorsement of the artist shall be implied. Unauthorized use is prohibited and punishable by law.
            </p>
        </div>
      </div>
    </footer>
  );
}
