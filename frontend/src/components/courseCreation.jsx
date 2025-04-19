import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpload,
    faBook,
    faTag,
    faDollarSign,
    faImage,
    faVideo,
    faCheck,
    faSpinner,
    faSave,
    faEye,
} from "@fortawesome/free-solid-svg-icons";

const CourseCreation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentTag, setCurrentTag] = useState('');
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        thumbnail: null,
        thumbnailPreview: '',
        price: 0,
        category: '',
        tags: [],
        isPublished: false,
        videos: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData({
            ...courseData,
            [name]: value
        });
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCourseData({
                ...courseData,
                thumbnail: file,
                thumbnailPreview: URL.createObjectURL(file)
            });
        }
    };

    const handleVideoUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsLoading(true);

        // Create temporary video objects with local preview URLs
        const newVideos = Array.from(files).map((file, index) => ({
            file,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            description: '',
            videoUrl: URL.createObjectURL(file),
            order: courseData.videos.length + index + 1,
            thumbnail: null
        }));

        setCourseData({
            ...courseData,
            videos: [...courseData.videos, ...newVideos]
        });

        // Simulate upload completion
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    const handleVideoTitleChange = (index, value) => {
        const updatedVideos = [...courseData.videos];
        updatedVideos[index].title = value;
        setCourseData({ ...courseData, videos: updatedVideos });
    };

    const handleVideoDescriptionChange = (index, value) => {
        const updatedVideos = [...courseData.videos];
        updatedVideos[index].description = value;
        setCourseData({ ...courseData, videos: updatedVideos });
    };

    const reorderVideos = (index, direction) => {
        if ((direction === "up" && index === 0) ||
            (direction === "down" && index === courseData.videos.length - 1)) {
            return;
        }

        const updatedVideos = [...courseData.videos];
        const swapIndex = direction === "up" ? index - 1 : index + 1;

        // Swap the videos
        [updatedVideos[index], updatedVideos[swapIndex]] = [updatedVideos[swapIndex], updatedVideos[index]];

        // Update order numbers
        updatedVideos.forEach((video, idx) => {
            video.order = idx + 1;
        });

        setCourseData({ ...courseData, videos: updatedVideos });
    };

    const removeVideo = (index) => {
        const updatedVideos = [...courseData.videos];
        updatedVideos.splice(index, 1);

        // Update order numbers after removal
        updatedVideos.forEach((video, idx) => {
            video.order = idx + 1;
        });

        setCourseData({
            ...courseData,
            videos: updatedVideos
        });
    };

    const handleAddTag = () => {
        if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) {
            setCourseData({
                ...courseData,
                tags: [...courseData.tags, currentTag.trim()]
            });
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setCourseData({
            ...courseData,
            tags: courseData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // In a real application, you would upload the videos and thumbnail first
            // Then create the course with the returned URLs

            const formData = new FormData();
            formData.append('title', courseData.title);
            formData.append('description', courseData.description);
            formData.append('price', courseData.price);
            formData.append('category', courseData.category);
            formData.append('isPublished', courseData.isPublished);
            formData.append('tags', JSON.stringify(courseData.tags));

            if (courseData.thumbnail) {
                formData.append('thumbnail', courseData.thumbnail);
            }

            // Convert videos to the format expected by the backend
            const videosData = courseData.videos.map(video => ({
                title: video.title,
                description: video.description,
                order: video.order,
                // In a real app, video and thumbnail URLs would come from your file upload service
                videoUrl: "placeholder-url-after-upload",
                thumbnail: video.thumbnail || null
            }));

            formData.append('videos', JSON.stringify(videosData));

            const response = await axios.post('/api/courses', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                alert('Course created successfully!');
                // Reset form or redirect
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Failed to create course. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="w-full p-8 bg-white">
                <div className="flex justify-between items-center mb-8 border-b border-[#A7C4C2] pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#02010A]">Create New Course</h1>
                        <p className="text-gray-600">Enter all course details below</p>
                    </div>
                    <div className="flex items-center">
                        {!isLoading ? (
                            <>
                                <button
                                    type="button"
                                    className="flex items-center text-[#FE4A49] hover:text-[#FED766] mr-4"
                                >
                                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                                    Preview
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center bg-[#97EFE9] text-[#02010A] hover:bg-[#FED766] py-2 px-4 rounded transition duration-300"
                                >
                                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                                    Save Draft
                                </button>
                            </>
                        ) : (
                            <div className="text-[#FE4A49] flex items-center">
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                Processing...
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full max-w-6xl mx-auto">
                    <form onSubmit={handleSubmit}>
                        {/* Basic Course Info Section */}
                        <div className="bg-white p-6 rounded-lg border border-[#A7C4C2] mb-6">
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-[#A7C4C2]">Basic Course Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div>
                                    {/* Course Title */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <FontAwesomeIcon icon={faBook} className="mr-2 text-[#FE4A49]" />
                                            Course Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={courseData.title}
                                            onChange={handleInputChange}
                                            className="shadow appearance-none border border-[#A7C4C2] rounded w-full py-2 px-3 text-[#02010A] bg-[#F7FDFC] leading-tight focus:outline-none focus:shadow-outline focus:border-[#97EFE9]"
                                            placeholder="E.g., Mastering Web Development with React"
                                            required
                                        />
                                    </div>

                                    {/* Course Description */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={courseData.description}
                                            onChange={handleInputChange}
                                            className="shadow appearance-none border border-[#A7C4C2] rounded w-full py-2 px-3 text-[#02010A] bg-[#F7FDFC] leading-tight focus:outline-none focus:shadow-outline focus:border-[#97EFE9] h-32"
                                            placeholder="Provide a detailed description of your course"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div>
                                    {/* Category */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <FontAwesomeIcon icon={faTag} className="mr-2 text-[#FE4A49]" />
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={courseData.category}
                                            onChange={handleInputChange}
                                            className="shadow appearance-none border border-[#A7C4C2] rounded w-full py-2 px-3 text-[#02010A] bg-[#F7FDFC] leading-tight focus:outline-none focus:shadow-outline focus:border-[#97EFE9]"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            <option value="programming">Programming</option>
                                            <option value="design">Design</option>
                                            <option value="business">Business</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="personal-development">Personal Development</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-[#FE4A49]" />
                                            Price (USD)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="price"
                                                value={courseData.price}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border border-[#A7C4C2] rounded w-full py-2 pl-8 pr-3 text-[#02010A] bg-[#F7FDFC] leading-tight focus:outline-none focus:shadow-outline focus:border-[#97EFE9]"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">Set to 0 for free courses</p>
                                    </div>

                                    {/* Publish Toggle */}
                                    <div className="mb-4">
                                        <div className="flex items-center p-3 bg-[#FED766] bg-opacity-20 rounded">
                                            <input
                                                type="checkbox"
                                                name="isPublished"
                                                id="isPublished"
                                                checked={courseData.isPublished}
                                                onChange={(e) => setCourseData({...courseData, isPublished: e.target.checked})}
                                                className="mr-2 h-5 w-5 accent-[#97EFE9]"
                                            />
                                            <div>
                                                <label htmlFor="isPublished" className="text-gray-700 font-medium">
                                                    Publish course immediately
                                                </label>
                                                <p className="text-sm text-gray-600">When enabled, your course will be visible to students</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags - Full width */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    <FontAwesomeIcon icon={faTag} className="mr-2 text-[#FE4A49]" />
                                    Tags
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        className="shadow appearance-none border border-[#A7C4C2] rounded-l w-full py-2 px-3 text-[#02010A] bg-[#F7FDFC] leading-tight focus:outline-none focus:shadow-outline focus:border-[#97EFE9]"
                                        placeholder="Add a tag"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="bg-[#97EFE9] hover:bg-[#FED766] text-[#02010A] font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline transition duration-300"
                                    >
                                        Add
                                    </button>
                                </div>

                                {courseData.tags.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {courseData.tags.map((tag, index) => (
                                            <div key={index} className="bg-[#97EFE9] text-[#02010A] px-3 py-1 rounded-full flex items-center transition duration-300">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-2 text-[#02010A] hover:text-[#FE4A49]"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail - Full width */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    <FontAwesomeIcon icon={faImage} className="mr-2 text-[#FE4A49]" />
                                    Course Thumbnail *
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="hidden"
                                        id="thumbnail-upload"
                                        required={!courseData.thumbnail}
                                    />
                                    <label
                                        htmlFor="thumbnail-upload"
                                        className="cursor-pointer bg-[#97EFE9] hover:bg-[#FED766] text-[#02010A] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300"
                                    >
                                        <FontAwesomeIcon icon={faUpload} className="mr-2" />
                                        Upload Thumbnail
                                    </label>
                                    {courseData.thumbnailPreview ? (
                                        <div className="ml-4">
                                            <img
                                                src={courseData.thumbnailPreview}
                                                alt="Thumbnail preview"
                                                className="h-16 w-auto object-cover rounded border-2 border-[#A7C4C2]"
                                            />
                                        </div>
                                    ) : (
                                        <span className="ml-4 text-sm text-gray-500">Recommended size: 1280x720 pixels</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Course Videos Section */}
                        <div className="bg-white p-6 rounded-lg border border-[#A7C4C2] mb-6">
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-[#A7C4C2]">Course Videos</h2>

                            {/* Video Upload */}
                            <div className="mb-6">
                                <div className="flex items-center">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoUpload}
                                        className="hidden"
                                        id="video-upload"
                                        multiple
                                    />
                                    <label
                                        htmlFor="video-upload"
                                        className="cursor-pointer bg-[#97EFE9] hover:bg-[#FED766] text-[#02010A] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300"
                                    >
                                        <FontAwesomeIcon icon={faUpload} className="mr-2" />
                                        Upload Videos
                                    </label>
                                    {isLoading && (
                                        <div className="ml-4 text-[#FE4A49] flex items-center">
                                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                            Processing...
                                        </div>
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-gray-500">Upload MP4, MOV, or AVI files (max 2GB each)</p>
                            </div>

                            {/* Video List */}
                            {courseData.videos.length > 0 && (
                                <div className="space-y-4">
                                    {courseData.videos.map((video, index) => (
                                        <div key={index} className="border border-[#A7C4C2] rounded p-4 hover:border-[#97EFE9] transition-colors bg-[#F7FDFC]">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center">
                                                    <div className="mr-3 text-[#FE4A49] bg-[#FE4A49] bg-opacity-10 w-8 h-8 rounded-full flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faVideo} />
                                                    </div>
                                                    <span className="font-medium">Video {video.order}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => reorderVideos(index, "up")}
                                                        disabled={index === 0}
                                                        className={`${index === 0 ? 'text-gray-400' : 'text-blue-500 hover:text-blue-700'} bg-blue-100 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-300`}
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => reorderVideos(index, "down")}
                                                        disabled={index === courseData.videos.length - 1}
                                                        className={`${index === courseData.videos.length - 1 ? 'text-gray-400' : 'text-blue-500 hover:text-blue-700'} bg-blue-100 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-300`}
                                                    >
                                                        ↓
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVideo(index)}
                                                        className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-300"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Video Title */}
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-bold mb-1">Title *</label>
                                                    <input
                                                        type="text"
                                                        value={video.title}
                                                        onChange={(e) => handleVideoTitleChange(index, e.target.value)}
                                                        className="shadow appearance-none border border-[#A7C4C2] rounded w-full py-2 px-3 text-[#02010A] bg-white leading-tight focus:outline-none focus:shadow-outline focus:border-[#97EFE9]"
                                                        placeholder="Video title"
                                                        required
                                                    />
                                                </div>

                                                {/* Video Description */}
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-bold mb-1">Description</label>
                                                    <input
                                                        type="text"
                                                        value={video.description}
                                                        onChange={(e) => handleVideoDescriptionChange(index, e.target.value)}
                                                        className="shadow appearance-none border border-[#A7C4C2] rounded w-full py-2 px-3 text-[#02010A] bg-white leading-tight focus:outline-none focus:shadow-outline focus:border-[#97EFE9]"
                                                        placeholder="Short description (optional)"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <video
                                                    src={video.videoUrl}
                                                    className="w-full h-32 object-cover rounded mt-2 bg-black"
                                                    controls
                                                ></video>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {courseData.videos.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-[#A7C4C2] rounded">
                                    <FontAwesomeIcon icon={faVideo} className="text-[#A7C4C2] text-4xl mb-2" />
                                    <p className="text-gray-500">No videos uploaded yet</p>
                                    <p className="text-sm text-gray-400">Upload videos to continue</p>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#FE4A49] hover:bg-[#FED766] hover:text-[#02010A] text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300"
                            >
                                {isLoading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                        {courseData.isPublished ? 'Publish Course' : 'Create Course'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CourseCreation;