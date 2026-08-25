import { Link } from 'react-router-dom';
import { useTeam } from '../api/queries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TeamOverview() {
  const { data: team, isLoading, isError } = useTeam();

  const members = team?.data?.slice(0, 3) || []; // Display up to 3 for the overview

  return (
    <section className="py-16 md:py-24 bg-secondary/10 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/80 pointer-events-none" />
      <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Meet Synapse</h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            A specialized trio of developers combining deep expertise across the entire stack to build products that perform.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/40 text-center items-center pt-8">
                <Skeleton className="w-28 h-28 rounded-full mx-auto mb-4" />
                <CardHeader>
                  <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/3 mx-auto" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <div className="p-8 text-center border border-border/40 rounded-lg bg-background max-w-2xl mx-auto">
            <p className="text-muted-foreground">Unable to load team members.</p>
          </div>
        )}

        {!isLoading && members.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {members.map((member) => (
              <Link key={member.id} to={`/team/${member.slug}`} className="group block">
                <Card className="relative h-full border-border/40 bg-card/60 backdrop-blur-sm hover:bg-card hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1 text-center flex flex-col items-center pt-8 pb-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="w-28 h-28 rounded-full bg-secondary overflow-hidden mb-4 ring-4 ring-background shadow-xl flex items-center justify-center relative z-10 group-hover:ring-primary/20 transition-all duration-500">
                    {member.image_url ? (
                      <img 
                        src={member.image_url} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground transition-colors duration-500 group-hover:text-primary/70" />
                    )}
                  </div>
                  <CardHeader className="w-full relative z-10 pb-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{member.name}</CardTitle>
                    <CardDescription className="font-semibold text-primary/80 mt-1">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link to="/team">
            <Button variant="outline" className="group">
              More about us
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
