import { Video, Course, Transcript } from "../models/mongoose-models.js";
import mongoose from "mongoose";

class VideoController {
  /**
   * @desc Upload and create a new video
   */
  static async createVideo(videoData, courseId, tutorId) {
    try {
      // Verify course exists and belongs to tutor
      const course = await Course.findById(courseId);
      
      if (!course) {
        throw new Error("Course not found");
      }
      
      if (course.tutor.toString() !== tutorId.toString()) {
        throw new Error("Unauthorized: You can only add videos to your own courses");
      }
      
      // Get highest order number for existing videos
      const highestOrder = await Video.findOne({ course: courseId })
        .sort({ order: -1 })
        .select('order');
      
      const newOrder = highestOrder ? highestOrder.order + 1 : 1;
      
      // Create new video
      const newVideo = new Video({
        title: videoData.title,
        description: videoData.description || '',
        course: courseId,
        videoUrl: videoData.videoUrl,
        duration: videoData.duration,
        thumbnail: videoData.thumbnail || '',
        order: videoData.order || newOrder
      });
      
      const savedVideo = await newVideo.save();
      
      // Add video to course
      await Course.findByIdAndUpdate(courseId, {
        $push: { videos: savedVideo._id }
      });
      
      // If AI transcript is provided, create transcript
      if (videoData.transcriptContent) {
        const transcript = new Transcript({
          video: savedVideo._id,
          content: videoData.transcriptContent,
          segments: videoData.transcriptSegments || [],
          isAIGenerated: true,
          language: videoData.language || 'en'
        });
        
        const savedTranscript = await transcript.save();
        
        // Link transcript to video
        await Video.findByIdAndUpdate(savedVideo._id, {
          transcript: savedTranscript._id
        });
        
        savedVideo.transcript = savedTranscript._id;
      }
      
      return {
        success: true,
        message: "Video added successfully",
        video: savedVideo
      };
    } catch (error) {
      throw new Error(`Failed to add video: ${error.message}`);
    }
  }

  /**
   * @desc Get video by ID
   */
  static async getVideoById(videoId, userId = null) {
    try {
      const video = await Video.findById(videoId)
        .populate('transcript')
        .populate({
          path: 'course',
          select: 'title tutor isPublished',
          populate: {
            path: 'tutor',
            select: 'name email'
          }
        });
      
      if (!video) {
        throw new Error("Video not found");
      }
      
      // Check if user has access to this video (tutor or enrolled student)
      if (userId) {
        // If user is the tutor, allow access
        if (video.course.tutor._id.toString() === userId.toString()) {
          return {
            success: true,
            video,
            isOwner: true
          };
        }
        
        // If course is published, check if user is enrolled
        if (video.course.isPublished) {
          const enrollment = await mongoose.model("Enrollment").findOne({
            student: userId,
            course: video.course._id
          });
          
          if (enrollment) {
            // Update progress if student is enrolled
            if (enrollment.progress.completedVideos.indexOf(videoId) === -1) {
              enrollment.progress.lastWatchedVideo = videoId;
              
              // Calculate progress percentage
              const totalVideos = await Video.countDocuments({ course: video.course._id });
              const completedCount = enrollment.progress.completedVideos.length;
              enrollment.progress.progressPercentage = Math.round((completedCount / totalVideos) * 100);
              
              await enrollment.save();
            }
            
            return {
              success: true,
              video,
              isEnrolled: true
            };
          }
        }
        
        // If video course is not published and user is not tutor, deny access
        if (!video.course.isPublished) {
          throw new Error("Video not available. Course is not published.");
        }
        
        // User is neither tutor nor enrolled, but course is published, so provide limited access
        return {
          success: true,
          video: {
            _id: video._id,
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            course: video.course
          },
          isEnrolled: false,
          message: "Enrollment required to watch this video"
        };
      } else {
        // Public access - only show published course videos with limited info
        if (!video.course.isPublished) {
          throw new Error("Video not available");
        }
        
        return {
          success: true,
          video: {
            _id: video._id,
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            course: video.course
          },
          isEnrolled: false,
          message: "Login and enroll to watch this video"
        };
      }
    } catch (error) {
      throw new Error(`Failed to fetch video: ${error.message}`);
    }
  }

