// routes/employer.routes.js

import { Router } from "express";
import {
  registerEmployer,
  loginEmployer,
  logoutEmployer,
  updateEmployerProfile,
  getEmployerProfile,
  getApplications,
  getJobSeekerDetails,
  updateJobSeekerStatus,
  postJob,
  refreshAccessToken,
  changeCurrentPassword,
} from "../controllers/employer.controller.js";
import { verifyEmployerJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Routes for employers
router.route("/register").post(registerEmployer);
// router.post("/register", registerEmployer); // Register a new employer
router.route("/login").post(loginEmployer);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyEmployerJWT, changeCurrentPassword);

// Apply verifyEmployerJWT middleware to routes that require authentication
router.use(verifyEmployerJWT);

router
  .route("/profile")
  .get(getEmployerProfile) // Get employer profile
  .patch(updateEmployerProfile); // Update employer profile

router.post("/post-job", postJob); // Route for posting a job

// Routes for managing job seeker applications
router.get("/applications/:jobPostingId", getApplications); // Get applications for a specific job posting
router.get("/job-seeker/:jobSeekerId", getJobSeekerDetails); // Get details of a specific job seeker
router.patch(
  "/update-job-seeker-status/:jobPostingId/:jobSeekerId",
  updateJobSeekerStatus,
); // Update job seeker's application status
router.route("/logout").post(verifyEmployerJWT, logoutEmployer);

export default router;
