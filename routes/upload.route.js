import express from "express";

import upload from "../middlewares/upload.middleware.js";
import {
  uploadProfile,
  deleteProfile,
} from "./../controller/upload.controller.js";

const router = express.Router();

router.post("/profile", upload.single("image"), uploadProfile);
router.delete("/profile", deleteProfile);

export default router;