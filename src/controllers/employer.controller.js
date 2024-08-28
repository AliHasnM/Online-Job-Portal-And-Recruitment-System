import { Employer } from "../models/employer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Function to generate access and refresh tokens for a user (Complete)
const generateAccessAndRefreshTokens = async (employerId) => {
  try {
    // Find user by ID
    const employer = await Employer.findById(employerId);

    // Check if the employer exists
    if (!employer) {
      throw new ApiError(404, "Employer not found");
    }

    // Generate access and refresh tokens
    const accessToken = employer.generateAccessToken();
    const refreshToken = employer.generateRefreshToken();

    // Save the refresh token to the user document
    employer.refreshToken = refreshToken;
    await employer.save({ validateBeforeSave: false });

    // Return the generated tokens
    return { accessToken, refreshToken };
  } catch (error) {
    // Log error details to understand the issue better
    console.error("Error generating tokens:", error);

    // Throw an error if something goes wrong
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token",
    );
  }
};

// Controller to register a new employer (Complete)
const registerEmployer = asyncHandler(async (req, res) => {
  const { companyName, email, password, companyProfile } = req.body;

  if (
    [companyName, email, password, companyProfile].some(
      (field) => !field?.trim(),
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingEmployer = await Employer.findOne({
    $or: [{ companyName }, { email }],
  });

  if (existingEmployer) {
    throw new ApiError(400, "Employer already exists");
  }

  const employer = await Employer.create({
    companyName,
    email,
    password,
    companyProfile,
  });

  const createdEmployer = await Employer.findById(employer._id).select(
    "-password -refreshToken",
  );

  if (!createdEmployer) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdEmployer, "Employer registered successfully"),
    );
});

// Controller to login an employer (Complete)
const loginEmployer = asyncHandler(async (req, res) => {
  const { companyName, email, password } = req.body;

  if (!(companyName || email)) {
    throw new ApiError(400, "companyName or email is required");
  }

  // Find user by companyName or email
  const employer = await Employer.findOne({
    $or: [{ companyName }, { email }],
  });

  if (!employer) {
    throw new ApiError(404, "Employer does not exist");
  }

  const isPasswordValid = await employer.isPasswordCorrect(password);

  // If password is incorrect, throw an error
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid employer credentials");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    employer._id,
  );

  const loggedInEmployer = await Employer.findById(employer._id).select(
    "-password -refreshToken",
  );

  // Options for the cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { employer: loggedInEmployer, accessToken, refreshToken },
        "Employer logged In Successfully",
      ),
    );
});

// Controller to logout an employer (Complete)
const logoutEmployer = asyncHandler(async (req, res) => {
  // Clear the refresh token of the user
  await Employer.findByIdAndUpdate(
    req.employer._id,
    { $set: { refreshToken: undefined } },
    { new: true },
  );

  // Options for the cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Send a response indicating the employer has logged out
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Employer logged Out"));
});

// Controller to Update Employer Profile (Complete)
const updateEmployerProfile = asyncHandler(async (req, res) => {
  const { companyName, companyProfile, email } = req.body;

  // If fullName or email is missing, throw an error
  if (!companyName || !email) {
    throw new ApiError(400, "All fileds are required");
  }

  // Find the user by their ID and update their details
  const employer = await Employer.findByIdAndUpdate(
    req.employer?._id,
    {
      $set: {
        companyName: companyName,
        companyProfile: companyProfile,
        email: email,
      },
    },
    { new: true },
  ).select("-password");

  // Return a success response with the updated user details
  return res
    .status(200)
    .json(
      new ApiResponse(200, employer, "Employer Profile Update Successfully"),
    );
});

// Controller to Get Employer Profile (Complete)
const getEmployerProfile = asyncHandler(async (req, res) => {
  // Return the current user's details
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        req.employer,
        "Employer Profile Fetched Successfully",
      ),
    );
});

