<?php

namespace App\Policies;

use App\Enums\ReportStatus;
use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('reports.view-own') || $user->hasPermissionTo('reports.view-all');
    }

    public function view(User $user, Report $report): bool
    {
        if ($user->hasPermissionTo('reports.view-all')) {
            return true;
        }
        return $user->id === $report->user_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('reports.create');
    }

    public function update(User $user, Report $report): bool
    {
        return $user->id === $report->user_id
            && $report->status === ReportStatus::Draft;
    }

    public function delete(User $user, Report $report): bool
    {
        return $user->id === $report->user_id
            && $report->status === ReportStatus::Draft;
    }

    public function submit(User $user, Report $report): bool
    {
        return $user->id === $report->user_id
            && $report->status === ReportStatus::Draft;
    }
}
