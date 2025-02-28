import React, { useState, useEffect } from 'react';
import { BookOpen, Award, TrendingUp, Search, BookOpenCheck, Play, FileText, Code, ThumbsUp, Filter, ArrowUpRight, Sliders, GraduationCap } from 'lucide-react';

// Mock API service for course data
const fetchCourses = async (filters = {}) => {
  // This would be a real API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sample courses data
      const allCourses = [
        {
          id: 1,
          title: "Machine Learning Fundamentals",
          provider: "Coursera",
          instructor: "Andrew Ng",
          rating: 4.8,
          students: 125001,
          price: 49.99,
          duration: "10 weeks",
          level: "Intermediate",
          category: "AI & Machine Learning",
          format: "Video",
          image: "/api/placeholder/400/225",
          trending: true,
          highPaying: true
        },
        {
          id: 2,
          title: "Web3 Development with Solidity",
          provider: "Udemy",
          instructor: "Maximilian Schwarzmüller",
          rating: 4.7,
          students: 78000,
          price: 89.99,
          duration: "24 hours",
          level: "Advanced",
          category: "Web3",
          format: "Interactive",
          image: "/api/placeholder/400/225",
          trending: true,
          highPaying: true
        },
        {
          id: 3,
          title: "Cybersecurity Analyst Path",
          provider: "LinkedIn Learning",
          instructor: "Mike Chapple",
          rating: 4.6,
          students: 45001,
          price: 39.99,
          duration: "28 hours",
          level: "Beginner to Intermediate",
          category: "Cybersecurity",
          format: "Video",
          image: "/api/placeholder/400/225",
          trending: true,
          highPaying: true
        },
        {
          id: 4,
          title: "Fullstack React with NextJS",
          provider: "Frontend Masters",
          instructor: "Scott Moss",
          rating: 4.9,
          students: 32000,
          price: 39.99,
          duration: "12 hours",
          level: "Intermediate",
          category: "Web Development",
          format: "Interactive",
          image: "/api/placeholder/400/225",
          trending: true,
          highPaying: false
        },
        {
          id: 5,
          title: "Data Engineering with Python",
          provider: "edX",
          instructor: "Brian Yu",
          rating: 4.7,
          students: 57000,
          price: 0,
          duration: "8 weeks",
          level: "Intermediate",
          category: "Data Engineering",
          format: "Text",
          image: "/api/placeholder/400/225",
          trending: false,
          highPaying: true
        },
        {
          id: 6,
          title: "Cloud Architecture on AWS",
          provider: "A Cloud Guru",
          instructor: "Ryan Kroonenburg",
          rating: 4.8,
          students: 122000,
          price: 29.99,
          duration: "40 hours",
          level: "Advanced",
          category: "Cloud Computing",
          format: "Video",
          image: "/api/placeholder/400/225",
          trending: true,
          highPaying: true
        },
        {
          id: 7,
          title: "UI/UX Design Principles",
          provider: "Skillshare",
          instructor: "Sarah Doody",
          rating: 4.5,
          students: 47000,
          price: 19.99,
          duration: "15 hours",
          level: "Beginner",
          category: "Design",
          format: "Video",
          image: "/api/placeholder/400/225",
          trending: false,
          highPaying: false
        },
        {
          id: 8,
          title: "DevOps Engineering with Kubernetes",
          provider: "Pluralsight",
          instructor: "Nigel Poulton",
          rating: 4.8,
          students: 35001,
          price: 29.99,
          duration: "22 hours",
          level: "Advanced",
          category: "DevOps",
          format: "Interactive",
          image: "/api/placeholder/400/225",
          trending: true,
          highPaying: true
        }
      ];

      // Apply filters (would be server-side in real implementation)
      let filteredCourses = [...allCourses];
      
      if (filters.category) {
        filteredCourses = filteredCourses.filter(course => 
          course.category === filters.category);
      }
      
      if (filters.format) {
        filteredCourses = filteredCourses.filter(course => 
          course.format === filters.format);
      }
      
      if (filters.level) {
        filteredCourses = filteredCourses.filter(course => 
          course.level.includes(filters.level));
      }
      
      if (filters.trending) {
        filteredCourses = filteredCourses.filter(course => 
          course.trending === true);
      }
      
      if (filters.highPaying) {
        filteredCourses = filteredCourses.filter(course => 
          course.highPaying === true);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(searchLower) || 
          course.category.toLowerCase().includes(searchLower) ||
          course.provider.toLowerCase().includes(searchLower));
      }
      
      resolve(filteredCourses);
    }, 800); // Simulate network delay
  });
};

