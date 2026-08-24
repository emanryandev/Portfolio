<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Handled by controller/policy
    }

    public function rules(): array
    {
        $memberId = $this->route('team_member') ? $this->route('team_member')->id : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('team_members', 'slug')->ignore($memberId)],
            'role' => ['required', 'string', 'max:255'],
            'bio' => ['required', 'string'],
            'image_url' => ['nullable', 'string', 'url'], // For now a string URL, Phase 3 covers File Uploads later
            'email' => ['nullable', 'email', 'max:255'],
            'order' => ['nullable', 'integer'],
        ];
    }
}
