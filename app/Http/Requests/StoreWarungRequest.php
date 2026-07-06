<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWarungRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'is_active' => 'boolean',
            'payment_status' => 'required|in:1,2,3',
            'margin_category' => 'required|in:1,3',
            'mg_normal' => 'required|integer|min:0',
            'mg_absolut' => 'required|integer|min:0|lte:mg_normal',
        ];
    }
}