const getApplications = asyncHandler(async (req, res) => {
  const { jobPostingId } = req.params;

  // Find job posting and get job seekers who applied
  const employer = await Employer.findOne({
    jobPostings: jobPostingId,
  }).populate({
    path: "jobPostings",
    match: { _id: jobPostingId },
    populate: { path: "applications", model: "JobSeeker" },
  });

  if (!employer) {
    throw new ApiError(404, "Job posting not found or no applications");
  }

  const jobPosting = employer.jobPostings[0];
  const applications = jobPosting.applications;

  return res
    .status(200)
    .json(
      new ApiResponse(200, applications, "Applications fetched successfully"),
    );
});

// Controller to view a specific job seeker's details
const getJobSeekerDetails = asyncHandler(async (req, res) => {
  const { jobSeekerId } = req.params;

  const jobSeeker = await JobSeeker.findById(jobSeekerId);
  if (!jobSeeker) {
    throw new ApiError(404, "Job seeker not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        jobSeeker,
        "Job seeker details fetched successfully",
      ),
    );
});

// Controller to update job seeker status for a job posting
const updateJobSeekerStatus = asyncHandler(async (req, res) => {
  const { jobPostingId, jobSeekerId } = req.params;
  const { status } = req.body; // e.g., "Accepted", "Rejected"

  // Find job posting
  const employer = await Employer.findOne({
    jobPostings: jobPostingId,
  }).populate({
    path: "jobPostings",
    match: { _id: jobPostingId },
    populate: { path: "applications", model: "JobSeeker" },
  });

  if (!employer) {
    throw new ApiError(404, "Job posting not found");
  }

  const jobPosting = employer.jobPostings[0];
  const jobSeekerIndex = jobPosting.applications.findIndex(
    (js) => js._id.toString() === jobSeekerId,
  );

  if (jobSeekerIndex === -1) {
    throw new ApiError(404, "Job seeker not found in this job posting");
  }

  // Update status (you might want to add more logic here depending on your schema)
  jobPosting.applications[jobSeekerIndex].status = status;

  await jobPosting.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        jobPosting,
        "Job seeker status updated successfully",
      ),
    );
});

// Controller to post a new job
const postJob = asyncHandler(async (req, res) => {
  const { title, description, requirements, location, salary } = req.body;
  const employerId = req.user._id; // Assuming req.user is populated by the auth middleware

  if (!(title || description || requirements || location || salary)) {
    throw new ApiError(400, "All fields are required");
  }

  // Create a new job posting
  const jobPosting = await JobPosting.create({
    title,
    description,
    requirements,
    location,
    salary,
    employer: employerId,
  });

  // Add the job posting to the employer's list
  await Employer.findByIdAndUpdate(employerId, {
    $push: { jobPostings: jobPosting._id },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, jobPosting, "Job posted successfully"));
});

// Controller to Refresh Access Token (Complete)
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get the refresh token from cookies or request body
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // If no refresh token is provided, throw an error
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    // Verify the incoming refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    // Find the user by the ID in the decoded token
    const employer = await Employer.findById(decodedToken?._id);

    // If user is not found, throw an error
    if (!employer) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    // If the refresh token does not match the user's refresh token, throw an error
    if (incomingRefreshToken !== employer?.refreshToken) {
      throw new ApiError(401, "Refresh Token is Expired or Used");
    }

    // Options for the cookies
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Generate new access and refresh tokens
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(employer._id);

    // Send the new tokens in the response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed",
        ),
      );
  } catch (error) {
    // Throw an error if the refresh token is invalid
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

// Controller to Change Password (Complete)
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Find the user by their ID
  const employer = await Employer.findById(req.employer?._id);
  // Check if the old password is correct
  const isPasswordCorrect = await employer.isPasswordCorrect(oldPassword);

  // If the old password is incorrect, throw an error
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }

  // Set the new password
  employer.password = newPassword;
  // Save the user without validating the password before save
  await employer.save({ ValiditeBeforeSave: false });

  // Return a success response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Change Successfully"));
});

// Exporting all controller functions
export {
  registerEmployer,
  loginEmployer,
  logoutEmployer,
  updateEmployerProfile,
  getEmployerProfile,
  getApplications,
  updateJobSeekerStatus,
  getJobSeekerDetails,
  postJob,
  refreshAccessToken,
  changeCurrentPassword,
};
