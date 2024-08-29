import { Application } from "../models/application.model.js";
import { JobPosting } from "../models/jobPosting.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Controller to Search Jobs (Complete)
const searchJobs = asyncHandler(async (req, res) => {
  const searchCriteria = req.query; // Assume search criteria come from query params

  const jobs = await JobPosting.find({ ...searchCriteria });

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Jobs retrieved successfully"));
});

// Controller to Get Job Details (Complete)
const getJobDetails = asyncHandler(async (req, res) => {
  const { jobPostingId } = req.params;

  const job = await JobPosting.findById(jobPostingId);

  if (!job) {
    return res.status(404).json(new ApiResponse(404, {}, "Job not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job details retrieved successfully"));
});

// Controller to Apply for a Job (Complete)
const applyForJob = asyncHandler(async (req, res) => {
  const { jobPostingId } = req.params;
  const jobSeekerId = req.jobSeeker._id;

  // Check if the job posting exists
  const jobPosting = await JobPosting.findById(jobPostingId);

  if (!jobPosting) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Job posting not found"));
  }

  // Check if the application already exists
  const existingApplication = await Application.findOne({
    jobPosting: jobPostingId,
    jobSeeker: jobSeekerId,
  });

  if (existingApplication) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Already applied for this job"));
  }

  // Create a new application
  const application = new Application({
    jobPosting: jobPostingId,
    jobSeeker: jobSeekerId,
    status: "Pending",
  });

  await application.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        application,
        "Job application submitted successfully",
      ),
    );
});

// Controller to Get Application Status (Complete)
const getApplicationStatus = asyncHandler(async (req, res) => {
  const { jobPostingId } = req.params;
  const jobSeekerId = req.jobSeeker._id;

  const application = await Application.findOne({
    jobPosting: jobPostingId,
    jobSeeker: jobSeekerId,
  });

  if (!application) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Application not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        application,
        "Application status retrieved successfully",
      ),
    );
});

export { searchJobs, getJobDetails, applyForJob, getApplicationStatus };