  /**
   * @desc Update video details
   */
  static async updateVideo(videoId, videoData, tutorId) {
    try {
      const video = await Video.findById(videoId).populate('course', 'tutor');
      
      if (!video) {
        throw new Error("Video not found");
      }
      
      // Verify tutor owns the course
      if (video.course.tutor.toString() !== tutorId.toString()) {
        throw new Error("Unauthorized: You can only edit videos for your own courses");
      }
      
      // Update video
      const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          title: videoData.title || video.title,
          description: videoData.description || video.description,
          videoUrl: videoData.videoUrl || video.videoUrl,
          thumbnail: videoData.thumbnail || video.thumbnail,
          duration: videoData.duration || video.duration,
          order: videoData.order || video.order
        },
        { new: true }
      );
      
      // Update transcript if provided
      if (videoData.transcriptContent) {
        if (video.transcript) {
          // Update existing transcript
          await Transcript.findByIdAndUpdate(
            video.transcript,
            {
              content: videoData.transcriptContent,
              segments: videoData.transcriptSegments || [],
              isAIGenerated: videoData.isAIGenerated || true,
              language: videoData.language || 'en'
            }
          );
        } else {
          // Create new transcript
          const transcript = new Transcript({
            video: videoId,
            content: videoData.transcriptContent,
            segments: videoData.transcriptSegments || [],
            isAIGenerated: videoData.isAIGenerated || true,
            language: videoData.language || 'en'
          });
          
          const savedTranscript = await transcript.save();
          
          // Link transcript to video
          await Video.findByIdAndUpdate(videoId, {
            transcript: savedTranscript._id
          });
        }
      }
      
