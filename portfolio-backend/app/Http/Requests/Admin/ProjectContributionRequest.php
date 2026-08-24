<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectContributionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $contributionId = $this->route('contribution') ? $this->route('contribution')->id : null;

        // Ensure combination of project_id and team_member_id is unique, unless we are updating the current record
        $uniqueRule = Rule::unique('project_team_contributions')
            ->where('project_id', $this->project_id)
            ->where('team_member_id', $this->team_member_id)
            ->ignore($contributionId);

        return [
            'project_id' => ['required', 'exists:projects,id'],
            'team_member_id' => ['required', 'exists:team_members,id', $uniqueRule],
            'role' => ['required', 'string', 'max:255'],
            'contribution_description' => ['required', 'string'],
        ];
    }
    
    public function messages(): array
    {
        return [
            'team_member_id.unique' => 'This team member is already assigned to this project.',
        ];
    }
}
