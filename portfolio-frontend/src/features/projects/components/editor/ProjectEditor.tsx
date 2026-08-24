import { useEffect } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectFormValues } from '../../schemas/projectSchema';
import { useAdminProject, useCreateProject, useUpdateProject } from '../../api/admin';
import { SEO } from '@/components/shared/SEO';
import { PageLoader } from '@/components/shared/PageLoader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, AlertTriangle } from 'lucide-react';
import { ProjectGeneralForm } from './ProjectGeneralForm';
import { ProjectMediaSection } from './ProjectMediaSection';
import { ProjectTechnologySection } from './ProjectTechnologySection';
import { ProjectTeamSection } from './ProjectTeamSection';
import { ProjectLinksSection } from './ProjectLinksSection';
import { ProjectPublishSection } from './ProjectPublishSection';

export function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const { data: response, isLoading: isLoadingData } = useAdminProject(isEditing ? Number(id) : 0);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const methods = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: {
      title: '',
      slug: '',
      client_name: '',
      summary: '',
      description: '',
      image_url: '',
      live_url: '',
      github_url: '',
      technologies: [],
      team_contributions: [],
      is_featured: false,
      published_at: '',
      order: 0,
    },
  });

  const { formState: { isDirty }, reset, handleSubmit, setError } = methods;

  // Load existing data
  useEffect(() => {
    if (isEditing && response?.data) {
      const data = response.data;
      reset({
        title: data.title,
        slug: data.slug,
        client_name: data.client_name || '',
        summary: data.summary,
        description: data.description,
        image_url: data.image_url || '',
        live_url: data.live_url || '',
        github_url: data.github_url || '',
        technologies: data.technologies || [],
        team_contributions: data.team_contributions?.map(tc => ({
          id: tc.id,
          team_member_id: tc.team_member_id,
          role: tc.role,
          contribution_description: tc.contribution_description || '',
          order: tc.order,
        })) || [],
        is_featured: data.is_featured,
        published_at: data.published_at ? data.published_at.substring(0, 16) : '',
        order: data.order,
      });
    }
  }, [isEditing, response, reset]);

  // Unsaved changes protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Router blocker
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: Number(id), data });
      } else {
        await createMutation.mutateAsync(data);
      }
      
      // Reset isDirty state immediately before navigation
      reset(data);
      
      navigate('/admin/projects');
    } catch (error: any) {
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, messages]) => {
          // Attempt to map backend validation keys to form fields
          // E.g. 'team_contributions.0.role' -> field
          setError(key as any, { type: 'server', message: (messages as string[])[0] });
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(error.message || 'Failed to save project.');
      }
    }
  };

  const isDraft = !methods.watch('published_at');

  if (isEditing && isLoadingData) return <PageLoader />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6 max-w-6xl pb-24">
        <SEO title={isEditing ? 'Edit Project' : 'New Project'} description="Project editor workspace" />
        
        {/* Header / Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b border-border/40">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" onClick={() => navigate('/admin/projects')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditing ? 'Edit Project' : 'New Project'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {isDirty && (
                  <span className="text-xs text-amber-500 flex items-center font-medium">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Unsaved changes
                  </span>
                )}
                {!isDirty && isEditing && (
                  <span className="text-xs text-muted-foreground">All changes saved</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/projects')} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || (!isDirty && isEditing)}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isDraft ? 'Save Draft' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProjectGeneralForm />
            <ProjectTechnologySection />
            <ProjectTeamSection />
          </div>
          <div className="space-y-8">
            <ProjectPublishSection />
            <ProjectMediaSection />
            <ProjectLinksSection />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
