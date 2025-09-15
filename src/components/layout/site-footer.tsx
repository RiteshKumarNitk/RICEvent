import { TicketIcon } from "../icons/ticket-icon";

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2">
          <TicketIcon className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Eventide Tickets. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground">Facebook</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
