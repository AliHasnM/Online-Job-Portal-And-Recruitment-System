// middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Employer } from "../models/employer.model.js";
import { JobSeeker } from "../models/jobSeeker.model.js";

const verifyEmployerJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request: Token missing");
    }

    console.log("Received Employer Token:", token); // Debugging line

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken?._id) {
      throw new ApiError(401, "Unauthorized Request: Invalid token structure");
    }

    const employer = await Employer.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    if (!employer) {
      throw new ApiError(401, "Invalid Access Token: Employer not found");
    }

    req.employer = employer;
    next();
  } catch (error) {
    console.error("Error in verifyEmployerJWT:", error);
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
const verifyJobSeekerJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request: Token missing");
    }

    console.log("Received JobSeeker Token:", token); // Debugging line

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken?._id) {
      throw new ApiError(401, "Unauthorized Request: Invalid token structure");
    }

    const jobSeeker = await JobSeeker.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    if (!jobSeeker) {
      throw new ApiError(401, "Invalid Access Token: JobSeeker not found");
    }

    req.jobSeeker = jobSeeker;

    next();
  } catch (error) {
    console.error("Error in verifyJobSeekerJWT:", error);
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export { verifyEmployerJWT, verifyJobSeekerJWT };
