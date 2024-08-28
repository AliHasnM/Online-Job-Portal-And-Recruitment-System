// controllers/jobPosting.controller.js

import mongoose, { isValidObjectId } from "mongoose";
import { JobPosting } from "../models/jobPosting.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Controller to get all job postings with pagination, search, and sorting (Complete)
const getAllJobPostings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  // Create a filter object based on the query
  const filter = {
    ...(query && { title: { $regex: query, $options: "i" } }),
  };

  // Define sorting order
  const sort = { [sortBy]: sortType === "asc" ? 1 : -1 };

  // Options for pagination
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort,
  };

  // Aggregate job postings with filters and sorting
  const aggregate = JobPosting.aggregate([{ $match: filter }, { $sort: sort }]);

  // Fetch paginated job postings
  const jobPostings = await JobPosting.aggregatePaginate(aggregate, options);

  // Success message and response
  return res
    .status(200)
    .json(
      new ApiResponse(200, jobPostings, "Job postings fetched successfully"),
    );
});

// Controller to create a job posting (Complete)
const createJobPosting = asyncHandler(async (req, res) => {
  const { title, description, requirements, location, salary } = req.body;
  const employer = req.employer._id;

  // Create a new job posting document
  const jobPosting = await JobPosting.create({
    title,
    description,
    requirements,
    location,
    salary,
    employer,
  });

  // Success message and response
  return res
    .status(201)
    .json(new ApiResponse(201, jobPosting, "Job posting created successfully"));
});

// Controller to get a job posting by ID (Complete)
const getJobPostingById = asyncHandler(async (req, res) => {
  const { jobPostingId } = req.params;

  if (!isValidObjectId(jobPostingId)) {
    throw new ApiError(400, "Invalid job posting ID");
  }

  const jobPosting =
    await JobPosting.findById(jobPostingId).populate("employer");

  if (!jobPosting) {
    throw new ApiError(404, "Job posting not found");
  }

  // Success message and response
  return res
    .status(200)
    .json(new ApiResponse(200, jobPosting, "Job posting fetched successfully"));
});

// Controller to update job posting details (Complete)
const updateJobPosting = asyncHandler(async (req, res) => {
  const { jobPostingId } = req.params;
  const { title, description, requirements, location, salary } = req.body;

  if (!isValidObjectId(jobPostingId)) {
    throw new ApiError(400, "Invalid job posting ID");
  }

  const jobPosting = await JobPosting.findById(jobPostingId);

  if (!jobPosting) {
    throw new ApiError(404, "Job posting not found");
  }

  // Update job posting fields if provided
  if (title) jobPosting.title = title;
  if (description) jobPosting.description = description;
  if (requirements) jobPosting.requirements = requirements;
  if (location) jobPosting.location = location;
  if (salary) jobPosting.salary = salary;

  await jobPosting.save();

  // Success message and response
  return res
    .status(200)
    .json(new ApiResponse(200, jobPosting, "Job posting updated successfully"));
});

// Controller to delete a job posting (Complete)
const deleteJobPosting = asyncHandler(async (req, res) => {
  const { jobPostingId } = req.params;

  if (!isValidObjectId(jobPostingId)) {
    throw new ApiError(400, "Invalid job posting ID");
  }

  const jobPosting = await JobPosting.findById(jobPostingId);

  if (!jobPosting) {
    throw new ApiError(404, "Job posting not found");
  }

  // Delete the job posting document
  await jobPosting.deleteOne();

  // Success message and response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Job posting deleted successfully"));
});

// Export all controller functions
export {
  getAllJobPostings,
  createJobPosting,
  getJobPostingById,
  updateJobPosting,
  deleteJobPosting,
};
