'use client';

import { Camera, MapPin, Share2, Sparkles, PenTool, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Camera,
    title: 'Capture Memories',
    description: 'Upload photos and arrange them like a real scrapbook. Add filters, borders, and that perfect vintage touch.',
    color: 'primary',
    rotation: 'rotate-1',
  },
  {
    icon: MapPin,
    title: 'Track Adventures',
    description: 'Pin your visited locations on an interactive map. See your journey unfold across the globe.',
    color: 'secondary',
    rotation: '-rotate-1',
  },
  {
    icon: Share2,
    title: 'Share & Inspire',
    description: 'Share your scrapbooks with friends or the community. Get inspired by fellow travelers.',
    color: 'accent',
    rotation: 'rotate-2',
  },
];

const additionalFeatures = [
  { icon: PenTool, text: 'Handwritten notes & captions' },
  { icon: Sparkles, text: 'Beautiful stickers & stamps' },
  { icon: Lock, text: 'Private or public journals' },
];

const FeaturesSection = () => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent text-accent-foreground',
  };

  const tapeColors = ['amber', 'mint', 'pink'];

  return (
    <section className="py-24 bg-[hsl(var(--paper))]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From capturing moments to sharing stories, we&apos;ve got all the tools to make your travel memories unforgettable.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  'relative bg-card p-8 rounded-lg shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group',
                  feature.rotation
                )}
              >
                {/* Washi tape decoration */}
                <div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-20 opacity-80"
                  style={{
                    transform: `translateX(-50%) rotate(${index % 2 === 0 ? -3 : 3}deg)`,
                    background: `linear-gradient(90deg, transparent 0%, hsl(var(--tape-${tapeColors[index]})) 8%, hsl(var(--tape-${tapeColors[index]})) 92%, transparent 100%)`,
                  }}
                />

                <div
                  className={cn(
                    'inline-flex p-4 rounded-xl mb-6 transition-transform duration-300 group-hover:scale-110',
                    colorClasses[feature.color as keyof typeof colorClasses]
                  )}
                >
                  <Icon className="h-8 w-8" />
                </div>
                
                <h3 className="font-handwritten text-2xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="flex flex-wrap justify-center gap-4">
          {additionalFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                className="flex items-center gap-2 px-5 py-3 bg-card rounded-full shadow-sm border border-border/50"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
