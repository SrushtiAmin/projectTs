import { Request, Response } from "express";
import * as urlService from "../services/urlService";

export async function shortenUrl(req: Request, res: Response) {
    try {
        const result = await urlService.shortenUrl(
            req.body.originalUrl,
            req.body.customAlias,
            req.body.expiresAt
        );
        res.status(201).json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function getAllUrls(req: Request, res: Response) {
    try {
        const urls = await urlService.getAllUrls();
        res.json(urls);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function getUrl(req: Request, res: Response) {
    try {
        const id = req.params.id as string;   
        const result = await urlService.getUrl(id);
        res.json(result);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
}

export async function updateUrlById(req: Request, res: Response) {
    try {
        const id = req.params.id as string;   
        const updated = await urlService.updateUrlById(id, req.body);
        res.json(updated);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function deleteUrlById(req: Request, res: Response) {
    try {
        const id = req.params.id as string;   
        const removed = await urlService.deleteUrlById(id);
        res.json(removed);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}
