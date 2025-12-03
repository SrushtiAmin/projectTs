import { Router } from "express";
import {
    shortenUrl,
    getAllUrls,
    getUrl,
    updateUrlById,
    deleteUrlById
} from "../controllers/urlController";

const router = Router();

router.post("/shorten", shortenUrl);
router.get("/urls", getAllUrls);
router.get("/urls/:id", getUrl);
router.put("/urls/:id", updateUrlById);
router.delete("/urls/:id", deleteUrlById);

export default router;