const CourseAggregator = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    format: "",
    level: "",
    trending: false,
    highPaying: false,
    search: ""
  });
  const [searchInput, setSearchInput] = useState("");
  const [userLearningStyle, setUserLearningStyle] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch initial courses
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const data = await fetchCourses();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCourses();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      try {
        const data = await fetchCourses(filters);
        setFilteredCourses(data);
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setLoading(false);
      }
    };
    
    applyFilters();
  }, [filters]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({...filters, search: searchInput});
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters({...filters, [name]: value});
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: "",
      format: "",
      level: "",
      trending: false,
      highPaying: false,
      search: ""
    });
    setSearchInput("");
  };

  // Set learning style and filter by format
  const setLearningStyle = (style) => {
    setUserLearningStyle(style);
    let format = "";
    
    switch(style) {
      case "visual":
        format = "Video";
        break;
      case "reading":
        format = "Text";
        break;
      case "hands-on":
        format = "Interactive";
        break;
      default:
        format = "";
    }
    
    setFilters({...filters, format});
  };

  // Get format icon
  const getFormatIcon = (format) => {
    switch(format) {
      case "Video":
        return <Play className="h-4 w-4" />;
      case "Text":
        return <FileText className="h-4 w-4" />;
      case "Interactive":
        return <Code className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  // Categories for filter
  const categories = [
    "AI & Machine Learning",
    "Web3",
    "Cybersecurity",
    "Web Development",
    "Data Engineering",
    "Cloud Computing",
    "Design",
    "DevOps"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI-Driven Course Recommendations
          </h1>
          <p className="text-gray-600">
            Discover courses tailored to your learning style and market demands
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          
          <button 
            onClick={clearFilters}
            className="flex items-center bg-blue-50 text-blue-600 border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-100 transition-colors"
          >
            <Sliders className="h-4 w-4 mr-2" />
            Clear
          </button>
        </div>
      </div>
      
      {/* Learning Style Selector */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 mb-8 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          What's your preferred learning style?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setLearningStyle("visual")}
            className={`flex items-center justify-center p-4 rounded-lg transition-all ${
              userLearningStyle === "visual"
                ? "bg-white text-blue-600 shadow-md transform -translate-y-1"
                : "bg-blue-400 bg-opacity-20 text-white hover:bg-opacity-30"
            }`}
          >
            <Play className="h-5 w-5 mr-2" />
            <span className="font-medium">Visual Learner (Videos)</span>
          </button>
          
          <button
            onClick={() => setLearningStyle("reading")}
            className={`flex items-center justify-center p-4 rounded-lg transition-all ${
              userLearningStyle === "reading"
                ? "bg-white text-blue-600 shadow-md transform -translate-y-1"
                : "bg-blue-400 bg-opacity-20 text-white hover:bg-opacity-30"
            }`}
          >
            <FileText className="h-5 w-5 mr-2" />
            <span className="font-medium">Reading Learner (Text)</span>
          </button>
          
          <button
            onClick={() => setLearningStyle("hands-on")}
            className={`flex items-center justify-center p-4 rounded-lg transition-all ${
              userLearningStyle === "hands-on"
                ? "bg-white text-blue-600 shadow-md transform -translate-y-1"
                : "bg-blue-400 bg-opacity-20 text-white hover:bg-opacity-30"
            }`}
          >
            <Code className="h-5 w-5 mr-2" />
            <span className="font-medium">Hands-on Learner (Interactive)</span>
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search courses, skills, or providers..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <button 
            type="submit"
            className="absolute right-3 top-2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
        
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center">
              <Filter className="h-4 w-4 mr-2 text-blue-500" />
              Advanced Filters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Format filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <select
                  value={filters.format}
                  onChange={(e) => handleFilterChange("format", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Formats</option>
                  <option value="Video">Video</option>
                  <option value="Text">Text</option>
                  <option value="Interactive">Interactive</option>
                </select>
              </div>
              
              {/* Level filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={filters.level}
                  onChange={(e) => handleFilterChange("level", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              
              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trending"
                    checked={filters.trending}
                    onChange={(e) => handleFilterChange("trending", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="trending" className="ml-2 text-sm text-gray-700 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    Trending Skills
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="highPaying"
                    checked={filters.highPaying}
                    onChange={(e) => handleFilterChange("highPaying", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="highPaying" className="ml-2 text-sm text-gray-700 flex items-center">
                    <Award className="h-4 w-4 text-yellow-500 mr-1" />
                    High-Paying Skills
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Active filters display */}
        {(filters.category || filters.format || filters.level || filters.trending || filters.highPaying || filters.search) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {filters.search && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                Search: {filters.search}
                <button 
                  onClick={() => {
                    setFilters({...filters, search: ""});
                    setSearchInput("");
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.category && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                Category: {filters.category}
                <button 
                  onClick={() => handleFilterChange("category", "")}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.format && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                Format: {filters.format}
                <button 
                  onClick={() => {
                    handleFilterChange("format", "");
                    setUserLearningStyle("");
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.level && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                Level: {filters.level}
                <button 
                  onClick={() => handleFilterChange("level", "")}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.trending && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                Trending Skills
                <button 
                  onClick={() => handleFilterChange("trending", false)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.highPaying && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                High-Paying Skills
                <button 
                  onClick={() => handleFilterChange("highPaying", false)}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Trending Skills Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
            Trending Market Skills
          </h2>
          
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            View all <ArrowUpRight className="h-3 w-3 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 shadow-md transform transition-transform hover:scale-105">
            <h3 className="font-semibold mb-1">AI & Machine Learning</h3>
            <p className="text-xs text-purple-100 mb-2">Average Salary: $120k</p>
            <button className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-2 py-1 transition-colors">
              Explore Courses
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md transform transition-transform hover:scale-105">
            <h3 className="font-semibold mb-1">Web3 Development</h3>
            <p className="text-xs text-blue-100 mb-2">Average Salary: $140k</p>
            <button className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-2 py-1 transition-colors">
              Explore Courses
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 shadow-md transform transition-transform hover:scale-105">
            <h3 className="font-semibold mb-1">Cybersecurity</h3>
            <p className="text-xs text-green-100 mb-2">Average Salary: $110k</p>
            <button className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-2 py-1 transition-colors">
              Explore Courses
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4 shadow-md transform transition-transform hover:scale-105">
            <h3 className="font-semibold mb-1">Cloud Architecture</h3>
            <p className="text-xs text-red-100 mb-2">Average Salary: $130k</p>
            <button className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-2 py-1 transition-colors">
              Explore Courses
            </button>
          </div>
        </div>
      </div>
      
      {/* Courses list */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpenCheck className="h-6 w-6 text-blue-500 mr-2" />
          Recommended Courses
          {userLearningStyle && (
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {userLearningStyle === "visual" && "Video Courses"}
              {userLearningStyle === "reading" && "Text-based Courses"}
              {userLearningStyle === "hands-on" && "Interactive Courses"}
            </span>
          )}
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
            <button 
              onClick={clearFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 transition-all hover:shadow-lg hover:border-blue-200">
                <div className="relative">
                  <img src={'https://tse2.mm.bing.net/th?id=OIP.UrJYnszemYRpIJ69pt1RJgHaDR&pid=Api&P=0&h=180'} alt={course.title} className="w-full h-48 object-cover" />
                  
                  <div className="absolute top-2 right-2 flex flex-col space-y-1">
                    {course.trending && (
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </span>
                    )}
                    
                    {course.highPaying && (
                      <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        High-Paying
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                    {getFormatIcon(course.format)}
                    <span className="ml-1">{course.format}</span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {course.category}
                    </span>
                    <span className="flex items-center text-sm font-medium text-gray-700">
                      <ThumbsUp className="h-3 w-3 text-yellow-500 mr-1" />
                      {course.rating}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    by {course.instructor} • {course.provider}
                  </p>
                  
                  <div className="flex flex-wrap text-xs text-gray-600 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded-md mr-2 mb-2 flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {course.duration}
                    </span>
                    
                    <span className="bg-gray-100 px-2 py-1 rounded-md mr-2 mb-2">
                      {course.level}
                    </span>
                    
                    <span className="bg-gray-100 px-2 py-1 rounded-md mb-2 flex items-center">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {course.students.toLocaleString()} students
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                    
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Technology Stack Information */}
      <div className="mt-16 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Technology Stack</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Retrieval-Augmented Generation (RAG)</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Our system uses RAG technology to fetch the latest courses from various learning platforms in real-time. This ensures you always have access to up-to-date courses and materials.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">Real-time APIs</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">Vector Search</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">Knowledge Retrieval</span>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Advanced Recommendation Filtering</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              We combine collaborative filtering with content-based filtering to provide highly personalized course recommendations based on your learning style, interests, and career goals.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">Collaborative Filtering</span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">Content-based Filtering</span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">Personalization Engine</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-3">How Our AI Works For You</h3>
          <p className="mb-4">
            Our system analyzes thousands of courses across multiple platforms, considering factors like content quality, instructor ratings, learning outcomes, and user feedback to recommend the perfect courses for your needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Personalized Learning Paths</h4>
              <p className="text-sm text-blue-100">
                Create customized learning journeys based on your skill level and career goals
              </p>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Market Trend Analysis</h4>
              <p className="text-sm text-blue-100">
                Stay ahead with courses on trending skills in high demand by employers
              </p>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Learning Style Matching</h4>
              <p className="text-sm text-blue-100">
                Find courses that match your preferred way of learning for better results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAggregator;