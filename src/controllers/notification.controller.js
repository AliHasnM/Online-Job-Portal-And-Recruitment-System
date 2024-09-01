import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Controller to Create Notification (Complete)
const createNotification = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { employerId } = req.params;

  // console.log("req.io in createNotification:", req.io); // Check if io is attached

  if (!req.io) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Socket.io not initialized"));
  }

  const notification = await Notification.create({ employerId, content });

  req.io.emit("notification", notification);

  return res
    .status(201)
    .json(
      new ApiResponse(201, notification, "Notification created successfully"),
    );
});

const getNotifications = asyncHandler(async (req, res) => {
  const { employerId } = req.params;

  const notifications = await Notification.find({ employerId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, notifications, "Notifications fetched successfully"),
    );
});

export { createNotification, getNotifications };
