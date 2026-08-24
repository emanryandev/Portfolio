import { useParams, Link } from 'react-router-dom';
import { useProject } from '@/features/projects/api/queries';
import { SEO } from '@/components/shared/SEO';
import { PageLoader } from '@/components/shared/PageLoader';
import { NotFound } from '@/components/shared/NotFound';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Link as LinkIcon, Layers, Users } from 'lucide-react';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: response, isLoading, isError, error } = useProject(slug || '');

  if (isLoading) return <PageLoader />;

  // @ts-ignore
  if (isError && error?.status === 404) return <NotFound />;
  
  if (isError || !response?.data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Error loading project</h1>
        <Link to="/projects"><Button variant="outline">Return to Projects</Button></Link>
      </div>
    );
  }

  const project = response.data;
  
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title={project.name} 
        description={project.description.substring(0, 160)}
        image={project.cover_image || undefined}
        url={`https://yourdomain.com/projects/${project.slug}`}
        type="article"
      />
      
      {/* Header */}
      <section className="pt-12 pb-8 border-b border-border/40">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
          <Link to="/projects">
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                {project.name}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
            
            <div className="flex flex-col gap-3 shrink-0 min-w-[200px]">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full">
                    View Live Site <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="w-full">
                    View Source <LinkIcon className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {project.cover_image && (
        <section className="py-8">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl border border-border/20 bg-muted">
              <img 
                src={project.cover_image} 
                alt={project.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Tech & Team */}
      <section className="py-16">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Tech Stack */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-bold">
                <Layers className="h-6 w-6 text-primary" />
                <h2>Technologies Used</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {project.technologies?.map(tech => (
                  <Badge key={tech.id} variant="secondary" className="px-4 py-2 text-sm font-medium">
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Team Contributions */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-bold">
                <Users className="h-6 w-6 text-primary" />
                <h2>Team Contributions</h2>
              </div>
              
              <div className="space-y-6">
                {project.team_contributions?.map(contribution => (
                  <div key={contribution.id} className="flex gap-4 p-4 rounded-lg bg-secondary/10 border border-border/40">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-background">
                      {contribution.team_member?.image_url ? (
                        <img src={contribution.team_member.image_url} alt={contribution.team_member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">IMG</div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-lg">{contribution.team_member?.name}</h4>
                        <Badge variant="outline" className="text-xs">{contribution.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {contribution.contribution_description}
                      </p>
                      {contribution.team_member?.slug && (
                        <Link to={`/team/${contribution.team_member.slug}`} className="inline-block mt-2 text-sm text-primary hover:underline">
                          View Profile
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Gallery placeholder if needed later */}
    </div>
  );
}
