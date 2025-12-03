import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "src/db/urls.json");

async function ensureDBFile() {
    try {
        await fs.access(dbPath);
    } catch {
        await fs.writeFile(dbPath, "[]", "utf-8");
    }
}

export async function readDB(): Promise<any[]> {
    await ensureDBFile();
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
}

export async function writeDB(data: any[]): Promise<void> {
    await ensureDBFile();
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}
