import { Link } from 'react-router-dom';
import { useProjects } from '../api/queries';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

export function FeaturedProjects() {
  const { data: projects, isLoading, isError } = useProjects();

  // Filter for featured projects and take up to 3
  const featured = projects?.data?.filter((p) => p.is_featured).slice(0, 3) || [];

  return (
    <section className="py-24">
      <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Selected Work</h2>
            <p className="text-muted-foreground text-lg">
              A glimpse into the digital products we've brought to life.
            </p>
          </div>
          <Link to="/projects">
            <Button variant="ghost" className="group">
              View all projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={`skeleton-${i}`} className="border-border/40 overflow-hidden">
                <Skeleton className="h-64 w-full rounded-none" />
                <CardHeader>
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <div className="p-8 text-center border border-border/40 rounded-lg bg-secondary/20">
            <p className="text-muted-foreground">Unable to load projects at this time.</p>
          </div>
        )}

        {!isLoading && !isError && featured.length === 0 && (
          <div className="p-8 text-center border border-border/40 rounded-lg bg-secondary/20">
            <p className="text-muted-foreground">No featured projects found.</p>
          </div>
        )}

        {!isLoading && featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((project) => {
              const title = project.name || '';
              const desc = project.summary || project.description || '';
              const imageUrl = project.cover_image;

              return (
              <Card key={`project-${project.id}`} className="group overflow-hidden border-border/40 bg-card hover:border-primary/20 transition-colors flex flex-col">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="line-clamp-1">{title}</CardTitle>
                    {project.status === 'completed' && <Badge variant="secondary" className="shrink-0">Completed</Badge>}
                  </div>
                  <CardDescription className="line-clamp-2 mt-2">
                    {desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.slice(0, 3).map((tech: any, idx: number) => (
                      <Badge key={`tech-${project.id}-${tech.id || idx}`} variant="outline" className="bg-background/50 text-xs">
                        {typeof tech === 'string' ? tech : tech.name}
                      </Badge>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <Badge variant="outline" className="bg-background/50 text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t border-border/10">
                  <Link to={`/projects/${project.slug}`} className="w-full mt-4">
                    <Button variant="default" className="w-full">
                      View Case Study
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )})}
          </div>
        )}
      </div>
    </section>
  );
}
