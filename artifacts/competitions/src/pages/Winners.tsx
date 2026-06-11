import { useListWinners } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote } from "lucide-react";

export default function Winners() {
  const { data: winners, isLoading } = useListWinners();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-secondary text-white py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Winners</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Real people winning life-changing prizes every week.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : (
            winners?.map((winner) => (
              <div key={winner.id} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow border border-border relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0 group-hover:bg-primary/10 transition-colors" />
                
                <div className="flex items-center gap-5 mb-6 relative z-10">
                  {winner.imageUrl ? (
                    <img src={winner.imageUrl} alt={winner.name} className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-sm" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-bold font-serif shadow-sm">
                      {winner.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold font-serif text-xl">{winner.name}</h3>
                    <p className="text-sm font-medium text-primary mb-1">Won {winner.prize}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(winner.date), "MMMM yyyy")}</p>
                  </div>
                </div>

                {winner.testimonial ? (
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/10 -z-0" />
                    <p className="text-muted-foreground italic relative z-10 pl-4 border-l-2 border-primary/20">
                      "{winner.testimonial}"
                    </p>
                  </div>
                ) : (
                  <div className="bg-secondary/5 rounded-xl p-4 text-center">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Prize Value</div>
                    <div className="text-2xl font-bold text-foreground">£{winner.amount.toLocaleString()}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
