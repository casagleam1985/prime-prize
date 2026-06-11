import { Link } from "wouter";
import { Trophy, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t-4 border-accent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-serif font-bold text-2xl tracking-tight text-white mb-4">
              <Trophy className="h-6 w-6 text-accent" />
              Prime Prize
            </Link>
            <p className="text-secondary-foreground/70 mb-6 max-w-sm">
              The UK's most trusted prize competition platform. Genuine winners, transparent draws, life-changing prizes.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-secondary-foreground/70 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/70 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/70 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-lg text-white mb-4">Live Draws</h4>
            <ul className="space-y-3">
              <li><Link href="/competitions" className="text-secondary-foreground/70 hover:text-accent transition-colors">Live Draws</Link></li>
              <li><Link href="/draw-results" className="text-secondary-foreground/70 hover:text-accent transition-colors">Past Results</Link></li>
              <li><Link href="/winners" className="text-secondary-foreground/70 hover:text-accent transition-colors">Our Winners</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-lg text-white mb-4">Help & Info</h4>
            <ul className="space-y-3">
              <li><Link href="/how-it-works" className="text-secondary-foreground/70 hover:text-accent transition-colors">How it Works</Link></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-accent transition-colors">FAQ</a></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-accent transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg text-white mb-4">Trust & Safety</h4>
            <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <span className="font-bold text-white text-sm">Excellent</span>
              </div>
              <p className="text-xs text-secondary-foreground/70">Based on 10,000+ reviews</p>
            </div>
            <p className="text-xs text-secondary-foreground/50">
              18+ only. Please play responsibly.
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary-foreground/50">
          <p>&copy; {new Date().getFullYear()} Prime Prize. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
