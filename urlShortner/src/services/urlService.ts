import { readDB, writeDB } from "../utils/fileHandler";
import { randomBytes } from "crypto";

// Validate URL format
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Auto-generate alias (6 characters)
function generateAlias() {
    return randomBytes(3).toString("hex");
}

// MAIN SERVICE: Shorten URL
export async function shortenUrl(
    originalUrl: string,
    customAlias?: string,
    expiresAt?: string
) {
    if (!originalUrl || !originalUrl.trim()) {
        throw new Error("Original URL is required.");
    }

    if (!isValidUrl(originalUrl)) {
        throw new Error("Invalid URL format.");
    }

    const db = await readDB();

    // Check if custom alias already exists
    if (customAlias) {
        const exists = db.find((u: any) => u.id === customAlias);
        if (exists) {
            throw new Error("Custom alias already exists.");
        }
    }

    const alias = customAlias || generateAlias();
    const now = new Date().toISOString();

    const shortUrl = `http://localhost:5000/${alias}`;

    const newEntry = {
        id: alias,
        originalUrl,
        shortUrl,
        clicks: 0,
        isActive: true,
        expiresAt: expiresAt || null,
        createdAt: now
    };

    db.push(newEntry);
    await writeDB(db);

    return newEntry;
}

// Get all stored URLs
export async function getAllUrls() {
    const db = await readDB();
    return db;
}
