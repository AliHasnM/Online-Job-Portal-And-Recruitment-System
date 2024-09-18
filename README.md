# **Online Job Portal and Recruitment System (Backend)**

## **Project Overview**

The **Online Job Portal and Recruitment System (Backend)** is designed to handle the server-side logic of an employment platform that connects employers and job seekers. It enables secure user authentication, job postings, application submissions, real-time notifications, and communication between employers and job seekers. The backend is built using **Node.js**, **Express.js**, and **MongoDB with Mongoose**, with secure authentication via JWT tokens.

---

## **Table of Contents**

1. [Objective](#objective)
2. [Technologies Used](#technologies-used)
3. [Features](#features)
4. [Installation Guidelines](#installation-guidelines)
5. [Project Structure](#project-structure)
6. [API Endpoints](#api-endpoints)
7. [Documentation](#documentation)
8. [Contributors](#contributors)

---

## **Objective**

The backend handles all the core functionalities of the job portal system, including:

- User authentication and profile management for employers and job seekers.
- Job posting creation, search, and filtering.
- Job application submission and status tracking.
- Real-time notifications and in-app communication.

---

## **Technologies Used**

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building REST APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB to model application data.
- **JWT (JSON Web Token)**: Token-based authentication for secure user sessions.
- **Bcrypt.js**: For password hashing.
- **Cloudinary**: For managing and storing uploaded files (e.g., resumes).
- **Socket.io**: For real-time notifications and communication.
- **Nodemailer**: For sending email notifications.
- **Multer**: Middleware for handling file uploads in forms.

---

## **Features**

1. **User Authentication & Authorization**:

   - Secure registration and login for both employers and job seekers.
   - JWT-based authentication for secure API access.

2. **Job Posting & Search**:

   - Employers can create, update, and delete job postings.
   - Job seekers can search and filter jobs based on parameters like location, salary, etc.

3. **Application Submission & Tracking**:

   - Job seekers can apply to jobs and track the status of their applications.
   - Employers can manage incoming applications and update their statuses.

4. **Notifications & Communication**:
   - Real-time notifications for job updates and application statuses.
   - In-app messaging between employers and job seekers.
   - Email notifications for important job or application updates.

---

## **Installation Guidelines**

### **Prerequisites**

- **Node.js** and **npm** installed.
- **MongoDB** installed locally or using MongoDB Atlas.
- **Cloudinary** account for file storage.
- Email service for sending notifications (e.g., Gmail).

### **Steps to Set Up the Backend**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/AliHasnM/Online-Job-Portal-And-Recruitment-System.git
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_url
   CORS_ORIGIN=set_cors_origin (*, url, etc.)

   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=your_access_token_expiry
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_apiKey
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the MongoDB database**:

- Make sure your MongoDB server is running or configure MongoDB Atlas.

6. **Start the server**:

```bash
npm run dev
```

---

## **Project Structure**

```bash
backend-online-job-portal-and-recruitment-system/
│
├── public/
│   ├── temp/
│   │   ├── .gitkeep
├── src/
│   ├── controllers/
│   │   ├── employer.controller.js
│   │   ├── jobSeeker.controller.js
│   │   ├── application.controller.js
│   │   ├── jobPosting.controller.js
│   │   ├── notification.controller.js
│   ├── db/
│   │   ├── index.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── multer.middleware.js
│   ├── models/
│   │   ├── employer.model.js
│   │   ├── jobSeeker.model.js
│   │   ├── application.model.js
│   │   ├── jobPosting.model.js
│   │   ├── notification.model.js
│   ├── routes/
│   │   ├── employer.routes.js
│   │   ├── jobSeeker.routes.js
│   │   ├── jobPosting.routes.js
│   │   ├── application.routes.js
│   │   ├── notification.routes.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   ├── app.js
│   └── index.js
│
├── .env
├── package.json
└── README.md
```

---

### **API Endpoints**

#### **User Authentication & Profile**

1. **Register and Login Routes**:

   - **Employer**:
     - `POST /api/employer/register` - Register a new employer with file upload for `companyProfile`.
     - `POST /api/employer/login` - Employer login.
     - `POST /api/employer/logout` - Employer logout.
   - **Job Seeker**:
     - `POST /api/job-seeker/register` - Register a new job seeker with file upload for `resume`.
     - `POST /api/job-seeker/login` - Job seeker login.
     - `POST /api/job-seeker/logout` - Job seeker logout.

2. **Token and Password Management**:
   - **Employer**:
     - `POST /api/employer/refresh-token` - Refresh JWT token for employer.
     - `POST /api/employer/change-password` - Change password for employer (requires authentication).
   - **Job Seeker**:
     - `POST /api/job-seeker/refresh-token` - Refresh JWT token for job seeker.
     - `POST /api/job-seeker/change-password` - Change password for job seeker (requires authentication).

---

#### **Employer Actions**

1. **Profile Management**:

   - `GET /api/employer/profile` - Get employer profile.
   - `PATCH /api/employer/profile` - Update employer profile with file upload for `companyProfile` (requires authentication).

2. **Job Seeker Management**:
   - `GET /api/employer/applications/:jobPostingId` - Get applications for a specific job posting.
   - `GET /api/employer/job-seeker/:jobSeekerId` - Get details of a specific job seeker.
   - `PATCH /api/employer/update-job-seeker-status/:jobPostingId/:jobSeekerId` - Update the status of a job seeker’s application (requires authentication).

---

#### **Job Posting Management**

- **Employer**:
  - `POST /api/job-postings/` - Create a new job posting (requires authentication).
  - `GET /api/job-postings/` - Get all job postings.
  - `GET /api/job-postings/:jobPostingId` - Get details of a specific job posting.
  - `PATCH /api/job-postings/:jobPostingId` - Update a job posting (requires authentication).
  - `DELETE /api/job-postings/:jobPostingId` - Delete a job posting (requires authentication).

---

#### **Job Seeker Actions**

1. **Profile Management**:

   - `GET /api/job-seeker/profile` - Get job seeker profile (requires authentication).
   - `PATCH /api/job-seeker/profile` - Update job seeker profile with file upload for `resume` (requires authentication).

2. **Job Search & Application**:
   - `GET /api/job-seeker/search` - Search for jobs.
   - `GET /api/job-seeker/details/:jobPostingId` - Get details of a specific job.
   - `POST /api/job-seeker/apply/:jobPostingId` - Apply for a job (requires authentication).
   - `GET /api/job-seeker/status/:jobPostingId` - Get job application status (requires authentication).

---

#### **Notifications**

- **Employer**:
  - `POST /api/notifications/:employerId` - Create a notification for an employer (requires authentication).
  - `GET /api/notifications/:employerId` - Get notifications for an employer (requires authentication).

---

### **Final Route Structure**

- **Employer Routes (`/api/employer/`)**

  - `POST /register` - Register employer.
  - `POST /login` - Login employer.
  - `POST /logout` - Logout employer.
  - `POST /refresh-token` - Refresh token.
  - `POST /change-password` - Change password.
  - `GET /profile` - Get employer profile.
  - `PATCH /profile` - Update employer profile.
  - `GET /applications/:jobPostingId` - Get applications for a job.
  - `GET /job-seeker/:jobSeekerId` - Get job seeker details.
  - `PATCH /update-job-seeker-status/:jobPostingId/:jobSeekerId` - Update job seeker status.

- **Job Posting Routes (`/api/job-postings/`)**

  - `POST /` - Create job posting.
  - `GET /` - Get all job postings.
  - `GET /:jobPostingId` - Get specific job posting.
  - `PATCH /:jobPostingId` - Update job posting.
  - `DELETE /:jobPostingId` - Delete job posting.

- **Job Seeker Routes (`/api/job-seeker/`)**

  - `POST /register` - Register job seeker.
  - `POST /login` - Login job seeker.
  - `POST /logout` - Logout job seeker.
  - `GET /profile` - Get job seeker profile.
  - `PATCH /profile` - Update job seeker profile.
  - `GET /search` - Search jobs.
  - `GET /details/:jobPostingId` - Get job details.
  - `POST /apply/:jobPostingId` - Apply for job.
  - `GET /status/:jobPostingId` - Get application status.

- **Notification Routes (`/api/notifications/`)**
  - `POST /:employerId` - Create notification for employer.
  - `GET /:employerId` - Get notifications for employer.

---

## **Documentation**

- **API Documentation**: [\[Link to API docs\]](https://www.postman.com/api-platform/api-documentation/)
- **Backend Guide**: [\[Link to backend guide\]](https://roadmap.sh/backend)

---

## **Contributors**

- **[Ali Hassan]** – Backend Developer
