// routes/jobPosting.routes.js

import { Router } from "express";
import {
  createJobPosting,
  getAllJobPostings,
  getJobPostingById,
  updateJobPosting,
  deleteJobPosting,
} from "../controllers/jobPosting.controller.js";
import { verifyEmployerJWT } from "../middlewares/auth.middleware.js";
// import { verifyEmployerJWT } from "../middlewares/employer.middleware.js";

const router = Router();

// Apply verifyEmployerJWT middleware to routes that require authentication
router.use(verifyEmployerJWT);

// Routes for job postings
router
  .route("/")
  .post(createJobPosting) // Create a new job posting
  .get(getAllJobPostings); // Get all job postings

router
  .route("/:jobPostingId")
  .get(getJobPostingById) // Get a specific job posting
  .patch(updateJobPosting) // Update a specific job posting
  .delete(deleteJobPosting); // Delete a specific job posting

export default router;
