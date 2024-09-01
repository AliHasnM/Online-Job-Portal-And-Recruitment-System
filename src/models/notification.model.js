import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  employerId: {
    type: Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
