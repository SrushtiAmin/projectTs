import { Request, Response } from "express";
import * as urlService from "../services/urlService";

export async function shortenUrl(req: Request, res: Response) {
    try {
        const { originalUrl, customAlias, expiresAt } = req.body;
        const url = await urlService.shortenUrl(originalUrl, customAlias, expiresAt);
        res.status(201).json(url);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function getAllUrls(req: Request, res: Response) {
    const urls = await urlService.getAllUrls();
    res.json(urls);
}
