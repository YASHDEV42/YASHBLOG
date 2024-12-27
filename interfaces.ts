export interface UserMetadata {
  name: string;
  email: string;
}

export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: UserMetadata;
  // Add other fields as needed, such as `role`, `aud`, etc.
}
