// models/jobPosting.model.js

import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Creating the job posting schema
const jobPostingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    applications: [
      {
        type: Schema.Types.ObjectId,
        ref: "JobSeeker",
      },
    ],
  },
  { timestamps: true },
);

jobPostingSchema.plugin(mongooseAggregatePaginate);

// Exporting the Job Posting model
export const JobPosting = mongoose.model("JobPosting", jobPostingSchema);
