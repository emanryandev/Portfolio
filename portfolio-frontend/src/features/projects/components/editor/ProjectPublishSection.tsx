import { useFormContext } from 'react-hook-form';
import { ProjectFormValues } from '../../schemas/projectSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProjectPublishSection() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProjectFormValues>();

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle>Publishing & Display</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="space-y-2">
          <Label htmlFor="published_at">Publish Date</Label>
          <Input 
            id="published_at" 
            type="datetime-local"
            {...register('published_at')} 
          />
          <p className="text-xs text-muted-foreground">Leave empty to save as Draft.</p>
          {errors.published_at && <p className="text-sm text-destructive">{errors.published_at.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input 
            id="order" 
            type="number"
            {...register('order', { valueAsNumber: true })} 
          />
          {errors.order && <p className="text-sm text-destructive">{errors.order.message}</p>}
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="is_featured" 
            checked={watch('is_featured')}
            onCheckedChange={(val) => setValue('is_featured', !!val, { shouldDirty: true })}
          />
          <Label htmlFor="is_featured" className="cursor-pointer">Featured Project</Label>
        </div>

      </CardContent>
    </Card>
  );
}
