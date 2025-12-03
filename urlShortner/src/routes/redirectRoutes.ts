import { Router, Request, Response } from "express";
import * as urlService from "../services/urlService";

const router = Router();

router.get("/:shortId", async (req: Request, res: Response) => {
    try {
        const shortId = req.params.shortId as string;  
        const original = await urlService.handleRedirect(shortId);
        res.redirect(original);
    } catch (err: any) {
        res.status(404).send(err.message);
    }
});

export default router;
