<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $projectId = $this->route('project') ? $this->route('project')->id : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('projects', 'slug')->ignore($projectId)],
            'description' => ['required', 'string'],
            'status' => ['required', Rule::in(['draft', 'in_progress', 'completed'])],
            'is_featured' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'category_id' => ['nullable', 'exists:categories,id'], // Make sure category exists
            'live_url' => ['nullable', 'url'],
            'github_url' => ['nullable', 'url'],
            'cover_image' => ['nullable', 'url'],
            'order' => ['nullable', 'integer'],
            // Technologies array
            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['exists:technologies,id'],
        ];
    }
}
