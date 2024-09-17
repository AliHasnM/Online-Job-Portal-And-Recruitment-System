import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import employerRouter from "./routes/employer.routes.js";
import JobPostingRouter from "./routes/jobPosting.routes.js";
import jobSeekerRouter from "./routes/jobSeeker.routes.js";
import applicationRouter from "./routes/application.routes.js";
import notificationRouter from "./routes/notification.routes.js";

const app = express();

// Use environment variable for CORS origin if available
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Middleware to attach `io` to each request
app.use((req, res, next) => {
  const io = app.get("io"); // Retrieve `io` from `app`
  req.io = io;
  next();
});

app.use("/api/v1/employers", employerRouter);
app.use("/api/v1/jobposting", JobPostingRouter);
app.use("/api/v1/jobseekers", jobSeekerRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/notifications", notificationRouter);

export default app;
