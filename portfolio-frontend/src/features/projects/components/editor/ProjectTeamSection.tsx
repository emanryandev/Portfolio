import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProjectFormValues } from '../../schemas/projectSchema';
import { useAdminTeamMembers } from '@/features/team/api/admin';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ProjectTeamSection() {
  const { control, register, watch, setValue, formState: { errors } } = useFormContext<ProjectFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'team_contributions'
  });

  const { data: teamResponse } = useAdminTeamMembers();
  const teamMembers = teamResponse?.data || [];

  const contributions = watch('team_contributions') || [];

  const addContribution = () => {
    append({
      team_member_id: 0,
      role: '',
      contribution_description: '',
      order: fields.length
    });
  };

  return (
    <Card className="border-border/40">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Contributions</CardTitle>
        <Button type="button" onClick={addContribution} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground border border-dashed rounded-md">
            No team members added to this project yet.
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => {
              const selectedMemberId = contributions[index]?.team_member_id;
              const isDuplicate = selectedMemberId && contributions.filter((c, i) => i !== index && c.team_member_id === selectedMemberId).length > 0;
              const fieldError = errors.team_contributions?.[index];

              return (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-md relative bg-secondary/5">
                  <div className="md:col-span-3 space-y-2">
                    <Label>Team Member</Label>
                    <Select 
                      value={selectedMemberId ? selectedMemberId.toString() : ''} 
                      onValueChange={(val) => {
                        setValue(`team_contributions.${index}.team_member_id`, Number(val), { shouldValidate: true, shouldDirty: true });
                      }}
                    >
                      <SelectTrigger className={isDuplicate ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map(member => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isDuplicate && (
                      <p className="text-xs text-destructive flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" /> Member already added
                      </p>
                    )}
                    {fieldError?.team_member_id && (
                      <p className="text-xs text-destructive">{fieldError.team_member_id.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <Label>Role on Project</Label>
                    <Input 
                      placeholder="e.g. Lead Designer"
                      {...register(`team_contributions.${index}.role`)}
                    />
                    {fieldError?.role && (
                      <p className="text-xs text-destructive">{fieldError.role.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <Label>Contribution Details</Label>
                    <Input 
                      placeholder="What did they do?"
                      {...register(`team_contributions.${index}.contribution_description`)}
                    />
                  </div>
                  
                  <div className="md:col-span-1 space-y-2">
                    <Label>Order</Label>
                    <Input 
                      type="number"
                      {...register(`team_contributions.${index}.order`, { valueAsNumber: true })}
                    />
                  </div>

                  <div className="md:col-span-1 flex items-end justify-end pb-1">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
