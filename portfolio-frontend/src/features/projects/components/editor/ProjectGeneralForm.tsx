import { useFormContext } from 'react-hook-form';
import { ProjectFormValues } from '../../schemas/projectSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export function ProjectGeneralForm() {
  const { register, setValue, formState: { errors } } = useFormContext<ProjectFormValues>();

  const handleMdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setValue('description', content, { shouldDirty: true, shouldValidate: true });
      }
    };
    reader.readAsText(file);
    
    // Reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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
          <div className="flex items-center justify-between">
            <Label htmlFor="description">Full Description</Label>
            <div>
              <Label htmlFor="md-upload" className="cursor-pointer text-xs flex items-center gap-1.5 text-primary hover:underline transition-colors px-2 py-1 rounded-md hover:bg-primary/10">
                <FileText className="w-3.5 h-3.5" /> Upload .md File
              </Label>
              <input 
                id="md-upload" 
                type="file" 
                accept=".md,text/markdown" 
                className="hidden" 
                onChange={handleMdUpload}
              />
            </div>
          </div>
          <Textarea 
            id="description" 
            {...register('description')} 
            className="min-h-[150px]" 
            placeholder="Detailed project description (Supports Markdown)..."
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
