import { JobSeeker } from "../models/jobSeeker.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Function to generate access and refresh tokens for a job seeker (Complete)
const generateAccessAndRefreshTokens = async (jobSeekerId) => {
  try {
    // Find job seeker by ID
    const jobSeeker = await JobSeeker.findById(jobSeekerId);

    // Check if the job seeker exists
    if (!jobSeeker) {
      throw new ApiError(404, "Job Seeker not found");
    }

    // Generate access and refresh tokens
    const accessToken = jobSeeker.generateAccessToken();
    const refreshToken = jobSeeker.generateRefreshToken();

    // Save the refresh token to the job seeker document
    jobSeeker.refreshToken = refreshToken;
    await jobSeeker.save({ validateBeforeSave: false });

    // Return the generated tokens
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token",
    );
  }
};

// Controller to register a new job seeker (Complete)
const registerJobSeeker = asyncHandler(async (req, res) => {
  const { fullName, email, password, skills } = req.body;

  // Validate that all required fields are provided
  if ([fullName, email, password, skills].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if a job seeker with the same email already exists
  const existingJobSeeker = await JobSeeker.findOne({ email });

  // If a job seeker already exists, throw an error
  if (existingJobSeeker) {
    throw new ApiError(400, "Job Seeker already exists");
  }

  // Initialize the resume URL
  let resumeUrl;

  // Check if the resume file is provided
  if (req.file) {
    try {
      // Upload resume to Cloudinary
      const result = await uploadOnCloudinary(req.file.path);
      // Set resume URL from Cloudinary response
      resumeUrl = result?.secure_url;
    } catch (error) {
      throw new ApiError(500, "Failed to upload resume to Cloudinary");
    }
  } else {
    throw new ApiError(400, "Resume is required");
  }

  // Create a new job seeker with the provided data and uploaded resume URL
  const jobSeeker = await JobSeeker.create({
    fullName,
    email,
    password,
    resume: resumeUrl,
    skills,
  });

  // Retrieve the created job seeker without the password and refreshToken fields
  const createdJobSeeker = await JobSeeker.findById(jobSeeker._id).select(
    "-password -refreshToken",
  );

  // If the job seeker creation fails, throw an error
  if (!createdJobSeeker) {
    throw new ApiError(
      500,
      "Something went wrong while registering the job seeker",
    );
  }

  // Send a success response with the created job seeker data
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdJobSeeker,
        "Job Seeker registered successfully",
      ),
    );
});

// Controller to Login jobSeeker (Complete)
const loginJobSeeker = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const jobSeeker = await JobSeeker.findOne({ email });

  if (!jobSeeker) {
    throw new ApiError(404, "Job Seeker does not exist");
  }

  const isPasswordValid = await jobSeeker.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid job seeker credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    jobSeeker._id,
  );

  const loggedInJobSeeker = await JobSeeker.findById(jobSeeker._id).select(
    "-password -refreshToken",
  );

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
        { jobSeeker: loggedInJobSeeker, accessToken, refreshToken },
        "Job Seeker logged In Successfully",
      ),
    );
});

// Controller to logout a job seeker (Complete)
const logoutJobSeeker = asyncHandler(async (req, res) => {
  await JobSeeker.findByIdAndUpdate(
    req.jobSeeker._id,
    { $set: { refreshToken: undefined } },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Job Seeker logged Out"));
});

// Controller to Update Job Seeker Profile (Complete)
const updateJobSeekerProfile = asyncHandler(async (req, res) => {
  const { fullName, email, skills } = req.body;
  let resume = req.jobSeeker.resume;

  if (!fullName || !email) {
    throw new ApiError(400, "Full Name and Email are required");
  }

  if (req.file) {
    const result = await uploadOnCloudinary(req.file.path);
    resume = result?.secure_url;
  }

  const jobSeeker = await JobSeeker.findByIdAndUpdate(
    req.jobSeeker._id,
    {
      $set: { fullName, email, resume, skills },
    },
    { new: true },
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        jobSeeker,
        "Job Seeker Profile Updated Successfully",
      ),
    );
});

// Controller to Get Job Seeker Profile (Complete)
const getJobSeekerProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        req.jobSeeker,
        "Job Seeker Profile Fetched Successfully",
      ),
    );
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
    const jobSeeker = await JobSeeker.findById(decodedToken?._id);

    // If user is not found, throw an error
    if (!jobSeeker) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    // If the refresh token does not match the user's refresh token, throw an error
    if (incomingRefreshToken !== jobSeeker?.refreshToken) {
      throw new ApiError(401, "Refresh Token is Expired or Used");
    }

    // Options for the cookies
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Generate new access and refresh tokens
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(jobSeeker._id);

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

// Controller to change Job Seeker's password (Complete)
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Check if both old and new passwords are provided
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old and new passwords are required");
  }

  // Find the Job Seeker by their ID
  const jobSeeker = await JobSeeker.findById(req.jobSeeker?._id);

  if (!jobSeeker) {
    throw new ApiError(404, "Job Seeker not found");
  }

  // Check if the old password is correct
  const isPasswordCorrect = await jobSeeker.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }

  // Set the new password
  jobSeeker.password = newPassword;

  // Save the Job Seeker without validating the password before saving
  await jobSeeker.save({ validateBeforeSave: false });

  // Return a success response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

// Export all controller functions
export {
  registerJobSeeker,
  loginJobSeeker,
  logoutJobSeeker,
  updateJobSeekerProfile,
  getJobSeekerProfile,
  refreshAccessToken,
  changeCurrentPassword,
};
