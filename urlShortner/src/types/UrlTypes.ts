export interface URLData {
    id: string;
    originalUrl: string;
    shortUrl: string;
    isActive: boolean;
    expiresAt: string | null;
    createdAt: string;
}
