'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="RoverNote"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                style={{ background: 'transparent' }}
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Turn your adventures into beautiful digital memories. Your stories, your way.
            </p>
          </div>

          {/* Links - Explore */}
          <div>
            <h4 className="font-handwritten text-lg font-semibold text-foreground mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Community', href: '/community' },
                { name: 'Map', href: '/map' },
                { name: 'My Scrapbook', href: '/my-scrapbook' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Company */}
          <div>
            <h4 className="font-handwritten text-lg font-semibold text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {['About', 'Privacy', 'Terms', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-handwritten text-lg font-semibold text-foreground mb-4">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RoverNote. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
