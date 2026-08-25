import { SEO } from '@/components/shared/SEO';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FeaturedProjects } from '@/features/projects/components/FeaturedProjects';
import { TeamOverview } from '@/features/team/components/TeamOverview';
import { ServicesOverview } from '@/features/services/components/ServicesOverview';
import { Lightbulb, Code2, CheckCircle2, Rocket } from 'lucide-react';
import { AmbientCodeBackground } from '@/components/shared/AmbientCodeBackground';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Home" 
        description="Premium digital products and engineering solutions." 
        url="https://yourdomain.com/"
      />
      <Helmet>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Synapse",
              "url": "https://yourdomain.com/",
              "logo": "https://yourdomain.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "hello@yourdomain.com",
                "contactType": "customer service"
              }
            }
          `}
        </script>
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 border-b border-border/10 bg-background/50">
        <AmbientCodeBackground intensity="high" parallax={true} />
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                We build, deploy, and test <span className="text-primary">production-ready</span> web products.
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
                A highly capable engineering team taking your software from discovery through quality assurance and release.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
              <Link to="/contact">
                <Button size="lg" className="w-full sm:w-auto px-8 shadow-md">
                  Start a Project
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 bg-background/50 backdrop-blur-sm">
                  View Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <div className="relative z-10 overflow-hidden bg-background/30">
        <AmbientCodeBackground intensity="medium" />
        <TeamOverview />
      </div>
      
      {/* Projects - Subtle grid/glow only */}
      <div className="relative z-10 overflow-hidden">
        <AmbientCodeBackground intensity="low" snippets={[]} />
        <FeaturedProjects />
      </div>
      
      {/* Packages - Subtle grid/glow only */}
      <div className="relative z-10 overflow-hidden">
        <AmbientCodeBackground intensity="low" snippets={[]} />
        <ServicesOverview />
      </div>

      {/* How We Work Section */}
      <section className="py-24 bg-card/50 border-t border-border/20 relative z-10 overflow-hidden">
        <AmbientCodeBackground intensity="low" />
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How We Work</h2>
            <p className="max-w-[700px] text-muted-foreground text-lg">
              A streamlined, transparent process designed to turn ideas into production-ready software.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-background border border-border/50 hover:border-border transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">1. Discovery</h3>
              <p className="text-muted-foreground text-sm">We analyze requirements, plan architecture, and design the solution.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-background border border-border/50 hover:border-border transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Code2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">2. Development</h3>
              <p className="text-muted-foreground text-sm">Writing clean, scalable code utilizing modern frameworks.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-background border border-border/50 hover:border-border transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">3. Quality</h3>
              <p className="text-muted-foreground text-sm">Rigorous testing ensures performance, security, and a bug-free experience.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-background border border-border/50 hover:border-border transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Rocket className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">4. Deployment</h3>
              <p className="text-muted-foreground text-sm">Smooth transition to production with continuous integration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-primary/5 border-t border-border/20 relative z-10 overflow-hidden">
        <AmbientCodeBackground intensity="low" snippets={[]} />
        <div 
          className="absolute inset-0 bg-primary/5" 
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)'
          }}
        ></div>
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to build something great?
          </h2>
          <p className="max-w-[600px] mx-auto text-muted-foreground text-lg">
            Let's discuss how our engineering team can help you achieve your goals with high-quality software.
          </p>
          <div className="pt-4">
            <Link to="/contact">
              <Button size="lg" className="px-10 text-lg h-14 shadow-xl shadow-primary/20">
                Start a Project
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
