// middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Employer } from "../models/employer.model.js"; // Import Employer model
import { JobSeeker } from "../models/jobSeeker.model.js"; // Import JobSeeker model

// Middleware to verify JWT for Employer
const verifyEmployerJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const employer = await Employer.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!employer) {
      // TODO: discuss about for frontend
      throw new ApiError(401, "Invalid Access Token");
    }

    req.employer = employer;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

// Middleware to verify JWT for JobSeeker
const verifyJobSeekerJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || // Check if token is in cookies
      req.header("Authorization")?.replace("Bearer ", ""); // Check if token is in the Authorization header

    if (!token) {
      throw new ApiError(401, "Unauthorized Request: Token missing");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const jobSeeker = await JobSeeker.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!jobSeeker) {
      throw new ApiError(401, "Invalid Access Token: Job Seeker not found");
    }

    req.jobSeeker = jobSeeker;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export { verifyEmployerJWT, verifyJobSeekerJWT };
