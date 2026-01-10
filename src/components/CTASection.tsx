'use client';

import Link from 'next/link';
import { Plane, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[10%] h-20 w-20 rounded-full bg-accent/20 blur-2xl" />
        <div className="absolute bottom-10 right-[15%] h-32 w-32 rounded-full bg-primary/15 blur-3xl" />
        <Plane className="absolute top-1/4 right-[20%] h-12 w-12 text-primary/10 rotate-12" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative tape */}
          <div className="relative inline-block mb-8">
            <div 
              className="absolute -top-4 left-1/2 -translate-x-1/2 h-6 w-32 opacity-80 -rotate-2"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, hsl(var(--tape-amber)) 8%, hsl(var(--tape-amber)) 92%, transparent 100%)',
              }}
            />
            <div className="bg-card px-8 py-4 rotate-1 shadow-md">
              <p className="font-handwritten text-lg text-muted-foreground">
                Ready to start?
              </p>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Your Next Adventure
            <span className="block text-primary">Awaits</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of travelers preserving their memories in the most beautiful way. 
            Start your digital scrapbook today — it&apos;s free!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 font-medium shadow-lg hover:shadow-xl transition-all group"
            >
              <Link href="/my-scrapbook">
                Create Your Scrapbook
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required • Free forever for personal use
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
