// routes/notification.routes.js

import { Router } from "express";
import {
  getNotifications,
  createNotification,
} from "../controllers/notification.controller.js";
import { verifyEmployerJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply JWT verification middleware
router.use(verifyEmployerJWT);

// Create a notification for a specific employer
router.route("/:employerId").post(createNotification);

// Get notifications for a specific employer
router.route("/:employerId").get(getNotifications);

export default router;
