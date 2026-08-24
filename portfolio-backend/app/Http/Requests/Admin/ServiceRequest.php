<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $serviceId = $this->route('service') ? $this->route('service')->id : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('services', 'slug')->ignore($serviceId)],
            'description' => ['required', 'string'],
            'price_type' => ['required', 'string', 'max:50'],
            'price' => ['nullable', 'numeric'],
            'is_featured' => ['boolean'],
            'order' => ['nullable', 'integer'],
            // Handling features inline
            'features' => ['nullable', 'array'],
            'features.*.feature_name' => ['required_with:features', 'string', 'max:255'],
            'features.*.order' => ['nullable', 'integer'],
        ];
    }
}
