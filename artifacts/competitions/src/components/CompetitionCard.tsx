import { Competition } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Props {
  competition: Competition;
  featured?: boolean;
}

export function CompetitionCard({ competition, featured }: Props) {
  const progress = (competition.ticketsSold / competition.maxTickets) * 100;
  const isEndingSoon = new Date(competition.drawDate).getTime() - new Date().getTime() < 48 * 60 * 60 * 1000;

  return (
    <Card className={`group overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl border-border flex flex-col ${featured ? 'border-primary/20 shadow-lg' : ''}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {featured && (
          <div className="absolute top-4 left-4 z-10 bg-accent text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Featured
          </div>
        )}
        <div className="absolute top-4 right-4 z-10 bg-secondary/90 backdrop-blur text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
          £{competition.ticketPrice.toFixed(2)}
        </div>
        
        <img 
          src={competition.imageUrl || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600"} 
          alt={competition.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        
        {isEndingSoon && competition.status === 'active' && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white bg-destructive/90 backdrop-blur px-3 py-2 rounded-lg text-sm font-bold shadow-lg">
            <Timer className="h-4 w-4 animate-pulse" />
            Ends {formatDistanceToNow(new Date(competition.drawDate), { addSuffix: true })}
          </div>
        )}
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <h3 className="font-serif font-bold text-xl mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {competition.title}
        </h3>
        
        <div className="mt-auto pt-4">
          <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>{Math.round(progress)}% Sold</span>
            <span>{competition.maxTickets - competition.ticketsSold} left</span>
          </div>
          <Progress value={progress} className="h-2.5 mb-5 bg-secondary/10" />
          
          <Link href={`/competitions/${competition.id}`}>
            <button className="w-full py-3.5 rounded-xl font-bold bg-secondary text-white group-hover:bg-primary transition-colors flex items-center justify-center gap-2">
              Enter Now <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
