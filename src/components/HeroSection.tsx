'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Globe, Compass, Camera, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[hsl(var(--paper))]" />
      
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Globe 
          className="absolute top-20 left-[10%] h-16 w-16 text-primary/20 animate-float" 
        />
        <Compass 
          className="absolute top-32 right-[15%] h-12 w-12 text-secondary/30 animate-float-reverse" 
        />
        <Camera 
          className="absolute bottom-40 left-[20%] h-10 w-10 text-accent/40 animate-bounce-slow" 
        />
        <MapPin 
          className="absolute bottom-32 right-[25%] h-14 w-14 text-primary/15 animate-float" 
        />
        
        {/* Abstract shapes */}
        <div className="absolute top-1/4 right-[5%] h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-[8%] h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Your adventures, beautifully preserved</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight !font-sans">
              Create Your
              <span className="block text-primary">Travel Story</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transform your journeys into stunning digital scrapbooks. 
              Capture photos, write notes, and relive your adventures like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                asChild
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/my-scrapbook">
                  Start Your Scrapbook
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 border-2"
              >
                <Link href="/community">
                  Explore Community
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 justify-center lg:justify-start pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-background bg-muted"
                    style={{
                      backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=user${i})`,
                      backgroundSize: 'cover',
                    }}
                  />
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">10K+ Travelers</p>
                <p className="text-xs text-muted-foreground">Already journaling</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative rotate-organic-2 hover:rotate-0 transition-transform duration-500">
              {/* Washi tape decorations */}
              <div 
                className="absolute -top-4 left-8 h-6 w-24 z-20 opacity-80"
                style={{
                  transform: 'rotate(-8deg)',
                  background: 'linear-gradient(90deg, transparent 0%, hsl(var(--tape-amber)) 8%, hsl(var(--tape-amber)) 92%, transparent 100%)',
                }}
              />
              <div 
                className="absolute -top-3 right-12 h-6 w-20 z-20 opacity-80"
                style={{
                  transform: 'rotate(12deg)',
                  background: 'linear-gradient(90deg, transparent 0%, hsl(var(--tape-pink)) 8%, hsl(var(--tape-pink)) 92%, transparent 100%)',
                }}
              />
              <div 
                className="absolute -bottom-2 left-16 h-5 w-20 z-20 opacity-80"
                style={{
                  transform: 'rotate(6deg)',
                  background: 'linear-gradient(90deg, transparent 0%, hsl(var(--tape-mint)) 8%, hsl(var(--tape-mint)) 92%, transparent 100%)',
                }}
              />
              
              {/* Main image with polaroid frame */}
              <div className="bg-card p-4 shadow-polaroid rounded-sm">
                <Image
                  src="/hero-scrapbook.jpg"
                  alt="Beautiful travel scrapbook with photos, postcards, and memories"
                  width={600}
                  height={400}
                  className="w-full rounded-sm object-cover"
                  priority
                />
                <p className="font-handwritten text-xl text-center mt-4 text-foreground">
                  My Adventures ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
