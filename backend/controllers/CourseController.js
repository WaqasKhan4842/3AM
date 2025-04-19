import { Course, Video, Transcript, ChatRoom } from "../models/mongoose-models.js";
import mongoose from "mongoose";



class CourseController {
  /**
 * @desc Create a new course
 */
static async createCourse(courseData, tutorId) {
    console.log("createCourse: Function execution started");
  
    try {
      console.log("createCourse: Received courseData:", courseData);
      console.log("createCourse: Received tutorId:", tutorId);
  
      // Validate that the user is a tutor (you might want to do this in middleware)
      if (!tutorId) {
        throw new Error("Tutor ID is required to create a course");
      }
  
      const newCourse = new Course({
        title: courseData.title,
        description: courseData.description,
        thumbnail: courseData.thumbnail,
        price: courseData.price || 0,
        tutor: tutorId,
        category: courseData.category,
        tags: courseData.tags || [],
        isPublished: courseData.isPublished || false,
      });
  
      console.log("createCourse: New course object created:", newCourse);
  
      const savedCourse = await newCourse.save();
      console.log("createCourse: Course saved to database:", savedCourse);
  
      // Create chat room for the course
      console.log("createCourse: Creating chat room...");
      await ChatRoom.create({
        course: savedCourse._id,
        name: `Chat for ${savedCourse.title}`,
        description: `Discussion forum for ${savedCourse.title}`,
        participants: [tutorId], // Initially just the tutor
      });
      console.log("createCourse: Chat room created successfully");
  
      return {
        success: true,
        message: "Course created successfully",
        course: savedCourse,
      };
    } catch (error) {
      console.error("createCourse: Error occurred:", error.message);
      throw new Error(`Failed to create course: ${error.message}`);
    }
  }
  

  /**
   * @desc Get all courses (with optional filtering)
   */
  static async getCourses(filters = {}, page = 1, limit = 10) {
    try {
      const query = { isPublished: true, ...filters };
      
      const courses = await Course.find(query)
        .populate("tutor", "name email")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const total = await Course.countDocuments(query);
      
      return {
        success: true,
        courses,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
  }

  /**
   * @desc Get single course by ID with videos
   */
  static async getCourseById(courseId, userId = null) {
    try {
      const course = await Course.findById(courseId)
        .populate("tutor", "name email")
        .populate({
          path: "videos",
          options: { sort: { order: 1 } },
          populate: { 
            path: "transcript"
          }
        });
      
      if (!course) {
        throw new Error("Course not found");
      }

      // If user is not the tutor and course is not published, deny access
      if (!course.isPublished && (!userId || course.tutor._id.toString() !== userId.toString())) {
        throw new Error("Course not available");
      }

      // Check if the user is enrolled (if userId is provided)
      let isEnrolled = false;
      if (userId) {
        const enrollment = await mongoose.model("Enrollment").findOne({
          student: userId,
          course: courseId
        });
        isEnrolled = !!enrollment;
      }

      return {
        success: true,
        course,
        isEnrolled
      };
    } catch (error) {
      throw new Error(`Failed to fetch course: ${error.message}`);
    }
  }

  /**
   * @desc Update course details
   */
  static async updateCourse(courseId, courseData, tutorId) {
    try {
      const course = await Course.findById(courseId);
      
      if (!course) {
        throw new Error("Course not found");
      }
      
      // Verify the user is the tutor of this course
      if (course.tutor.toString() !== tutorId.toString()) {
        throw new Error("Unauthorized: You can only edit your own courses");
      }
      
      // Update allowed fields
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          title: courseData.title || course.title,
          description: courseData.description || course.description,
          thumbnail: courseData.thumbnail || course.thumbnail,
          price: courseData.price !== undefined ? courseData.price : course.price,
          category: courseData.category || course.category,
          tags: courseData.tags || course.tags,
          isPublished: courseData.isPublished !== undefined ? courseData.isPublished : course.isPublished
        },
        { new: true }
      );
      
      return {
        success: true,
        message: "Course updated successfully",
        course: updatedCourse
      };
    } catch (error) {
      throw new Error(`Failed to update course: ${error.message}`);
    }
  }

  /**
   * @desc Delete a course
   */
  static async deleteCourse(courseId, tutorId) {
    try {
      const course = await Course.findById(courseId);
      
      if (!course) {
        throw new Error("Course not found");
      }
      
      // Verify the user is the tutor of this course
      if (course.tutor.toString() !== tutorId.toString()) {
        throw new Error("Unauthorized: You can only delete your own courses");
      }
      
      // Check if there are enrollments
      const enrollmentCount = await mongoose.model("Enrollment").countDocuments({ course: courseId });
      if (enrollmentCount > 0) {
        throw new Error("Cannot delete a course with active enrollments");
      }
      
      // Get all videos to delete associated transcripts
      const videos = await Video.find({ course: courseId });
      
      // Delete all associated resources
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        // Delete transcripts
        for (const video of videos) {
          if (video.transcript) {
            await Transcript.findByIdAndDelete(video.transcript);
          }
        }
        
        // Delete videos
        await Video.deleteMany({ course: courseId });
        
        // Delete chat room and messages
        const chatRoom = await ChatRoom.findOne({ course: courseId });
        if (chatRoom) {
          await mongoose.model("ChatMessage").deleteMany({ chatRoom: chatRoom._id });
          await ChatRoom.findByIdAndDelete(chatRoom._id);
        }
        
        // Delete course
        await Course.findByIdAndDelete(courseId);
        
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
      
      return {
        success: true,
        message: "Course and all associated resources deleted successfully"
      };
    } catch (error) {
      throw new Error(`Failed to delete course: ${error.message}`);
    }
  }

  /**
   * @desc Get courses by tutor ID
   */
  static async getTutorCourses(tutorId, page = 1, limit = 10) {
    try {
      const courses = await Course.find({ tutor: tutorId })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const total = await Course.countDocuments({ tutor: tutorId });
      
      return {
        success: true,
        courses,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch tutor courses: ${error.message}`);
    }
  }

  /**
   * @desc Search courses
   */
  static async searchCourses(searchQuery, page = 1, limit = 10) {
    try {
      const query = {
        isPublished: true,
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { category: { $regex: searchQuery, $options: 'i' } },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } }
        ]
      };
      
      const courses = await Course.find(query)
        .populate("tutor", "name email")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const total = await Course.countDocuments(query);
      
      return {
        success: true,
        courses,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      };
    } catch (error) {
      throw new Error(`Failed to search courses: ${error.message}`);
    }
  }

  /**
   * @desc Get course statistics for tutor dashboard
   */
  static async getCourseStats(courseId, tutorId) {
    try {
      const course = await Course.findById(courseId);
      
      if (!course) {
        throw new Error("Course not found");
      }
      
      // Verify the user is the tutor of this course
      if (course.tutor.toString() !== tutorId.toString()) {
        throw new Error("Unauthorized: You can only view stats for your own courses");
      }
      
      // Get enrollment stats
      const enrollmentCount = course.enrollmentCount;
      
      // Get video stats
      const videoCount = await Video.countDocuments({ course: courseId });
      
      // Get average rating
      const reviews = await mongoose.model("Review").find({ course: courseId });
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
      
      return {
        success: true,
        stats: {
          enrollmentCount,
          videoCount,
          reviewCount: reviews.length,
          avgRating: parseFloat(avgRating.toFixed(1))
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch course stats: ${error.message}`);
    }
  }
}

export default CourseController;