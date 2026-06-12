import { useGetCompetition, getGetCompetitionQueryKey, usePurchaseTickets, useGetMyTickets, getGetMyTicketsQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Timer, Minus, Plus, Ticket, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompetitionDetail() {
  const { id } = useParams();
  const compId = Number(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isSignedIn, user } = useUser();

  const { data: comp, isLoading } = useGetCompetition(compId, {
    query: { enabled: !!compId, queryKey: getGetCompetitionQueryKey(compId) }
  });

  const { data: myTickets } = useGetMyTickets({
    query: { enabled: !!isSignedIn, queryKey: getGetMyTicketsQueryKey() }
  });

  const alreadyEntered = myTickets?.some((t) => t.competitionId === compId);
  const myTicketsForThis = myTickets?.filter((t) => t.competitionId === compId) ?? [];
  const myTotalTickets = myTicketsForThis.reduce((sum, t) => sum + t.quantity, 0);

  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress ?? "");

  const purchaseMutation = usePurchaseTickets({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Tickets Purchased!",
          description: "Good luck! Your ticket numbers have been saved to your account.",
        });
        queryClient.invalidateQueries({ queryKey: getGetCompetitionQueryKey(compId) });
        queryClient.invalidateQueries({ queryKey: getGetMyTicketsQueryKey() });
        setQuantity(1);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to purchase tickets. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="h-[400px] md:h-[600px] rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!comp) {
    return <div className="container mx-auto px-4 py-20 text-center">Competition not found.</div>;
  }

  const progress = (comp.ticketsSold / comp.maxTickets) * 100;
  const totalPrice = quantity * comp.ticketPrice;
  const isSoldOut = comp.ticketsSold >= comp.maxTickets;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast({ title: "Error", description: "Please provide name and email.", variant: "destructive" });
      return;
    }
    purchaseMutation.mutate({
      id: compId,
      data: { quantity, email, name }
    });
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-border flex flex-col lg:flex-row">
          
          {/* Image Section */}
          <div className="lg:w-1/2 relative">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <div className="bg-primary text-white font-bold px-4 py-2 rounded-full text-lg shadow-lg">
                £{comp.ticketPrice.toFixed(2)} <span className="text-sm font-normal">/ticket</span>
              </div>
            </div>
            {alreadyEntered && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-green-500 text-white gap-1.5 py-1.5 px-3 text-sm font-semibold shadow-lg">
                  <CheckCircle2 className="h-4 w-4" />
                  Already Entered
                </Badge>
              </div>
            )}
            <img 
              src={comp.imageUrl || "/api/storage/public-objects/prizes/fallback-prize.jpg"} 
              alt={comp.title}
              className="w-full h-[400px] lg:h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "/api/storage/public-objects/prizes/fallback-prize.jpg"; }}
            />
          </div>

          {/* Details & Purchase Section */}
          <div className="lg:w-1/2 p-6 md:p-10 flex flex-col">
            <div className="flex items-center gap-2 text-sm text-primary font-bold tracking-wider uppercase mb-3">
              <Timer className="h-4 w-4" /> Ending Soon
            </div>
            
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 leading-tight">
              {comp.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              {comp.description}
            </p>

            {/* "Already entered" info for signed-in users */}
            {alreadyEntered && myTotalTickets > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800 text-sm">You have {myTotalTickets} ticket{myTotalTickets !== 1 ? "s" : ""} in this draw</p>
                  <p className="text-green-700 text-xs">Good luck! You can buy more tickets below.</p>
                </div>
              </div>
            )}

            <div className="bg-secondary/5 rounded-2xl p-6 mb-8">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>{comp.ticketsSold} Sold</span>
                <span>{comp.maxTickets} Total</span>
              </div>
              <Progress value={progress} className="h-3 mb-2 bg-secondary/10" />
              <div className="text-center text-sm font-bold text-secondary mt-2">
                {comp.maxTickets - comp.ticketsSold} tickets remaining!
              </div>
            </div>

            <div className="mt-auto">
              {isSoldOut ? (
                <div className="bg-muted text-muted-foreground text-center py-6 rounded-2xl font-bold text-xl">
                  SOLD OUT
                </div>
              ) : (
                <form onSubmit={handlePurchase} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="bg-white border-2 border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 bg-secondary/5 rounded-full p-2">
                      <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white hover:text-primary hover:shadow-sm transition-all" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                      <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white hover:text-primary hover:shadow-sm transition-all" onClick={() => setQuantity(Math.min(comp.maxTickets - comp.ticketsSold, quantity + 1))}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right flex-1 sm:pr-4">
                      <div className="text-sm text-muted-foreground">Total Price</div>
                      <div className="text-3xl font-bold font-serif text-primary">£{totalPrice.toFixed(2)}</div>
                    </div>
                  </div>

                  <Button type="submit" disabled={purchaseMutation.isPending} className="w-full h-16 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    {purchaseMutation.isPending ? "Processing..." : "Buy Tickets Now"} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-600" /> Secure encrypted checkout
                  </div>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
