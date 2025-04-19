import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faUsers, 
  faChartLine, 
  faEdit, 
  faTrash, 
  faEye, 
  faFilter,
  faSort,
  faStar,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const TutorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('all');
  
  // Mock user ID - in a real app, this would come from authentication
  const tutorId = "mockTutorId123";
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  useEffect(() => {
    fetchCourses();
  }, [sortBy, sortDirection, filter]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Fetch the tutor's courses
      const response = await axios.get(`http://localhost:3000/course/tutor/${tutorId}`, {
        params: {
          sort: sortBy,
          direction: sortDirection,
          status: filter !== 'all' ? filter : undefined
        }
      });
      
      // Add some mock statistics if there's no enrollment data in the response
      const coursesWithMockStats = response.data.courses.map(course => ({
        ...course,
        enrollments: course.enrollments || Math.floor(Math.random() * 100) + 5,
        revenue: course.revenue || (course.price * (course.enrollments || Math.floor(Math.random() * 100) + 5)),
        ratings: course.ratings || {
          average: (Math.random() * 3 + 2).toFixed(1), // Random rating between 2 and 5
          count: Math.floor(Math.random() * 50) + 1
        },
        // Mock enrollment trend data
        enrollmentTrend: Array(6).fill().map((_, i) => ({
          month: new Date(Date.now() - (5-i) * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
          enrollments: Math.floor(Math.random() * 30) + 1
        }))
      }));
      
      setCourses(coursesWithMockStats);
      
      // If there was a selected course, update its data
      if (selectedCourse) {
        const updatedCourse = coursesWithMockStats.find(course => course._id === selectedCourse._id);
        if (updatedCourse) {
          setSelectedCourse(updatedCourse);
          fetchCourseStats(updatedCourse._id);
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch courses');
      setLoading(false);
    }
  };

  const fetchCourseStats = async (courseId) => {
    try {
      // In a real app, you would fetch actual stats from the backend
      // const response = await axios.get(`http://localhost:3000/course/${courseId}/stats`);
      // setStats(response.data);
      
      // For now, we'll use mock data
      const mockCategoryData = [
        { name: 'Beginners', value: 40 },
        { name: 'Intermediate', value: 30 },
        { name: 'Advanced', value: 20 },
        { name: 'Other', value: 10 }
      ];
      
      const mockWeeklyData = Array(7).fill().map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          day: date.toLocaleString('default', { weekday: 'short' }),
          enrollments: Math.floor(Math.random() * 10) + 1
        };
      });
      
      const mockMonthlyData = Array(6).fill().map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return {
          month: date.toLocaleString('default', { month: 'short' }),
          enrollments: Math.floor(Math.random() * 30) + 5
        };
      });
      
      const mockUserFeedback = [
        { rating: 5, count: Math.floor(Math.random() * 40) + 10 },
        { rating: 4, count: Math.floor(Math.random() * 30) + 5 },
        { rating: 3, count: Math.floor(Math.random() * 15) + 3 },
        { rating: 2, count: Math.floor(Math.random() * 8) + 1 },
        { rating: 1, count: Math.floor(Math.random() * 5) }
      ];
      
      setStats({
        categoryBreakdown: mockCategoryData,
        weeklyEnrollments: mockWeeklyData,
        monthlyEnrollments: mockMonthlyData,
        userFeedback: mockUserFeedback,
        completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
        averageWatchTime: Math.floor(Math.random() * 50) + 30 // 30-80 minutes
      });
      
    } catch (err) {
      console.error('Failed to fetch course stats:', err);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    fetchCourseStats(course._id);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  const handleEditCourse = (courseId) => {
    // Navigate to course edit page or open modal
    console.log(`Edit course: ${courseId}`);
    // In a real app: navigate(`/course/edit/${courseId}`);
  };
  
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:3000/course/${courseId}`);
        // Refresh courses list
        fetchCourses();
        if (selectedCourse && selectedCourse._id === courseId) {
          setSelectedCourse(null);
          setStats(null);
        }
      } catch (err) {
        console.error('Failed to delete course:', err);
        alert('Failed to delete the course. Please try again.');
      }
    }
  };
  
  // Format number with comma separators
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const getTotalEnrollments = () => {
    return courses.reduce((total, course) => total + (course.enrollments || 0), 0);
  };
  
  const getTotalRevenue = () => {
    return courses.reduce((total, course) => total + (course.revenue || 0), 0);
  };

  return (
    <div className="flex">
      {/* Main content - 80% width */}
      <div className="w-4/5 p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tutor Dashboard</h1>
          <a 
            href="/create-course" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create New Course
          </a>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-800 text-lg font-semibold">Total Courses</h3>
                <p className="text-3xl font-bold">{courses.length}</p>
              </div>
              <FontAwesomeIcon icon={faBook} className="text-blue-500 text-4xl" />
            </div>
          </div>
          
          <div className="bg-green-100 border border-green-200 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-800 text-lg font-semibold">Total Enrollments</h3>
                <p className="text-3xl font-bold">{formatNumber(getTotalEnrollments())}</p>
              </div>
              <FontAwesomeIcon icon={faUsers} className="text-green-500 text-4xl" />
            </div>
          </div>
          
          <div className="bg-purple-100 border border-purple-200 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-purple-800 text-lg font-semibold">Total Revenue</h3>
                <p className="text-3xl font-bold">${formatNumber(getTotalRevenue())}</p>
              </div>
              <FontAwesomeIcon icon={faChartLine} className="text-purple-500 text-4xl" />
            </div>
          </div>
        </div>
        
        {/* Filters and Sorting */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFilter} className="mr-2 text-gray-600" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="all">All Courses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Sort by:</span>
            <button 
              onClick={() => handleSort('date')}
              className={`px-3 py-1 mx-1 rounded ${sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
            >
              Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              onClick={() => handleSort('enrollments')}
              className={`px-3 py-1 mx-1 rounded ${sortBy === 'enrollments' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
            >
              Enrollments {sortBy === 'enrollments' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              onClick={() => handleSort('rating')}
              className={`px-3 py-1 mx-1 rounded ${sortBy === 'rating' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
            >
              Rating {sortBy === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Course List */}
        {loading ? (
          <div className="text-center py-12">Loading courses...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg mb-4">You haven't created any courses yet.</p>
            <a 
              href="/create-course" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Your First Course
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {courses.map(course => (
              <div 
                key={course._id || course.id} 
                className={`border rounded-lg shadow-sm overflow-hidden ${selectedCourse && selectedCourse._id === course._id ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}
              >
                <div className="flex" onClick={() => handleCourseClick(course)} style={{cursor: 'pointer'}}>
                  {/* Thumbnail */}
                  <div className="w-1/4">
                    <img 
                      src={course.thumbnail || "/api/placeholder/300/200"} 
                      alt={course.title} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  
                  {/* Course details */}
                  <div className="w-2/4 p-4">
                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs mr-3 ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <span className="mr-3">{course.videos?.length || 0} videos</span>
                      <span>Created on {new Date(course.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="w-1/4 p-4 bg-gray-50 border-l">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Enrollments:</span>
                      <span className="font-semibold">{formatNumber(course.enrollments || 0)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-semibold">${formatNumber(course.revenue || 0)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <span className="font-semibold mr-1">{course.ratings?.average || 'N/A'}</span>
                        {course.ratings?.average && (
                          <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                        )}
                      </div>
                    </div>
                    
                    {/* Mini chart for enrollment trend */}
                    {course.enrollmentTrend && (
                      <div className="mt-3 h-16">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={course.enrollmentTrend}>
                            <Line 
                              type="monotone" 
                              dataKey="enrollments" 
                              stroke="#3b82f6" 
                              strokeWidth={2} 
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="bg-gray-100 px-4 py-2 flex justify-end">
                  <button 
                    className="text-blue-600 hover:bg-blue-100 px-3 py-1 rounded mr-2"
                    onClick={() => window.location.href = `/course/${course._id}`}
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-1" /> View
                  </button>
                  <button 
                    className="text-gray-600 hover:bg-gray-200 px-3 py-1 rounded mr-2"
                    onClick={() => handleEditCourse(course._id)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                  </button>
                  <button 
                    className="text-red-600 hover:bg-red-100 px-3 py-1 rounded"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Detailed Course Stats */}
        {selectedCourse && stats && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Performance Analytics: {selectedCourse.title}</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold mb-4">Monthly Enrollments</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.monthlyEnrollments}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="enrollments" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.weeklyEnrollments}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="enrollments" 
                        stroke="#3b82f6" 
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold mb-4">Student Demographics</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold mb-4">User Ratings</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={stats.userFeedback}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="rating" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold mb-4">Completion Metrics</h3>
                <div className="flex flex-col items-center justify-center h-56">
                  <div className="text-center mb-6">
                    <h4 className="text-gray-600 mb-1">Course Completion Rate</h4>
                    <div className="text-4xl font-bold text-blue-600">{stats.completionRate}%</div>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-gray-600 mb-1">Average Watch Time</h4>
                    <div className="text-4xl font-bold text-green-600">{stats.averageWatchTime} min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Sidebar placeholder - 20% width */}
      <div className="w-1/5 bg-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <a href="/create-course" className="block bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-4 text-center">
            New Course
          </a>
          <a href="/messages" className="block bg-gray-500 hover:bg-gray-600 text-white rounded py-2 px-4 text-center">
            Messages
          </a>
          <a href="/profile" className="block bg-gray-500 hover:bg-gray-600 text-white rounded py-2 px-4 text-center">
            Profile
          </a>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Top Performing</h3>
          <div className="space-y-2">
            {loading ? (
              <p className="text-sm text-gray-500">Loading courses...</p>
            ) : courses.length > 0 ? (
              courses
                .sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0))
                .slice(0, 3)
                .map(course => (
                  <div key={`sidebar-${course._id}`} className="bg-white p-2 rounded shadow-sm">
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-600">{course.enrollments} enrollments</p>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500">No courses available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;