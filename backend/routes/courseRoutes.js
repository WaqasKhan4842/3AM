import express from "express";
import CourseController from "../controllers/CourseController.js";


const router = express.Router();

/**
 * @desc Create a new course (Tutor only)
 */
router.post("/",  async (req, res, next) => {
  try {
    const courseData = req.body;
    const tutorId = req.user._id;
    const result = await CourseController.createCourse(courseData, tutorId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
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
router.put("/:courseId", async (req, res, next) => {
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
router.delete("/:courseId", async (req, res, next) => {
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
router.get("/:courseId/stats",async (req, res, next) => {
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