import { readDB, writeDB } from "../utils/fileHandler";
import { generateAlias } from "../utils/generateAlias";

const BASE_URL = "http://localhost:5000";

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export async function shortenUrl(originalUrl: string, customAlias?: string, expiresAt?: string) {
    if (!originalUrl.trim()) throw new Error("Original URL is required.");
    if (!isValidUrl(originalUrl)) throw new Error("Invalid URL format.");

    const db = await readDB();

    const alias = customAlias || generateAlias();

    if (db.find((u: any) => u.id === alias)) {
        throw new Error("Alias already exists.");
    }

    const newEntry = {
        id: alias,
        originalUrl,
        shortUrl: `${BASE_URL}/${alias}`,
        clicks: 0,
        isActive: true,
        expiresAt: expiresAt || null,
        createdAt: new Date().toISOString()
    };

    db.push(newEntry);
    await writeDB(db);

    return newEntry;
}

export async function getAllUrls() {
    return await readDB();
}

export async function getUrl(id: string) {
    const db = await readDB();
    const found = db.find((u: any) => u.id === id);
    if (!found) throw new Error("URL not found.");
    return found;
}

export async function updateUrlById(id: string, updates: any) {
    const db = await readDB();
    const index = db.findIndex((u: any) => u.id === id);

    if (index === -1) throw new Error("URL not found.");

    if (updates.originalUrl && !isValidUrl(updates.originalUrl)) {
        throw new Error("Invalid updated URL.");
    }

    db[index] = {
        ...db[index],
        ...updates
    };

    await writeDB(db);
    return db[index];
}

export async function deleteUrlById(id: string) {
    const db = await readDB();
    const index = db.findIndex((u: any) => u.id === id);

    if (index === -1) throw new Error("URL not found.");

    const removed = db.splice(index, 1)[0];
    await writeDB(db);

    return removed;
}

export async function handleRedirect(id: string) {
    const db = await readDB();
    const entry = db.find((u: any) => u.id === id);

    if (!entry) throw new Error("URL not found.");
    if (!entry.isActive) throw new Error("URL inactive.");

    // check expiry
    if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) {
        throw new Error("URL expired.");
    }

    entry.clicks++;
    await writeDB(db);

    return entry.originalUrl;
}
