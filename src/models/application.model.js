// models/application.model.js

import mongoose, { Schema } from "mongoose";

// Creating the application schema
const applicationSchema = new Schema(
  {
    jobPosting: {
      type: Schema.Types.ObjectId,
      ref: "JobPosting",
      required: true,
    },
    jobSeeker: {
      type: Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

// Exporting the Application model
export const Application = mongoose.model("Application", applicationSchema);
