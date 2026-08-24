import { useFormContext } from 'react-hook-form';
import { ProjectFormValues } from '../../schemas/projectSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProjectGeneralForm() {
  const { register, formState: { errors } } = useFormContext<ProjectFormValues>();

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" {...register('slug')} />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client_name">Client Name (Optional)</Label>
          <Input id="client_name" {...register('client_name')} />
          {errors.client_name && <p className="text-sm text-destructive">{errors.client_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Short Summary</Label>
          <Input id="summary" {...register('summary')} placeholder="A brief description for cards..." />
          {errors.summary && <p className="text-sm text-destructive">{errors.summary.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full Description</Label>
          <Textarea 
            id="description" 
            {...register('description')} 
            className="min-h-[150px]" 
            placeholder="Detailed project description..."
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
