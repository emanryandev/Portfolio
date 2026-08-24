import { useParams, Link } from 'react-router-dom';
import { useTeamMember } from '@/features/team/api/queries';
import { SEO } from '@/components/shared/SEO';
import { PageLoader } from '@/components/shared/PageLoader';
import { NotFound } from '@/components/shared/NotFound';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ArrowLeft, ArrowRight, ExternalLink, Link as LinkIcon } from 'lucide-react';

export default function TeamMember() {
  const { slug } = useParams<{ slug: string }>();
  const { data: response, isLoading, isError, error } = useTeamMember(slug || '');

  if (isLoading) return <PageLoader />;

  // @ts-ignore - The error object has status property if it's an AxiosError
  if (isError && error?.status === 404) return <NotFound />;
  
  if (isError || !response?.data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Error loading profile</h1>
        <Link to="/"><Button variant="outline">Return Home</Button></Link>
      </div>
    );
  }

  const member = response.data;
  
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title={`${member.name} - ${member.role}`} 
        description={member.bio?.substring(0, 160) || `Profile of ${member.name}, ${member.role}`}
        image={member.image_url || undefined}
        url={`https://yourdomain.com/team/${member.slug}`}
        type="profile"
      />
      
      {/* Back button */}
      <div className="container px-4 md:px-6 max-w-screen-xl mx-auto pt-12 pb-4">
        <Link to="/">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
          </Button>
        </Link>
      </div>

      {/* Hero Profile */}
      <section className="py-12 md:py-20 border-b border-border/40 bg-secondary/10">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden bg-background ring-4 ring-border shadow-xl shrink-0 flex items-center justify-center">
              {member.image_url ? (
                <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-24 h-24 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{member.name}</h1>
                <p className="text-xl text-primary font-medium">{member.role}</p>
              </div>
              
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">{member.bio}</p>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <Link to={`/contact?recipient=${member.id}`}>
                  <Button size="lg">Work with {member.name.split(' ')[0]}</Button>
                </Link>
                
                {member.social_links?.map((social, idx) => (
                  <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full h-11 w-11">
                      {social.platform === 'github' && <LinkIcon className="h-5 w-5" />}
                      {social.platform === 'linkedin' && <LinkIcon className="h-5 w-5" />}
                      {social.platform === 'twitter' && <LinkIcon className="h-5 w-5" />}
                      {social.platform === 'portfolio' && <ExternalLink className="h-5 w-5" />}
                      {!['github', 'linkedin', 'twitter', 'portfolio'].includes(social.platform) && <ExternalLink className="h-5 w-5" />}
                      <span className="sr-only">{social.platform}</span>
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Tech */}
      {member.skills && member.skills.length > 0 && (
        <section className="py-20 border-b border-border/40">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Expertise & Skills</h2>
            <div className="flex flex-wrap gap-3">
              {member.skills.map((skill: any, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-base px-4 py-1.5 font-medium">
                  {typeof skill === 'object' ? skill.name : skill}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Project Contributions */}
      {member.project_contributions && member.project_contributions.length > 0 && (
        <section className="py-20 bg-card">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-12">Project Contributions</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {member.project_contributions.map((contribution) => (
                <Card key={contribution.id} className="border-border/40 bg-background overflow-hidden flex flex-col h-full">
                  <div className="flex flex-col sm:flex-row h-full">
                    {contribution.project?.cover_image && (
                      <div className="sm:w-2/5 h-48 sm:h-auto bg-muted">
                        <img 
                          src={contribution.project.cover_image} 
                          alt={contribution.project.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <CardTitle className="text-xl">
                            {contribution.project?.name || 'Unknown Project'}
                          </CardTitle>
                          <Badge variant="outline" className="shrink-0">{contribution.role}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col pb-6">
                        <p className="text-sm text-muted-foreground mb-6 flex-1">
                          {contribution.contribution_description}
                        </p>
                        
                        {contribution.project?.slug && (
                          <Link to={`/projects/${contribution.project.slug}`} className="mt-auto">
                            <Button variant="link" className="px-0 h-auto font-semibold">
                              View Project <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
