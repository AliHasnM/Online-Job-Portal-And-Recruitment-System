import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import employerRouter from "./routes/employer.routes.js";
import jobSeekerRouter from "./routes/jobSeeker.routes.js";

app.use("/api/v1/employers", employerRouter);
app.use("/api/v1/jobseekers", jobSeekerRouter);
// http://localhost:8000/api/v1/users${differentRoutes}

export { app };
