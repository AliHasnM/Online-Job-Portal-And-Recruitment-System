// routes/jobSeeker.routes.js

import { Router } from "express";
import {
  registerJobSeeker,
  loginJobSeeker,
  getJobSeekerProfile,
  updateJobSeekerProfile,
  logoutJobSeeker,
  refreshAccessToken,
  changeCurrentPassword,
} from "../controllers/jobSeeker.controller.js";
import { verifyJobSeekerJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Routes for job seekers
// Register route with single file upload middleware
router.route("/register").post(upload.single("resume"), registerJobSeeker);

// Login route
router.route("/login").post(loginJobSeeker);

// Apply verifyJobSeekerJWT middleware to routes that require authentication
router.use(verifyJobSeekerJWT);

// Profile routes with single file upload middleware for profile updates
router
  .route("/profile")
  .get(getJobSeekerProfile) // Get job seeker profile
  .patch(upload.single("resume"), updateJobSeekerProfile); // Update job seeker profile

router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(changeCurrentPassword);

router.route("/logout").post(logoutJobSeeker);

export default router;
