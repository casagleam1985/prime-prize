import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import Home from "./pages/Home";
import Competitions from "./pages/Competitions";
import CompetitionDetail from "./pages/CompetitionDetail";
import DrawResults from "./pages/DrawResults";
import HowItWorks from "./pages/HowItWorks";
import Winners from "./pages/Winners";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/competitions" component={Competitions} />
          <Route path="/competitions/:id" component={CompetitionDetail} />
          <Route path="/draw-results" component={DrawResults} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/winners" component={Winners} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
