import { cn } from "@/lib/utils";

export const TheaterIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M2 12.5C2 7 7 2 12 2s10 5 10 10.5c0 2.25-1.75 4.5-5 4.5h-1c-2.5 0-4-1-4-2.5v-1.5c0-2-1.5-3.5-4-3.5Z" />
      <path d="M22 12.5c0 2.25-1.75 4.5-5 4.5h-1c-2.5 0-4-1-4-2.5v-1.5c0-2-1.5-3.5-4-3.5" />
    </svg>
  );
