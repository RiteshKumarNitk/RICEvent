import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 214 214" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M107 214C166.11 214 214 166.11 214 107C214 47.8903 166.11 0 107 0C47.8903 0 0 47.8903 0 107C0 166.11 47.8903 214 107 214Z" fill="currentColor"/>
                <path d="M106.999 187.25C151.102 187.25 187.249 151.103 187.249 107C187.249 62.8971 151.102 26.75 106.999 26.75C62.8962 26.75 26.749 62.8971 26.749 107C26.749 151.103 62.8962 187.25 106.999 187.25Z" fill="white"/>
                <path d="M107 167.75C140.692 167.75 167.75 140.692 167.75 107C167.75 73.3076 140.692 46.25 107 46.25C73.3076 46.25 46.25 73.3076 46.25 107C46.25 140.692 73.3076 167.75 107 167.75Z" fill="currentColor"/>
              </svg>
              <span className="font-bold text-xl">Rajasthan International Center</span>
            </Link>
            <p className="text-sm">Jhalana Institutional Area, Jhalana Doongri, Jaipur, Rajasthan 302004</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/events" className="text-sm hover:underline">Events</Link></li>
              <li><Link href="/about" className="text-sm hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="text-sm hover:underline">Contact</Link></li>
              <li><Link href="/faq" className="text-sm hover:underline">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook"><Facebook className="h-6 w-6" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6" /></Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-2">Subscribe to our newsletter to get the latest updates.</p>
            {/* Newsletter form can be added here */}
          </div>
        </div>
        <div className="mt-8 border-t border-muted-foreground/20 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Rajasthan International Center. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
