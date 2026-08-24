import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '@/features/projects/api/queries';
import { SEO } from '@/components/shared/SEO';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { AmbientCodeBackground } from '@/components/shared/AmbientCodeBackground';

export default function ProjectsIndex() {
  const [search, setSearch] = useState('');
  const { data: response, isLoading, isError } = useProjects();
  
  const projects = response?.data || [];
  
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <AmbientCodeBackground intensity="low" snippets={[]} />
      <div className="relative z-10 flex flex-col flex-1">
      <SEO 
        title="Our Work" 
        description="Explore our portfolio of successful digital products and engineering solutions." 
        url="https://yourdomain.com/projects"
      />
      
      {/* Header */}
      <section className="py-20 border-b border-border/40 bg-secondary/10">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Our Work
              </h1>
              <p className="text-lg text-muted-foreground">
                A collection of our recent projects, side-projects, and open source contributions.
              </p>
            </div>
            <div className="w-full md:w-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search projects..." 
                className="pl-10 w-full md:w-[300px] bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 flex-1">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
          
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-border/40 overflow-hidden">
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

          {!isLoading && filteredProjects.length === 0 && (
            <div className="p-16 text-center border border-border/40 rounded-lg bg-secondary/10">
              <h3 className="text-2xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria.</p>
              {search && (
                <Button variant="outline" className="mt-6" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              )}
            </div>
          )}

          {!isLoading && filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => {
                const text = (project.name + ' ' + project.description).toLowerCase();
                let accentClass = 'hover:border-primary/50 hover:shadow-primary/10';
                if (text.includes('finance') || text.includes('fintech') || text.includes('data') || text.includes('bank') || text.includes('crypto')) {
                  accentClass = 'hover:border-emerald-500/50 hover:shadow-emerald-500/10';
                } else if (text.includes('commerce') || text.includes('shop') || text.includes('store') || text.includes('retail') || text.includes('cart')) {
                  accentClass = 'hover:border-amber-500/50 hover:shadow-amber-500/10';
                } else if (text.includes('infra') || text.includes('devops') || text.includes('cloud') || text.includes('deploy') || text.includes('system')) {
                  accentClass = 'hover:border-cyan-500/50 hover:shadow-cyan-500/10';
                }
                
                return (
                <Card key={project.id} className={`group overflow-hidden border-border/20 bg-card/40 backdrop-blur-sm transition-all duration-300 flex flex-col shadow-sm hover:shadow-lg ${accentClass}`}>
                  <Link to={`/projects/${project.slug}`} className="block flex-1 flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden bg-muted/20 relative">
                      {project.cover_image ? (
                        <img 
                          src={project.cover_image} 
                          alt={project.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardHeader className="relative z-10">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors text-xl">
                          {project.name}
                        </CardTitle>
                        {project.is_featured && <Badge className="shrink-0 bg-primary/20 text-primary border-0">Featured</Badge>}
                      </div>
                      <CardDescription className="line-clamp-2 mt-2 text-muted-foreground/80">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 relative z-10">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.slice(0, 4).map(tech => (
                          <Badge key={tech.id} variant="outline" className="bg-background/50 text-xs border-border/40 text-muted-foreground">
                            {tech.name}
                          </Badge>
                        ))}
                        {project.technologies && project.technologies.length > 4 && (
                          <Badge variant="outline" className="bg-background/50 text-xs border-border/40 text-muted-foreground">
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )})}
            </div>
          )}
        </div>
      </section>
      </div>
    </div>
  );
}
