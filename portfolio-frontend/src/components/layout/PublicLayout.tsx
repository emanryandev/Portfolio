import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Packages', path: '/packages' },
  { name: 'Contact', path: '/contact' },
];

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 relative">
          {/* Logo */}
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2 z-10">
              <span className="font-bold inline-block text-xl tracking-tight">The Team</span>
            </Link>
          </div>
          
          {/* Desktop Navigation (Centered) */}
          <nav aria-label="Main Navigation" className="hidden md:flex gap-8 z-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors hover:text-foreground/80 font-medium ${
                  location.pathname === link.path
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4 z-10">
            <div className="hidden md:block">
              <Button asChild className="font-medium shadow-sm">
                <Link to="/contact">Start a Project</Link>
              </Button>
            </div>
            
            {/* Mobile Navigation Drawer */}
            <div className="md:hidden">
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-accent/50">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-background/95 backdrop-blur-xl border-t border-border/50">
                  <nav className="flex flex-col gap-4 p-6" aria-label="Mobile Navigation">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-foreground/80 ${
                          location.pathname === link.path
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <div className="mt-4 flex flex-col gap-2">
                      <Button asChild size="lg" className="w-full font-medium" onClick={() => setOpen(false)}>
                        <Link to="/contact">Start a Project</Link>
                      </Button>
                    </div>
                  </nav>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8 relative z-10 bg-background/50">
        <div className="container px-4 max-w-screen-2xl flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by The Team. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
