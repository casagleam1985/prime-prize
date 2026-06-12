import { useGetMyTickets } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Ticket, Trophy, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
        <Clock className="h-3 w-3" /> Active
      </Badge>
    );
  }
  if (status === "ended") {
    return (
      <Badge className="bg-gray-100 text-gray-600 border-gray-200 gap-1">
        <CheckCircle2 className="h-3 w-3" /> Drawn
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1">
      <XCircle className="h-3 w-3" /> {status}
    </Badge>
  );
}

export default function MyAccount() {
  const { user } = useUser();
  const { data: tickets, isLoading } = useGetMyTickets();

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-10 max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-primary/10 p-2 rounded-full">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">My Account</h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            Welcome back, <span className="font-semibold text-foreground">{user?.firstName ?? user?.emailAddresses[0]?.emailAddress}</span>
          </p>
        </div>

        {/* Ticket list */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-serif font-semibold">My Tickets</h2>
            {tickets && (
              <span className="text-sm text-muted-foreground ml-1">({tickets.length})</span>
            )}
          </div>

          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-2xl" />
              ))}
            </div>
          )}

          {!isLoading && tickets?.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-border">
              <Ticket className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No tickets yet</h3>
              <p className="text-muted-foreground mb-6">Enter a competition to track your tickets here.</p>
              <Link href="/competitions">
                <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors cursor-pointer">
                  Browse Competitions
                </span>
              </Link>
            </div>
          )}

          {!isLoading && tickets && tickets.length > 0 && (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Link key={ticket.id} href={`/competitions/${ticket.competitionId}`}>
                  <div className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow cursor-pointer">
                    <div className="sm:w-32 h-24 sm:h-auto flex-shrink-0">
                      <img
                        src={ticket.competitionImageUrl || "/api/storage/public-objects/prizes/fallback-prize.jpg"}
                        alt={ticket.competitionTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/api/storage/public-objects/prizes/fallback-prize.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 flex-wrap mb-1">
                          <h3 className="font-serif font-semibold text-foreground leading-tight">{ticket.competitionTitle}</h3>
                          <StatusBadge status={ticket.competitionStatus} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Draw: {format(new Date(ticket.drawDate ?? ticket.createdAt), "d MMM yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Purchased: {format(new Date(ticket.createdAt), "d MMM yyyy, HH:mm")}
                        </p>
                      </div>
                      <div className="sm:text-right flex sm:flex-col gap-4 sm:gap-1 items-center sm:items-end">
                        <div>
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Tickets</div>
                          <div className="text-2xl font-bold font-serif text-primary">{ticket.quantity}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Paid</div>
                          <div className="font-bold text-foreground">£{ticket.totalPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center pr-4">
                      <div className="text-muted-foreground/40">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
