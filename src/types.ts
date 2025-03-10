import { type User as SupabaseUser } from '@supabase/supabase-js';
import { UUID } from '@/server/database/schema';

export interface UserMetadata {
    /* Default Metadatas */
    email?: string;
    email_verified?: boolean;
    phone_verified?: false;
    sub?: string;

    /* Custom Metadatas */
    user_name: string;
    avatar_file_path?: string;
    banner_file_path?: string;
}

export interface AdminUserMetadata extends UserMetadata {
    is_admin: null | true;
}

export type Booleanish = "true" | "false";
export const IsBooleanish = (x: any): Boolean => {
    const value = String(x);
    return typeof value === "string" && (value === "true" || value === "True" || value === "false" || value === "False");
};


export interface User extends Omit<Omit<SupabaseUser, "user_metadata">, "id"> {
    id: UUID;
    user_metadata: UserMetadata;
}

export type GetUserResponse = { data: { user: User | null; }; };
