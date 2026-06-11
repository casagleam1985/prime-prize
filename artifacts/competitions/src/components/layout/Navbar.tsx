import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/80 text-secondary-foreground">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif font-bold text-2xl tracking-tight text-white hover:text-accent transition-colors">
          <Trophy className="h-6 w-6 text-accent" />
          Prime Prize
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-secondary-foreground/90">
          <Link href="/competitions" className="hover:text-accent transition-colors">Live Draws</Link>
          <Link href="/draw-results" className="hover:text-accent transition-colors">Draw Results</Link>
          <Link href="/winners" className="hover:text-accent transition-colors">Winners</Link>
          <Link href="/how-it-works" className="hover:text-accent transition-colors">How it Works</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white">
            Sign In
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
            Register
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
