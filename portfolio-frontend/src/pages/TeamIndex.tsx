import { SEO } from '@/components/shared/SEO';
import { TeamOverview } from '@/features/team/components/TeamOverview';

export default function TeamIndex() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Our Team" 
        description="Meet the experts behind our premium digital products." 
        url="https://yourdomain.com/team"
      />
      
      {/* Header */}
      <section className="py-20 border-b border-border/40">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
            The People Behind The Code
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            We are a tight-knit group of engineers and designers passionate about building exceptional software.
          </p>
        </div>
      </section>

      {/* Re-use the TeamOverview component which fetches and renders the team members */}
      <TeamOverview />
    </div>
  );
}
