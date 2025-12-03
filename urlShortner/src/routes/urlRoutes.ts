import { Router } from "express";
import * as urlController from "../controllers/urlController";

const router = Router();

router.post("/shorten", urlController.shortenUrl);
router.get("/urls", urlController.getAllUrls);

export default router;