      return {
        success: true,
        message: "Video updated successfully",
        video: updatedVideo
      };
    } catch (error) {
      throw new Error(`Failed to update video: ${error.message}`);
    }
  }

  /**
   * @desc Delete a video
   */
  static async deleteVideo(videoId, tutorId) {
    try {
      const video = await Video.findById(videoId).populate('course', 'tutor');
      
      if (!video) {
        throw new Error("Video not found");
      }
      
      // Verify tutor owns the course
      if (video.course.tutor.toString() !== tutorId.toString()) {
        throw new Error("Unauthorized: You can only delete videos from your own courses");
      }
      
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        // Delete transcript if exists
        if (video.transcript) {
          await Transcript.findByIdAndDelete(video.transcript);
        }
        
        // Remove video from course
        await Course.findByIdAndUpdate(video.course._id, {
          $pull: { videos: videoId }
        });
        
        // Update order of remaining videos
        const videosToUpdate = await Video.find({
          course: video.course._id,
          order: { $gt: video.order }
        });
        
        for (const v of videosToUpdate) {
          await Video.findByIdAndUpdate(v._id, {
            order: v.order - 1
          });
        }
        
        // Delete video
        await Video.findByIdAndDelete(videoId);
        
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
      
      return {
        success: true,
        message: "Video deleted successfully"
      };
    } catch (error) {
      throw new Error(`Failed to delete video: ${error.message}`);
    }
  }

  /**
   * @desc Get videos for a course
   */
  static async getCourseVideos(courseId, userId = null) {
    try {
      const course = await Course.findById(courseId);
      
      if (!course) {
        throw new Error("Course not found");
      }
      
      // Check access rights
      const isOwner = userId && course.tutor.toString() === userId.toString();
      let isEnrolled = false;
      
      if (!isOwner && !course.isPublished) {
        throw new Error("Course not available");
      }
      
      // Check enrollment if not owner
      if (userId && !isOwner) {
        const enrollment = await mongoose.model("Enrollment").findOne({
          student: userId,
          course: courseId
        });
        
        isEnrolled = !!enrollment;
      }
      
      // Get videos
      const videos = await Video.find({ course: courseId })
        .populate('transcript')
        .sort({ order: 1 });
      
      // If not enrolled or owner, only return limited info
      if (!isOwner && !isEnrolled) {
        const limitedVideos = videos.map(video => ({
          _id: video._id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          duration: video.duration,
          order: video.order
        }));
        
        return {
          success: true,
          videos: limitedVideos,
          isOwner,
          isEnrolled,
          message: "Enrollment required to access full video content"
        };
      }
      
      return {
        success: true,
        videos,
        isOwner,
        isEnrolled
      };
    } catch (error) {
      throw new Error(`Failed to fetch course videos: ${error.message}`);
    }
  }

  /**
   * @desc Generate AI transcript for video
   * Note: This method would integrate with an AI service
   */
  static async generateTranscript(videoId, tutorId) {
    try {
      const video = await Video.findById(videoId).populate('course', 'tutor');
      
      if (!video) {
        throw new Error("Video not found");
      }
      
      // Verify tutor owns the course
      if (video.course.tutor.toString() !== tutorId.toString()) {
        throw new Error("Unauthorized: You can only generate transcripts for your own videos");
      }
      
      // Here you would implement the AI transcription service integration
      // This is a placeholder for the actual implementation
      
      // Mock AI transcript generation
      const mockTranscriptContent = `This is an automatically generated transcript for "${video.title}".`;
      const mockSegments = [
        { text: "This is an automatically", startTime: 0, endTime: 2 },
        { text: "generated transcript for", startTime: 2, endTime: 4 },
        { text: `"${video.title}".`, startTime: 4, endTime: 6 }
      ];
      
      // Create or update transcript
      let transcript;
      if (video.transcript) {
        transcript = await Transcript.findByIdAndUpdate(
          video.transcript,
          {
            content: mockTranscriptContent,
            segments: mockSegments,
            isAIGenerated: true
          },
          { new: true }
        );
      } else {
        transcript = new Transcript({
          video: videoId,
          content: mockTranscriptContent,
          segments: mockSegments,
          isAIGenerated: true
        });
        
        transcript = await transcript.save();
        
        // Link to video
        await Video.findByIdAndUpdate(videoId, {
          transcript: transcript._id
        });
      }
      
      return {
        success: true,
        message: "Transcript generated successfully",
        transcript
      };
    } catch (error) {
      throw new Error(`Failed to generate transcript: ${error.message}`);
    }
  }
  
  /**
   * @desc Mark video as completed for a student
   */
  static async markVideoCompleted(videoId, studentId) {
    try {
      const video = await Video.findById(videoId).populate('course');
      
      if (!video) {
        throw new Error("Video not found");
      }
      
      // Check if student is enrolled
      const enrollment = await mongoose.model("Enrollment").findOne({
        student: studentId,
        course: video.course._id
      });
      
      if (!enrollment) {
        throw new Error("You are not enrolled in this course");
      }
      
      // Check if video is already completed
      if (enrollment.progress.completedVideos.includes(videoId)) {
        return {
          success: true,
          message: "Video already marked as completed",
          progress: enrollment.progress
        };
      }
      
      // Add to completed videos
      enrollment.progress.completedVideos.push(videoId);
      enrollment.progress.lastWatchedVideo = videoId;
      
      // Calculate progress percentage
      const totalVideos = await Video.countDocuments({ course: video.course._id });
      enrollment.progress.progressPercentage = Math.round(
        (enrollment.progress.completedVideos.length / totalVideos) * 100
      );
      
      await enrollment.save();
      
      return {
        success: true,
        message: "Video marked as completed",
        progress: enrollment.progress
      };
    } catch (error) {
      throw new Error(`Failed to mark video as completed: ${error.message}`);
    }
  }

  /**
   * @desc Reorder videos in a course
   */
  static async reorderVideos(courseId, videoOrder, tutorId) {
    try {
      const course = await Course.findById(courseId);
      
      if (!course) {
        throw new Error("Course not found");
      }
      
      // Verify tutor owns the course
      if (course.tutor.toString() !== tutorId.toString()) {
        throw new Error("Unauthorized: You can only reorder videos for your own courses");
      }
      
      // videoOrder should be an array of { videoId, newOrder }
      for (const item of videoOrder) {
        await Video.findByIdAndUpdate(item.videoId, {
          order: item.newOrder
        });
      }
      
      // Get updated videos
      const updatedVideos = await Video.find({ course: courseId })
        .select('_id title order')
        .sort({ order: 1 });
      
      return {
        success: true,
        message: "Videos reordered successfully",
        videos: updatedVideos
      };
    } catch (error) {
      throw new Error(`Failed to reorder videos: ${error.message}`);
    }
  }
}

export default VideoController;