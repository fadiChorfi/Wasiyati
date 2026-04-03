export type User = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    updated_at: string | null;
    role: "user" | "admin";
};