<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Reports
            'reports.create',
            'reports.view',
            'reports.view-own',
            'reports.submit',
            'reports.verify',
            'reports.export',
            'reports.view-all',

            // Recycler listings
            'listings.create',
            'listings.view',
            'listings.update-own',
            'listings.delete-own',

            // Collaborations
            'collaborations.create',
            'collaborations.view-own',
            'collaborations.view-all',
            'collaborations.accept',
            'collaborations.reject',

            // Waste batches
            'batches.create',
            'batches.update-status',
            'batches.view-own',
            'batches.view-all',

            // Certificates & Credits
            'certificates.issue',
            'certificates.view-own',
            'certificates.view-all',
            'credits.view-own',

            // Dashboard
            'dashboard.producer',
            'dashboard.recycler',
            'dashboard.shpzp',
            'dashboard.institution',
            'dashboard.admin',

            // Users (admin)
            'users.view-all',
            'users.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $superAdmin = Role::firstOrCreate(['name' => UserRole::SuperAdmin->value, 'guard_name' => 'web']);
        $superAdmin->syncPermissions(Permission::all());

        $producer = Role::firstOrCreate(['name' => UserRole::Producer->value, 'guard_name' => 'web']);
        $producer->syncPermissions([
            'reports.create', 'reports.view-own', 'reports.submit', 'reports.export',
            'collaborations.create', 'collaborations.view-own',
            'batches.view-own',
            'certificates.view-own', 'credits.view-own',
            'listings.view',
            'dashboard.producer',
        ]);

        $recycler = Role::firstOrCreate(['name' => UserRole::Recycler->value, 'guard_name' => 'web']);
        $recycler->syncPermissions([
            'listings.create', 'listings.update-own', 'listings.delete-own', 'listings.view',
            'collaborations.view-own', 'collaborations.accept', 'collaborations.reject',
            'batches.create', 'batches.update-status', 'batches.view-own',
            'certificates.issue', 'certificates.view-own',
            'dashboard.recycler',
        ]);

        $shpzp = Role::firstOrCreate(['name' => UserRole::Shpzp->value, 'guard_name' => 'web']);
        $shpzp->syncPermissions([
            'reports.view', 'reports.view-all',
            'collaborations.view-all',
            'batches.view-all',
            'certificates.view-all',
            'dashboard.shpzp',
        ]);

        $institution = Role::firstOrCreate(['name' => UserRole::Institution->value, 'guard_name' => 'web']);
        $institution->syncPermissions([
            'reports.view-all', 'reports.verify',
            'collaborations.view-all',
            'batches.view-all',
            'certificates.view-all',
            'users.view-all',
            'dashboard.institution',
        ]);

        // Create default super-admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@ecotrack.al'],
            [
                'name' => 'Super Admin',
                'company_name' => 'EcoTrack Albania',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole(UserRole::SuperAdmin->value);
    }
}
