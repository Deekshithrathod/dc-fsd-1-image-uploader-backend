import express from "express";
import { getPhoto, addPhoto } from "../controllers/photo";

const router = express.Router();

router.get("/:id", getPhoto);
router.post("/", addPhoto);

export default router;
