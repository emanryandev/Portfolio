import { useParams, useNavigate } from 'react-router-dom';
import { useAdminContactRequest, useUpdateContactStatus } from '@/features/contact/api/admin';
import { SEO } from '@/components/shared/SEO';
import { PageLoader } from '@/components/shared/PageLoader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Mail, User, Building, DollarSign, Tag, CheckCircle } from 'lucide-react';

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, isError } = useAdminContactRequest(Number(id));
  const updateStatusMutation = useUpdateContactStatus();

  if (isLoading) return <PageLoader />;
  if (isError || !response?.data) return <div className="p-8 text-center text-destructive">Error loading request</div>;

  const request = response.data;

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: Number(id), status });
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <SEO title={`Contact Request: ${request.client_name}`} description="View contact request details" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/contacts')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Request from {request.client_name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(request.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {request.status !== 'completed' && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleStatusChange('completed')}
              disabled={updateStatusMutation.isPending}
            >
              <CheckCircle className="w-4 h-4" />
              Mark Completed
            </Button>
          )}
          <Badge className="text-sm px-3 py-1 capitalize" variant="secondary">
            {(request.status || 'new').replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-foreground/80 leading-relaxed bg-secondary/10 p-4 rounded-md border border-border/40">
                {request.message}
              </div>
            </CardContent>
          </Card>

          {request.recipients && request.recipients.length > 0 && (
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Directed To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {request.recipients.map((rec) => (
                    <Badge key={rec.team_member_id} variant="outline">
                      {rec.team_member?.name || `Member #${rec.team_member_id}`}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{request.client_name}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <a href={`mailto:${request.client_email}`} className="font-medium text-primary hover:underline">
                    {request.client_email}
                  </a>
                </div>
              </div>
              {request.company_name && (
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Company</div>
                    <div className="font-medium">{request.company_name}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-medium capitalize">{request.project_type?.replace('_', ' ') ?? '-'}</div>
                </div>
              </div>
              {request.budget_range && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Budget Range</div>
                    <div className="font-medium">{request.budget_range}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
