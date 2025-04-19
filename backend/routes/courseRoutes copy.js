import express from "express";
import CourseController from "../controllers/CourseController.js";
import UserMiddleware from "../middlewares/user.middleware.js";

const router = express.Router();
import path from 'path';

import multer from "multer";

// Serve static files from 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


/**
 * @desc Create a new course (Tutor only)
 */
router.post("/", upload.single("thumbnail"), UserMiddleware, async (req, res, next) => {
    try {
      console.log("Course creation: Middleware passed, handling request...");
  
      // Extract course data and uploaded file
      const courseData = req.body;
      const tutorId = req.user._id;
  
      console.log("Course creation: Received course data:", courseData);
  
      // Ensure thumbnail file was uploaded
      if (!req.file) {
        console.error("Course creation: Thumbnail file not uploaded.");
        return res.status(400).json({ error: "Thumbnail file is required" });
      }
  
      // Add thumbnail path to courseData
      courseData.thumbnail = req.file.path;
      console.log("Course creation: Thumbnail file path added:", req.file.path);
  
      // Call the controller to create the course
      const result = await CourseController.createCourse(courseData, tutorId);
  
      console.log("Course creation: Course created successfully.");
      res.status(201).json(result);
    } catch (error) {
      console.error("Course creation: Error occurred:", error.message);
      next(error); // Pass error to the error-handling middleware
    }
  });
  

/**
 * @desc Get all courses (with optional filtering)
 */
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const result = await CourseController.getCourses(filters, parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc Get single course by ID with videos
 */
router.get("/:courseId", async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?._id || null;
    const result = await CourseController.getCourseById(courseId, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc Update course details (Tutor only)
 */
router.put("/:courseId", UserMiddleware, async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const courseData = req.body;
    const tutorId = req.user._id;
    const result = await CourseController.updateCourse(courseId, courseData, tutorId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc Delete a course (Tutor only)
 */
router.delete("/:courseId", UserMiddleware, async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const tutorId = req.user._id;
    const result = await CourseController.deleteCourse(courseId, tutorId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc Get courses by tutor ID
 */
router.get("/tutor/:tutorId", async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await CourseController.getTutorCourses(tutorId, parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc Search courses
 */
router.get("/search/:query", async (req, res, next) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await CourseController.searchCourses(query, parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc Get course statistics for tutor dashboard (Tutor only)
 */
router.get("/:courseId/stats", UserMiddleware, async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const tutorId = req.user._id;
    const result = await CourseController.getCourseStats(courseId, tutorId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;