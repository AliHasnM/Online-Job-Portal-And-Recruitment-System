import express from "express";
import {
  applyForJob,
  getApplicationStatus,
  searchJobs,
  getJobDetails,
} from "../controllers/application.controller.js";
import { verifyJobSeekerJWT } from "../middlewares/auth.middleware.js"; // Make sure this middleware path is correct

const router = express.Router();

// Route to search jobs
router.get("/search", searchJobs);

// Route to get job details
router.get("/details/:jobPostingId", getJobDetails);

// Route to apply for a job
router.post("/apply/:jobPostingId", verifyJobSeekerJWT, applyForJob);

// Route to get application status
router.get("/status/:jobPostingId", verifyJobSeekerJWT, getApplicationStatus);

// Additional routes can be added here as needed

export default router;
