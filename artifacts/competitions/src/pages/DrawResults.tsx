import { useListDrawResults } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Trophy, Ticket, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DrawResults() {
  const { data: results, isLoading } = useListDrawResults();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-secondary text-white py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Draw Results</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Check the latest winning ticket numbers. Transparent draws, every time.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-6 border-b border-border flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))
          ) : results?.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No draw results available yet.
            </div>
          ) : (
            results?.map((result, index) => (
              <div key={result.id} className={`p-6 flex flex-col sm:flex-row items-center gap-6 ${index !== results.length - 1 ? 'border-b border-border' : ''} hover:bg-gray-50 transition-colors`}>
                
                <div className="h-24 w-24 sm:h-20 sm:w-20 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center text-primary relative overflow-hidden">
                  {result.imageUrl ? (
                    <img src={result.imageUrl} alt={result.prize} className="w-full h-full object-cover" />
                  ) : (
                    <Trophy className="h-10 w-10" />
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-lg mb-1">{result.prize}</h3>
                  <div className="text-sm text-muted-foreground mb-2">{result.competitionTitle}</div>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 font-medium text-foreground bg-secondary/5 px-2 py-1 rounded-md">
                      Winner: {result.winnerName}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                      <Ticket className="h-4 w-4" /> Ticket #{result.winnerTicket}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground flex items-center gap-2 shrink-0 sm:flex-col sm:items-end sm:gap-1">
                  <Calendar className="h-4 w-4 sm:hidden" />
                  {format(new Date(result.drawnAt), "MMM do, yyyy")}
                  <span className="hidden sm:inline text-xs">{format(new Date(result.drawnAt), "HH:mm")}</span>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
