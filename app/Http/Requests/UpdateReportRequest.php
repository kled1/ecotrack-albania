<?php

namespace App\Http\Requests;

use App\Enums\MaterialCategory;
use App\Enums\ReportStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        $report = $this->route('report');
        return $report->status === ReportStatus::Draft
            && $this->user()->id === $report->user_id;
    }

    public function rules(): array
    {
        return [
            'period_type' => ['required', Rule::in(['quarterly', 'annual'])],
            'period_year' => ['required', 'integer', 'min:2020', 'max:' . (now()->year + 1)],
            'period_quarter' => [
                Rule::requiredIf($this->period_type === 'quarterly'),
                'nullable',
                'integer',
                'min:1',
                'max:4',
            ],
            'material_category' => ['required', Rule::enum(MaterialCategory::class)],
            'quantity_kg' => ['required', 'numeric', 'min:0.001'],
            'quantity_units' => ['nullable', 'integer', 'min:1'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
