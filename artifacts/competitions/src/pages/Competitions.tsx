import { useListCompetitions } from "@workspace/api-client-react";
import { useState } from "react";
import { CompetitionCard } from "../components/CompetitionCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function Competitions() {
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState("ending_soon");

  const { data: competitions, isLoading } = useListCompetitions({
    status: 'active',
    category: category !== "all" ? category : undefined
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-secondary text-white py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Live Draws</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Browse our current active competitions. Grab your tickets before they sell out!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <Tabs defaultValue="all" onValueChange={setCategory} className="w-full md:w-auto">
            <TabsList className="w-full md:w-auto h-auto p-1 bg-white border border-border shadow-sm flex flex-wrap h-auto">
              <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="cash" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">Cash</TabsTrigger>
              <TabsTrigger value="cars" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">Cars</TabsTrigger>
              <TabsTrigger value="tech" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">Tech</TabsTrigger>
              <TabsTrigger value="lifestyle" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">Lifestyle</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full md:w-[180px] bg-white">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending_soon">Ending Soon</SelectItem>
                <SelectItem value="price_low">Lowest Price</SelectItem>
                <SelectItem value="price_high">Highest Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-2 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))
          ) : competitions?.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No competitions found for this category.
            </div>
          ) : (
            competitions?.map(comp => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
