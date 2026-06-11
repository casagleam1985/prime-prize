import { useGetFeaturedCompetitions, useGetCompetitionStats, useListWinners, useListCompetitions } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Timer, ArrowRight, Trophy, Star, Users, Ticket, Award } from "lucide-react";
import { CompetitionCard } from "../components/CompetitionCard";

export default function Home() {
  const { data: stats } = useGetCompetitionStats();
  const { data: featured, isLoading: isLoadingFeatured } = useGetFeaturedCompetitions();
  const { data: winners, isLoading: isLoadingWinners } = useListWinners({ limit: 5 });
  const { data: active, isLoading: isLoadingActive } = useListCompetitions({ status: 'active', limit: 6 });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary text-white pt-20 pb-32">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            Live Draws Every Wednesday & Sunday
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            Win Life-Changing Prizes from just <span className="text-accent">99p</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            Join the UK's fastest-growing competition platform. Real winners, low ticket prices, and incredible odds. Your turn could be next.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/competitions">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 h-14 rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Play Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 h-14 rounded-full font-bold px-8">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 -mt-12 container mx-auto px-4 mb-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-border p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-3 text-primary">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold font-serif mb-1">{stats?.totalWinners?.toLocaleString() || "..."}</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Happy Winners</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3 text-primary">
                <Award className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold font-serif mb-1">£{(stats?.totalPrizesAwarded || 0).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Prizes Won</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3 text-primary">
                <Ticket className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold font-serif mb-1">{stats?.activeCompetitions || "..."}</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Live Draws</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3 text-accent">
                <Star className="h-8 w-8 fill-current" />
              </div>
              <div className="text-3xl font-bold font-serif mb-1">{stats?.trustpilotRating || "..."} / 5</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Trustpilot</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Competitions */}
      <section className="container mx-auto px-4 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold font-serif mb-2 text-foreground">Featured Draws</h2>
            <p className="text-muted-foreground">Our biggest and best prizes ending soon.</p>
          </div>
          <Link href="/competitions" className="hidden md:flex items-center text-primary font-bold hover:underline">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingFeatured ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-[250px] w-full rounded-none" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-2/3 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-6" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : featured?.map((comp) => (
            <CompetitionCard key={comp.id} competition={comp} featured />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/competitions">
            <Button variant="outline" className="w-full font-bold">View All Draws</Button>
          </Link>
        </div>
      </section>

      {/* Winners Ticker */}
      <section className="bg-primary/5 py-12 mb-20 border-y border-primary/10 overflow-hidden">
        <div className="container mx-auto px-4 mb-6 text-center">
          <h2 className="text-2xl font-bold font-serif flex items-center justify-center gap-2">
            <Trophy className="text-primary h-6 w-6" /> Recent Winners
          </h2>
        </div>
        
        <div className="flex space-x-6 animate-[marquee_30s_linear_infinite] w-max">
          {isLoadingWinners ? (
             Array.from({ length: 5 }).map((_, i) => (
               <Skeleton key={i} className="h-16 w-64 rounded-full" />
             ))
          ) : (
            [...(winners || []), ...(winners || [])].map((winner, i) => (
              <div key={i} className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-border shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {winner.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm">{winner.name}</div>
                  <div className="text-xs text-muted-foreground">Won {winner.prize}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Active Competitions */}
      <section className="container mx-auto px-4 mb-20">
        <h2 className="text-3xl font-bold font-serif mb-8 text-foreground">Ending Soon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoadingActive ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-[200px] w-full rounded-none" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-full mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))
          ) : active?.slice(0, 4).map((comp) => (
            <CompetitionCard key={comp.id} competition={comp} />
          ))}
        </div>
      </section>

    </div>
  );
}
