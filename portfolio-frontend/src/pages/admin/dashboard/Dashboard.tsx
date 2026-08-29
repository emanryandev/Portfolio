import { useNavigate } from 'react-router-dom';
import { useDashboardSummary } from '@/features/dashboard/api/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/shared/SEO';
import { PageLoader } from '@/components/shared/PageLoader';
import { Briefcase, Users, Layers, MessageSquare, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: response, isLoading, isError, refetch } = useDashboardSummary();

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
        <p className="text-muted-foreground mb-4">There was an error communicating with the server.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const { metrics, recent_projects, recent_contact_requests } = response!.data;

  return (
    <div className="space-y-8">
      <SEO title="Dashboard" description="Admin dashboard summary" />
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/40 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">Total Projects</span>
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-3xl font-bold">{metrics.projects}</div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">Team Members</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-3xl font-bold">{metrics.team_members}</div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">Services</span>
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-3xl font-bold">{metrics.services}</div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm border-primary/20 bg-primary/5">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between text-primary">
              <span className="text-sm font-medium">New Contact Requests</span>
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-3xl font-bold text-primary">{metrics.new_contact_requests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Projects */}
        <Card className="border-border/40 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Recent Projects</CardTitle>
              <CardDescription>Latest projects added to the portfolio</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/projects')} className="text-xs">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            {recent_projects.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground italic">No projects found.</div>
            ) : (
              <div className="space-y-4">
                {recent_projects.map(project => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/projects/${project.id}/edit`)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-secondary overflow-hidden shrink-0">
                        {project.cover_image && <img src={project.cover_image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{project.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{project.slug}</p>
                      </div>
                    </div>
                    <Badge variant={project.published_at ? 'default' : 'secondary'} className="text-[10px]">
                      {project.published_at ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card className="border-border/40 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Recent Contact Requests</CardTitle>
              <CardDescription>Latest inquiries from potential clients</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/contacts')} className="text-xs">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            {recent_contact_requests.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground italic">No requests found.</div>
            ) : (
              <div className="space-y-4">
                {recent_contact_requests.map(req => (
                  <div key={req.id} className="flex items-start justify-between p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/contacts/${req.id}`)}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{req.name}</span>
                        {req.status === 'new' && <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">New</Badge>}
                        {req.status === 'in_progress' && <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">In Progress</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{req.email}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{req.message}</p>
                    </div>
                    <div className="text-[10px] text-muted-foreground whitespace-nowrap ml-4">
                      {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
