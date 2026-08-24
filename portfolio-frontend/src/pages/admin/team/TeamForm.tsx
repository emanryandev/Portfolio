import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAdminTeamMember, useCreateTeamMember, useUpdateTeamMember } from '@/features/team/api/admin';
import { SEO } from '@/components/shared/SEO';
import { PageLoader } from '@/components/shared/PageLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  email: z.string().email('Valid email is required'),
  bio: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  order: z.number().int().default(0),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

export default function TeamForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const { data: response, isLoading: isLoadingData } = useAdminTeamMember(isEditing ? Number(id) : 0);
  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema) as any,
    defaultValues: {
      name: '',
      role: '',
      email: '',
      bio: '',
      image_url: '',
      is_active: true,
      order: 0,
    },
  });

  useEffect(() => {
    if (isEditing && response?.data) {
      form.reset({
        name: response.data.name,
        role: response.data.role,
        email: response.data.email,
        bio: response.data.bio || '',
        image_url: response.data.image_url || '',
        is_active: response.data.is_active,
        order: response.data.order,
      });
    }
  }, [isEditing, response, form]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: TeamMemberFormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: Number(id), data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/admin/team');
    } catch (error: any) {
      // Typically backend validation errors will be caught here
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, messages]) => {
          form.setError(key as any, { type: 'server', message: (messages as string[])[0] });
        });
      } else {
        alert(error.message || 'Failed to save team member.');
      }
    }
  };

  if (isEditing && isLoadingData) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-3xl">
      <SEO title={isEditing ? 'Edit Team Member' : 'New Team Member'} description="Create or edit a team member profile" />
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/team')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Edit Team Member' : 'New Team Member'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update member details.' : 'Add a new member to the team.'}
          </p>
        </div>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" disabled={isSaving} {...form.register('name')} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" disabled={isSaving} {...form.register('email')} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role / Title</Label>
              <Input id="role" placeholder="e.g. Senior Frontend Developer" disabled={isSaving} {...form.register('role')} />
              {form.formState.errors.role && (
                <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea id="bio" className="min-h-[100px]" disabled={isSaving} {...form.register('bio')} />
              {form.formState.errors.bio && (
                <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input id="image_url" placeholder="https://..." disabled={isSaving} {...form.register('image_url')} />
              {form.formState.errors.image_url && (
                <p className="text-sm text-destructive">{form.formState.errors.image_url.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" disabled={isSaving} {...form.register('order', { valueAsNumber: true })} />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox 
                  id="is_active" 
                  checked={form.watch('is_active')}
                  onCheckedChange={(val) => form.setValue('is_active', !!val)}
                  disabled={isSaving}
                />
                <Label htmlFor="is_active" className="cursor-pointer">Active Member</Label>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button type="button" variant="ghost" className="mr-2" onClick={() => navigate('/admin/team')} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isEditing ? 'Save Changes' : 'Create Member'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
