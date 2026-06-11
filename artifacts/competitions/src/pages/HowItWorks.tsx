import { Trophy, Ticket, Gift, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">How It Works</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Winning your dream prize is easy. Just follow these three simple steps.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-secondary/10 -z-10" />

          {/* Step 1 */}
          <div className="text-center relative">
            <div className="w-24 h-24 mx-auto bg-white border-4 border-primary rounded-full flex items-center justify-center mb-6 shadow-xl text-primary">
              <Trophy className="h-10 w-10" />
            </div>
            <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2 bg-accent text-secondary font-bold h-8 w-8 rounded-full flex items-center justify-center border-2 border-white">1</div>
            <h3 className="text-2xl font-bold font-serif mb-4">Choose a Prize</h3>
            <p className="text-muted-foreground leading-relaxed">
              Browse our live competitions. Whether you want a new car, cash, or tech — pick the prize you want to win.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center relative">
            <div className="w-24 h-24 mx-auto bg-white border-4 border-primary rounded-full flex items-center justify-center mb-6 shadow-xl text-primary">
              <Ticket className="h-10 w-10" />
            </div>
            <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2 bg-accent text-secondary font-bold h-8 w-8 rounded-full flex items-center justify-center border-2 border-white">2</div>
            <h3 className="text-2xl font-bold font-serif mb-4">Buy Tickets</h3>
            <p className="text-muted-foreground leading-relaxed">
              Select your quantity. Our tickets start from just 99p. Checkout securely and your ticket numbers are emailed to you instantly.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center relative">
            <div className="w-24 h-24 mx-auto bg-white border-4 border-primary rounded-full flex items-center justify-center mb-6 shadow-xl text-primary">
              <Gift className="h-10 w-10" />
            </div>
            <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2 bg-accent text-secondary font-bold h-8 w-8 rounded-full flex items-center justify-center border-2 border-white">3</div>
            <h3 className="text-2xl font-bold font-serif mb-4">Watch & Win</h3>
            <p className="text-muted-foreground leading-relaxed">
              Tune into our live draw streams. If your number is called, you win! We contact all winners immediately after the draw.
            </p>
          </div>
        </div>

        <div className="mt-24 max-w-3xl mx-auto bg-secondary/5 rounded-3xl p-8 md:p-12 border border-border">
          <h2 className="text-3xl font-bold font-serif mb-8 text-center">Why Play With Us?</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-1">Guaranteed Draws</h4>
                <p className="text-muted-foreground">Every competition has a set draw date. We never extend draws, regardless of ticket sales.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-1">Transparent & Fair</h4>
                <p className="text-muted-foreground">All draws are done live using Google's random number generator. Everyone has an equal chance.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-1">Fast Payouts</h4>
                <p className="text-muted-foreground">Winners are paid within 24 hours of winning. Cars and physical prizes are delivered for free within the UK.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/competitions">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 h-14 rounded-full shadow-lg">
                View Live Draws
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
