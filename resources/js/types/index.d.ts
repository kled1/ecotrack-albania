export interface User {
    id: number;
    name: string;
    email: string;
    company_name?: string;
    nipt?: string;
    sector?: string;
    role?: string;
    is_active?: boolean;
    city?: string;
    created_at?: string;
    permissions?: string[];
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success?: string;
        error?: string;
    };
};

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface Report {
    id: number;
    period_label: string;
    period_type: 'quarterly' | 'annual';
    period_year: number;
    period_quarter?: number;
    material_category: string;
    quantity_kg: number;
    status: 'draft' | 'submitted' | 'verified' | 'rejected';
    notes?: string;
    submitted_at?: string;
    created_at: string;
    user?: Pick<User, 'id' | 'name' | 'company_name' | 'nipt'>;
}

export interface RecyclerListing {
    id: number;
    user_id: number;
    capacity_kg: number;
    material_types: string[];
    location: string;
    license_number: string;
    license_expires_at?: string;
    description?: string;
    active: boolean;
    pending_requests?: number;
    active_collaborations?: number;
    user?: Pick<User, 'id' | 'name' | 'company_name' | 'city'>;
}

export interface CollaborationRequest {
    id: number;
    producer_id: number;
    recycler_id: number;
    recycler_listing_id?: number;
    status: string;
    material_type: string;
    quantity_kg: number;
    notes?: string;
    accepted_at?: string;
    completed_at?: string;
    created_at: string;
    producer?: Pick<User, 'id' | 'name' | 'company_name'>;
    recycler?: Pick<User, 'id' | 'name' | 'company_name'>;
    recyclerListing?: Pick<RecyclerListing, 'id' | 'location' | 'license_number'>;
    wasteBatches?: WasteBatch[];
}

export interface WasteBatch {
    id: number;
    batch_code: string;
    collaboration_id: number;
    material_type: string;
    quantity_kg: number;
    origin_date: string;
    current_status: string;
    notes?: string;
    created_at: string;
    collaboration?: Partial<CollaborationRequest>;
    events?: WasteBatchEvent[];
}

export interface WasteBatchEvent {
    id: number;
    waste_batch_id: number;
    status: string;
    actor_id: number;
    notes?: string;
    created_at: string;
}

export interface RecyclingCertificate {
    id: number;
    certificate_number: string;
    waste_batch_id: number;
    producer_id: number;
    recycler_id: number;
    quantity_kg: number;
    material_type: string;
    pdf_path?: string;
    issued_at: string;
    producer?: Pick<User, 'id' | 'name' | 'company_name'>;
    recycler?: Pick<User, 'id' | 'name' | 'company_name'>;
}

export interface Material {
    value: string;
    label: string;
}
