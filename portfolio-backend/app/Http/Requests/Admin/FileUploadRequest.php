<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class FileUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:jpeg,png,jpg,webp',
                'max:5120', // 5MB max
                'dimensions:max_width=4000,max_height=4000'
            ],
            'folder' => ['nullable', 'string', 'in:team,projects,services,general'],
        ];
    }
}
