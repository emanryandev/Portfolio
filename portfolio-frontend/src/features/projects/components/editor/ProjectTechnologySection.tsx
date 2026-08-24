import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProjectFormValues } from '../../schemas/projectSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

export function ProjectTechnologySection() {
  const { watch, setValue } = useFormContext<ProjectFormValues>();
  const [inputValue, setInputValue] = useState('');
  
  const technologies = watch('technologies') || [];

  const addTech = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTech = inputValue.trim();
    if (!technologies.includes(newTech)) {
      setValue('technologies', [...technologies, newTech], { shouldDirty: true });
    }
    setInputValue('');
  };

  const removeTech = (tech: string) => {
    setValue('technologies', technologies.filter(t => t !== tech), { shouldDirty: true });
  };

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle>Technologies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tech-input">Add Technology</Label>
          <div className="flex gap-2">
            <Input 
              id="tech-input" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTech();
                }
              }}
              placeholder="e.g. React, Laravel, PostgreSQL..."
            />
            <Button type="button" onClick={addTech} variant="secondary">
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {technologies.length === 0 && (
            <div className="text-sm text-muted-foreground italic">No technologies added yet.</div>
          )}
          {technologies.map((tech) => (
            <Badge key={tech} variant="default" className="text-sm py-1 px-3">
              {tech}
              <button
                type="button"
                onClick={() => removeTech(tech)}
                className="ml-2 hover:text-destructive focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
