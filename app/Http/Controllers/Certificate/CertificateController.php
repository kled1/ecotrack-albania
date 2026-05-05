<?php

namespace App\Http\Controllers\Certificate;

use App\Http\Controllers\Controller;
use App\Models\RecyclingCertificate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = RecyclingCertificate::latest('issued_at');

        if ($user->isProducer()) {
            $query->where('producer_id', $user->id)->with('recycler:id,name,company_name');
        } elseif ($user->isRecycler()) {
            $query->where('recycler_id', $user->id)->with('producer:id,name,company_name');
        } else {
            $query->with(['producer:id,name,company_name', 'recycler:id,name,company_name']);
        }

        $certificates = $query->paginate(15)->through(fn ($cert) => [
            'id'                 => $cert->id,
            'certificate_number' => $cert->certificate_number,
            'quantity_kg'        => $cert->quantity_kg,
            'material_type'      => $cert->material_type,
            'issued_at'          => $cert->issued_at->toDateString(),
            'producer'           => $cert->producer ? [
                'id'           => $cert->producer->id,
                'name'         => $cert->producer->name,
                'company_name' => $cert->producer->company_name,
            ] : null,
            'recycler'           => $cert->recycler ? [
                'id'           => $cert->recycler->id,
                'name'         => $cert->recycler->name,
                'company_name' => $cert->recycler->company_name,
            ] : null,
        ]);

        $totalCredits = $user->isProducer()
            ? (float) $user->recyclingCredits()->sum('credits')
            : null;

        return Inertia::render('Certificates/Index', [
            'certificates' => $certificates,
            'totalCredits' => $totalCredits,
            'role'         => $user->getPrimaryRole(),
        ]);
    }
}
