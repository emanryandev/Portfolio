import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAdminService, useCreateService, useUpdateService } from '@/features/services/api/admin';
import { SEO } from '@/components/shared/SEO';
import { PageLoader } from '@/components/shared/PageLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save, Trash2, Plus } from 'lucide-react';

const serviceSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description needs to be longer'),
  category: z.enum(['global', 'backend', 'devops', 'pentesting']),
  price_type: z.enum(['fixed', 'starting_at', 'custom']),
  price: z.string().optional().nullable(),
  features: z.array(z.object({ value: z.string() })).min(1, 'Add at least one feature'),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const { data: response, isLoading: isLoadingData } = useAdminService(isEditing ? (id as string) : '');
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      category: 'global',
      price_type: 'custom',
      price: '',
      features: [{ value: '' }],
      is_active: true,
      is_featured: false,
      order: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features"
  });

  useEffect(() => {
    if (isEditing && response?.data) {
      form.reset({
        name: response.data.name,
        description: response.data.description,
        category: response.data.category || 'global',
        price_type: response.data.price_type,
        price: response.data.price || '',
        features: response.data.features.map(f => ({ value: f })),
        is_active: response.data.is_active,
        is_featured: response.data.is_featured,
        order: response.data.order,
      });
    }
  }, [isEditing, response, form]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      // Transform features back to array of strings
      const payload = {
        ...data,
        features: data.features.map(f => f.value).filter(Boolean),
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: id as string, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      navigate('/admin/services');
    } catch (error: any) {
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, messages]) => {
          form.setError(key as any, { type: 'server', message: (messages as string[])[0] });
        });
      } else {
        alert(error.message || 'Failed to save service.');
      }
    }
  };

  if (isEditing && isLoadingData) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-4xl">
      <SEO title={isEditing ? 'Edit Service' : 'New Service'} description="Create or edit a service" />
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/services')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Edit Service' : 'New Service'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update service details.' : 'Create a new service offering.'}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input id="name" disabled={isSaving} {...form.register('name')} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" className="min-h-[120px]" disabled={isSaving} {...form.register('description')} />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input 
                      placeholder="e.g. Responsive Design"
                      {...form.register(`features.${index}.value` as const)}
                      disabled={isSaving}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => remove(index)}
                      disabled={fields.length === 1 || isSaving}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ value: '' })}
                  disabled={isSaving}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Feature
                </Button>
                {form.formState.errors.features && (
                  <p className="text-sm text-destructive">{form.formState.errors.features.message}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select 
                    id="category" 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSaving}
                    {...form.register('category')}
                  >
                    <option value="global">Global (Team)</option>
                    <option value="backend">Backend / Fullstack</option>
                    <option value="devops">DevOps</option>
                    <option value="pentesting">Pentesting</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_type">Price Type</Label>
                  <select 
                    id="price_type" 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSaving}
                    {...form.register('price_type')}
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="starting_at">Starting At</option>
                    <option value="custom">Custom Quote</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Text)</Label>
                  <Input id="price" placeholder="e.g. $5000" disabled={isSaving} {...form.register('price')} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input id="order" type="number" disabled={isSaving} {...form.register('order', { valueAsNumber: true })} />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="is_active" 
                    checked={form.watch('is_active')}
                    onCheckedChange={(val) => form.setValue('is_active', !!val)}
                    disabled={isSaving}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="is_featured" 
                    checked={form.watch('is_featured')}
                    onCheckedChange={(val) => form.setValue('is_featured', !!val)}
                    disabled={isSaving}
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">Featured Service</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border/40">
          <Button type="button" variant="ghost" className="mr-2" onClick={() => navigate('/admin/services')} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEditing ? 'Save Changes' : 'Create Service'}
          </Button>
        </div>
      </form>
    </div>
  );
}
