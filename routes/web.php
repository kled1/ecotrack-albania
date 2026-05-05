<?php

use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Certificate\CertificateController;
use App\Http\Controllers\Collaboration\CollaborationController;
use App\Http\Controllers\Dashboard\InstitutionDashboardController;
use App\Http\Controllers\Dashboard\ProducerDashboardController;
use App\Http\Controllers\Dashboard\RecyclerDashboardController;
use App\Http\Controllers\Dashboard\ShpzpDashboardController;
use App\Http\Controllers\Marketplace\MarketplaceController;
use App\Http\Controllers\Marketplace\MyListingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Reports\ReportController;
use App\Http\Controllers\WasteBatch\WasteBatchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

// Role-based dashboard redirect
Route::get('/dashboard', function () {
    $user = auth()->user();

    if ($user->hasRole('super-admin')) {
        return redirect()->route('dashboard.admin');
    } elseif ($user->hasRole('producer')) {
        return redirect()->route('dashboard.producer');
    } elseif ($user->hasRole('recycler')) {
        return redirect()->route('dashboard.recycler');
    } elseif ($user->hasRole('shpzp')) {
        return redirect()->route('dashboard.shpzp');
    } elseif ($user->hasRole('institution')) {
        return redirect()->route('dashboard.institution');
    }

    return Inertia::render('Dashboard/Default');
})->middleware(['auth', 'verified'])->name('dashboard');

// Per-role dashboards
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/producer', ProducerDashboardController::class)
        ->middleware('role:producer|super-admin')
        ->name('dashboard.producer');

    Route::get('/dashboard/recycler', RecyclerDashboardController::class)
        ->middleware('role:recycler|super-admin')
        ->name('dashboard.recycler');

    Route::get('/dashboard/shpzp', ShpzpDashboardController::class)
        ->middleware('role:shpzp|super-admin')
        ->name('dashboard.shpzp');

    Route::get('/dashboard/institution', InstitutionDashboardController::class)
        ->middleware('role:institution|super-admin')
        ->name('dashboard.institution');

    Route::get('/dashboard/admin', function () {
        return Inertia::render('Dashboard/Admin');
    })->middleware('role:super-admin')->name('dashboard.admin');
});

// Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Reports (producers)
Route::middleware(['auth', 'verified', 'role:producer|super-admin'])->group(function () {
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/create', [ReportController::class, 'create'])->name('reports.create');
    Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
    Route::get('/reports/{report}', [ReportController::class, 'show'])->name('reports.show');
    Route::get('/reports/{report}/edit', [ReportController::class, 'edit'])->name('reports.edit');
    Route::put('/reports/{report}', [ReportController::class, 'update'])->name('reports.update');
    Route::post('/reports/{report}/submit', [ReportController::class, 'submit'])->name('reports.submit');
    Route::delete('/reports/{report}', [ReportController::class, 'destroy'])->name('reports.destroy');
});

// Report verification (institution + super-admin)
Route::middleware(['auth', 'verified', 'role:institution|super-admin'])
    ->post('/reports/{report}/verify', [ReportController::class, 'verify'])
    ->name('reports.verify');

// ─── Marketplace ──────────────────────────────────────────────────────────────

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/marketplace', [MarketplaceController::class, 'index'])
        ->name('marketplace.index');

    Route::post('/marketplace/{recyclerListing}/request', [MarketplaceController::class, 'sendRequest'])
        ->middleware('role:producer|super-admin')
        ->name('marketplace.request');
});

// My Listing (recyclers)
Route::middleware(['auth', 'verified', 'role:recycler|super-admin'])->group(function () {
    Route::get('/my-listing', [MyListingController::class, 'index'])->name('my-listing.index');
    Route::get('/my-listing/create', [MyListingController::class, 'create'])->name('my-listing.create');
    Route::post('/my-listing', [MyListingController::class, 'store'])->name('my-listing.store');
    Route::put('/my-listing/{recyclerListing}', [MyListingController::class, 'update'])->name('my-listing.update');
    Route::post('/my-listing/{recyclerListing}/toggle', [MyListingController::class, 'toggle'])->name('my-listing.toggle');
});

// ─── Collaborations ───────────────────────────────────────────────────────────

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/collaborations', [CollaborationController::class, 'index'])->name('collaborations.index');
    Route::get('/collaborations/{collaboration}', [CollaborationController::class, 'show'])->name('collaborations.show');

    Route::middleware('role:recycler|super-admin')->group(function () {
        Route::post('/collaborations/{collaboration}/accept', [CollaborationController::class, 'accept'])->name('collaborations.accept');
        Route::post('/collaborations/{collaboration}/reject', [CollaborationController::class, 'reject'])->name('collaborations.reject');
        Route::post('/collaborations/{collaboration}/activate', [CollaborationController::class, 'activate'])->name('collaborations.activate');
        Route::post('/collaborations/{collaboration}/complete', [CollaborationController::class, 'complete'])->name('collaborations.complete');
    });

    Route::post('/collaborations/{collaboration}/cancel', [CollaborationController::class, 'cancel'])
        ->middleware('role:producer|super-admin')
        ->name('collaborations.cancel');
});

// ─── Waste Batches ────────────────────────────────────────────────────────────

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/waste-batches', [WasteBatchController::class, 'index'])->name('waste-batches.index');

    Route::middleware('role:recycler|super-admin')->group(function () {
        Route::post('/waste-batches', [WasteBatchController::class, 'store'])->name('waste-batches.store');
        Route::post('/waste-batches/{wasteBatch}/update-status', [WasteBatchController::class, 'updateStatus'])->name('waste-batches.update-status');
    });
});

// ─── Certificates ─────────────────────────────────────────────────────────────

Route::get('/certificates', [CertificateController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('certificates.index');

// ─── Admin ────────────────────────────────────────────────────────────────────

Route::middleware(['auth', 'verified', 'role:institution|shpzp|super-admin'])->group(function () {
    Route::get('/admin/reports', [AdminReportController::class, 'index'])->name('admin.reports');
    Route::get('/admin/companies', [CompanyController::class, 'index'])->name('admin.companies');
});

Route::middleware(['auth', 'verified', 'role:super-admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
    Route::post('/admin/users/{user}/toggle', [UserController::class, 'toggle'])->name('admin.users.toggle');
    Route::post('/admin/users/{user}/role', [UserController::class, 'updateRole'])->name('admin.users.role');
});

require __DIR__.'/auth.php';
