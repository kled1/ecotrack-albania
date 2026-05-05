<?php

namespace Database\Seeders;

use App\Enums\MaterialCategory;
use App\Enums\UserRole;
use App\Enums\UserSector;
use App\Models\RecyclerListing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CompanyUsersSeeder extends Seeder
{
    public function run(): void
    {
        // ─── PRODUCERS ────────────────────────────────────────────────────────

        $producers = [
            [
                'name'         => 'Arben Hoxha',
                'email'        => 'arben@albpack.al',
                'company_name' => 'AlbPack sh.p.k.',
                'nipt'         => 'L12345678A',
                'sector'       => UserSector::Packaging,
                'phone'        => '+355 69 200 1001',
                'address'      => 'Rruga Kavajës 45',
                'city'         => 'Tiranë',
            ],
            [
                'name'         => 'Mirela Çoku',
                'email'        => 'mirela@balkanelektrik.al',
                'company_name' => 'Balkan Elektrik sh.a.',
                'nipt'         => 'K87654321B',
                'sector'       => UserSector::Electronics,
                'phone'        => '+355 69 200 1002',
                'address'      => 'Bulevardi Bajram Curri 12',
                'city'         => 'Durrës',
            ],
            [
                'name'         => 'Fatos Zeneli',
                'email'        => 'fatos@adriaauto.al',
                'company_name' => 'Adria Auto Import sh.p.k.',
                'nipt'         => 'M11223344C',
                'sector'       => UserSector::Automotive,
                'phone'        => '+355 69 200 1003',
                'address'      => 'Rruga e Kavajës 210',
                'city'         => 'Tiranë',
            ],
            [
                'name'         => 'Entela Skënderi',
                'email'        => 'entela@agrofresh.al',
                'company_name' => 'AgroFresh Albania sh.p.k.',
                'nipt'         => 'N99887766D',
                'sector'       => UserSector::FoodBeverage,
                'phone'        => '+355 69 200 1004',
                'address'      => 'Zona Industriale, Lot 7',
                'city'         => 'Shkodër',
            ],
            [
                'name'         => 'Liridon Berisha',
                'email'        => 'liridon@voltbattery.al',
                'company_name' => 'Volt Battery Solutions sh.p.k.',
                'nipt'         => 'O55443322E',
                'sector'       => UserSector::Batteries,
                'phone'        => '+355 69 200 1005',
                'address'      => 'Rruga Myslym Shyri 88',
                'city'         => 'Tiranë',
            ],
            [
                'name'         => 'Blerina Tafa',
                'email'        => 'blerina@oleolub.al',
                'company_name' => 'OleoLub Albania sh.a.',
                'nipt'         => 'P33221100F',
                'sector'       => UserSector::Lubricants,
                'phone'        => '+355 69 200 1006',
                'address'      => 'Porti Detar, Seksioni B',
                'city'         => 'Vlorë',
            ],
        ];

        foreach ($producers as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    ...$data,
                    'sector'             => $data['sector'],
                    'password'           => Hash::make('password'),
                    'email_verified_at'  => now(),
                    'is_active'          => true,
                ]
            );
            $user->syncRoles([UserRole::Producer->value]);
        }

        // ─── RECYCLERS ────────────────────────────────────────────────────────

        $recyclers = [
            [
                'user' => [
                    'name'         => 'Gjergj Marku',
                    'email'        => 'gjergj@ecorecycle.al',
                    'company_name' => 'EcoRecycle Albania sh.p.k.',
                    'nipt'         => 'Q12312300G',
                    'sector'       => UserSector::Packaging,
                    'phone'        => '+355 69 200 2001',
                    'address'      => 'Zona Industriale Kashar',
                    'city'         => 'Tiranë',
                ],
                'listing' => [
                    'capacity_kg'        => 500000,
                    'material_types'     => [MaterialCategory::Packaging->value, MaterialCategory::Other->value],
                    'location'           => 'Kashar, Tiranë',
                    'license_number'     => 'LIC-REC-2024-001',
                    'license_expires_at' => '2027-12-31',
                    'description'        => 'Specialized in plastic and cardboard packaging recycling. ISO 14001 certified facility with 5000 m² processing area.',
                    'active'             => true,
                ],
            ],
            [
                'user' => [
                    'name'         => 'Anila Dema',
                    'email'        => 'anila@greentech-al.al',
                    'company_name' => 'GreenTech Recycling sh.a.',
                    'nipt'         => 'R45678900H',
                    'sector'       => UserSector::Electronics,
                    'phone'        => '+355 69 200 2002',
                    'address'      => 'Rruga Industriale 5',
                    'city'         => 'Durrës',
                ],
                'listing' => [
                    'capacity_kg'        => 200000,
                    'material_types'     => [MaterialCategory::Electronics->value, MaterialCategory::Batteries->value],
                    'location'           => 'Durrës',
                    'license_number'     => 'LIC-REC-2024-002',
                    'license_expires_at' => '2026-06-30',
                    'description'        => 'WEEE and battery recycling specialists. Authorised by Ministry of Environment for e-waste processing.',
                    'active'             => true,
                ],
            ],
            [
                'user' => [
                    'name'         => 'Sokol Myftari',
                    'email'        => 'sokol@autoscrap.al',
                    'company_name' => 'AutoScrap Albania sh.p.k.',
                    'nipt'         => 'S99001122I',
                    'sector'       => UserSector::Automotive,
                    'phone'        => '+355 69 200 2003',
                    'address'      => 'Zona e Lirë, Blloku B',
                    'city'         => 'Fier',
                ],
                'listing' => [
                    'capacity_kg'        => 1000000,
                    'material_types'     => [MaterialCategory::Automotive->value, MaterialCategory::Lubricants->value],
                    'location'           => 'Fier',
                    'license_number'     => 'LIC-REC-2024-003',
                    'license_expires_at' => '2028-03-15',
                    'description'        => 'End-of-life vehicle processing and automotive parts recycling. Licensed for lubricant and oil waste treatment.',
                    'active'             => true,
                ],
            ],
        ];

        foreach ($recyclers as $entry) {
            $user = User::firstOrCreate(
                ['email' => $entry['user']['email']],
                [
                    ...$entry['user'],
                    'password'          => Hash::make('password'),
                    'email_verified_at' => now(),
                    'is_active'         => true,
                ]
            );
            $user->syncRoles([UserRole::Recycler->value]);

            // Create listing if not already present
            if (!$user->recyclerListing) {
                $user->recyclerListing()->create($entry['listing']);
            }
        }

        // ─── SHPZP (PROs) ─────────────────────────────────────────────────────

        $shpzps = [
            [
                'name'         => 'Raimonda Koci',
                'email'        => 'raimonda@paketa.al',
                'company_name' => 'PAKETA sh.p.k. — PRO',
                'nipt'         => 'T11223300J',
                'sector'       => UserSector::Packaging,
                'phone'        => '+355 69 200 3001',
                'address'      => 'Bulevardi Dëshmorët e Kombit 1',
                'city'         => 'Tiranë',
            ],
            [
                'name'         => 'Erind Pojani',
                'email'        => 'erind@ecoresponsabilitet.al',
                'company_name' => 'EkoResponsabilitet Albania sh.a.',
                'nipt'         => 'U44332211K',
                'sector'       => UserSector::Electronics,
                'phone'        => '+355 69 200 3002',
                'address'      => 'Rruga Sami Frashëri 32',
                'city'         => 'Tiranë',
            ],
        ];

        foreach ($shpzps as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    ...$data,
                    'password'          => Hash::make('password'),
                    'email_verified_at' => now(),
                    'is_active'         => true,
                ]
            );
            $user->syncRoles([UserRole::Shpzp->value]);
        }

        // ─── INSTITUTIONS ─────────────────────────────────────────────────────

        $institutions = [
            [
                'name'         => 'Elsa Gjonaj',
                'email'        => 'elsa@mjedisi.gov.al',
                'company_name' => 'Ministria e Mjedisit dhe Turizmit',
                'nipt'         => 'V00112233L',
                'sector'       => null,
                'phone'        => '+355 4 222 7800',
                'address'      => 'Bulevardi Dëshmorët e Kombit',
                'city'         => 'Tiranë',
            ],
            [
                'name'         => 'Klement Braçe',
                'email'        => 'klement@inspeksionimi.gov.al',
                'company_name' => 'Inspektorati Kombëtar i Mjedisit',
                'nipt'         => 'W33445500M',
                'sector'       => null,
                'phone'        => '+355 4 222 5500',
                'address'      => 'Rruga Muhamet Gjollesha 56',
                'city'         => 'Tiranë',
            ],
        ];

        foreach ($institutions as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    ...$data,
                    'password'          => Hash::make('password'),
                    'email_verified_at' => now(),
                    'is_active'         => true,
                ]
            );
            $user->syncRoles([UserRole::Institution->value]);
        }

        $this->command->info('✓ Company users seeded (6 producers, 3 recyclers, 2 SHPZP, 2 institutions)');
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['super-admin', 'admin@ecotrack.al',              'password'],
                ['producer',    'arben@albpack.al',               'password'],
                ['producer',    'mirela@balkanelektrik.al',       'password'],
                ['producer',    'fatos@adriaauto.al',             'password'],
                ['producer',    'entela@agrofresh.al',            'password'],
                ['producer',    'liridon@voltbattery.al',         'password'],
                ['producer',    'blerina@oleolub.al',             'password'],
                ['recycler',    'gjergj@ecorecycle.al',           'password'],
                ['recycler',    'anila@greentech-al.al',          'password'],
                ['recycler',    'sokol@autoscrap.al',             'password'],
                ['shpzp',       'raimonda@paketa.al',             'password'],
                ['shpzp',       'erind@ecoresponsabilitet.al',    'password'],
                ['institution', 'elsa@mjedisi.gov.al',            'password'],
                ['institution', 'klement@inspeksionimi.gov.al',   'password'],
            ]
        );
    }
}
