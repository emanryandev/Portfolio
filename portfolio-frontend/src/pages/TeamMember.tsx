import { useParams, Link } from 'react-router-dom';
import { useTeamMember } from '@/features/team/api/queries';
import { SEO } from '@/components/shared/SEO';
import { PageLoader } from '@/components/shared/PageLoader';
import { NotFound } from '@/components/shared/NotFound';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ArrowLeft, ArrowRight, ExternalLink, Link as LinkIcon, Mail, Phone } from 'lucide-react';

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
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-6xl">
                  {member.name ? member.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '??'}
                </div>
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
                
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full h-11 w-11 hover:text-foreground">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">GitHub</span>
                    </Button>
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full h-11 w-11 hover:text-[#0A66C2] hover:border-[#0A66C2]">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`}>
                    <Button variant="outline" size="icon" className="rounded-full h-11 w-11">
                      <Mail className="h-5 w-5" />
                      <span className="sr-only">Email</span>
                    </Button>
                  </a>
                )}
                {member.phone && (
                  <a href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full h-11 w-11 hover:text-[#25D366] hover:border-[#25D366]">
                      <Phone className="h-5 w-5" />
                      <span className="sr-only">WhatsApp</span>
                    </Button>
                  </a>
                )}

                {member.social_links?.filter(social => {
                  const p = social.platform.toLowerCase();
                  if (p === 'github' && member.github) return false;
                  if (p === 'linkedin' && member.linkedin) return false;
                  return true;
                }).map((social, idx) => {
                  const isGithub = social.platform.toLowerCase() === 'github';
                  const isLinkedin = social.platform.toLowerCase() === 'linkedin';
                  const isTwitter = social.platform.toLowerCase() === 'twitter';
                  const isPortfolio = social.platform.toLowerCase() === 'portfolio';

                  return (
                    <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={`rounded-full h-11 w-11 transition-colors ${
                          isLinkedin ? 'hover:text-[#0A66C2] hover:border-[#0A66C2]' : 
                          isGithub ? 'hover:text-foreground' : ''
                        }`}
                      >
                        {isGithub ? (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        ) : isLinkedin ? (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        ) : isTwitter ? (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                        ) : (
                          <ExternalLink className="h-5 w-5" />
                        )}
                        <span className="sr-only">{social.platform}</span>
                      </Button>
                    </a>
                  );
                })}
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
