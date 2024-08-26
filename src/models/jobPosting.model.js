import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Defining the schema for the job posting collection
const jobPostingSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salaryRange: {
      type: String, // e.g., "$50,000 - $60,000"
      required: true,
    },
    employmentType: {
      type: String, // e.g., "Full-time", "Part-time", "Contract"
      required: true,
    },
    jobRequirements: {
      type: [String], // Array of strings, e.g., ["JavaScript", "React", "Node.js"]
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employer", // Reference to the employer who posted the job
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    applicationDeadline: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  },
);

// Applying the pagination plugin to the schema
jobPostingSchema.plugin(mongooseAggregatePaginate);

// Creating and exporting the JobPosting model
export const JobPosting = mongoose.model("JobPosting", jobPostingSchema);
