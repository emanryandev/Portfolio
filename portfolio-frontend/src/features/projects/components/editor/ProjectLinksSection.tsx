import { useFormContext } from 'react-hook-form';
import { ProjectFormValues } from '../../schemas/projectSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Link as GithubIcon } from 'lucide-react';

export function ProjectLinksSection() {
  const { register, formState: { errors } } = useFormContext<ProjectFormValues>();

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle>External Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="space-y-2">
          <Label htmlFor="live_url">Live URL</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              id="live_url" 
              {...register('live_url')} 
              placeholder="https://..."
              className="pl-9"
            />
          </div>
          {errors.live_url && <p className="text-sm text-destructive">{errors.live_url.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="github_url">GitHub URL</Label>
          <div className="relative">
            <GithubIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              id="github_url" 
              {...register('github_url')} 
              placeholder="https://github.com/..."
              className="pl-9"
            />
          </div>
          {errors.github_url && <p className="text-sm text-destructive">{errors.github_url.message}</p>}
        </div>

      </CardContent>
    </Card>
  );
}
