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
// const verifyEmployerJWT = asyncHandler(async (req, res, next) => {
//   // Extract token from headers
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     throw new ApiError(401, "Access token is required");
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     // Find employer by ID
//     req.employer = await Employer.findById(decoded._id);

//     if (!req.employer) {
//       throw new ApiError(404, "Employer not found");
//     }

//     next();
//   } catch (err) {
//     throw new ApiError(401, err?.message, "Invalid or expired token");
//   }
// });

// Middleware to verify JWT for JobSeeker

const verifyJobSeekerJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const jobSeeker = await JobSeeker.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!jobSeeker) {
      // TODO: discuss about for frontend
      throw new ApiError(401, "Invalid Access Token");
    }

    req.jobSeeker = jobSeeker;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
// const verifyJobSeekerJWT = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     throw new ApiError(401, "Access token is required");
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.jobSeeker = await JobSeeker.findById(decoded._id);
//     if (!req.jobSeeker) {
//       throw new ApiError(404, "Job seeker not found");
//     }
//     next();
//   } catch (err) {
//     throw new ApiError(401, err?.message, "Invalid or expired token");
//   }
// };

export { verifyEmployerJWT, verifyJobSeekerJWT };
