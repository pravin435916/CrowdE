import React, { useState, useEffect } from 'react';
import { BookOpen, Award, TrendingUp, Search, FileText, Code, Play, Loader } from 'lucide-react';
import { chatSession } from '../config/gemini'; // Assuming this is your Gemini API config

const CoureAggregator = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [platforms, setPlatforms] = useState(['Udemy', 'Coursera', 'edX', 'Nptel']);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch trending courses using Gemini API when component mounts
  useEffect(() => {
    fetchTrendingCourses();
  }, []);

  // Function to fetch trending courses using Gemini API
  const fetchTrendingCourses = async (customQuery = '') => {
    setLoading(true);
    setError(null);

    try {
      // Create prompt for Gemini API
      const prompt = customQuery || 
        `Find Top 4 trending courses from ${platforms.join(', ')}. 
        
        Return the response as a valid JSON object with this structure:
        {
          "courses": [
            {
              "title": "Course Title",
              "platform": "Platform Name",
              "instructor": "Instructor Name",
              "description": "Brief course description",
              "rating": 4.7,
              "students": 125000,
              "price": 49.99,
              "duration": "10 weeks",
              "level": "Beginner/Intermediate/Advanced",
              "category": "Category (e.g. Web Development)",
              "format": "Video/Text/Interactive",
              "link": "https://link-to-course",
              "image": "https://image-url"
            }
          ]
        }
        
        Make sure to include real, accurate, and currently trending courses. The JSON should be valid with no additional text.`;
      
      const result = await chatSession.sendMessage(prompt);
      const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      // Extract JSON from response (in case there's additional text)
      const jsonMatch = responseText.match(/(\{[\s\S]*\})/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      
      try {
        const parsedData = JSON.parse(jsonString);
        
        if (parsedData.courses && Array.isArray(parsedData.courses)) {
          // Enhance course data with random placeholder images
          const enhancedCourses = parsedData.courses.map(course => ({
            ...course,
            // Generate a random placeholder if no image is provided
            image: `https://png.pngtree.com/png-clipart/20221020/original/pngtree-online-course-banner-sticker-png-image_8708415.png`
          }));
          
          setCourses(enhancedCourses);
        } else {
          setError('Invalid response format from AI');
        }
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        setError('Failed to parse course data');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch trending courses');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Handle custom prompt search
  const handleCustomSearch = (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    
    setIsSearching(true);
    fetchTrendingCourses(customPrompt);
  };

  // Get format icon based on course format
  const getFormatIcon = (format) => {
    if (!format) return <BookOpen className="h-4 w-4" />;
    
    const formatLower = format.toLowerCase();
    if (formatLower.includes('video')) return <Play className="h-4 w-4" />;
    if (formatLower.includes('text')) return <FileText className="h-4 w-4" />;
    if (formatLower.includes('interactive')) return <Code className="h-4 w-4" />;
    return <BookOpen className="h-4 w-4" />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          AI-Powered Course Finder
        </h1>
        <p className="text-gray-600">
          Discover trending courses from top platforms using AI
        </p>
      </div>
      
      {/* Search form */}
      <div className="mb-8">
        <form onSubmit={handleCustomSearch} className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex-1">
            <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your search query
            </label>
            <input
              type="text"
              id="customPrompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Find mobile app development courses for beginners..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Example: "Find Python courses for machine learning beginners" or "Show me free web development courses"
            </p>
          </div>
          
          <div className="flex items-center">
            <button 
              type="submit"
              disabled={isSearching}
              className={`px-6 py-2 ${isSearching ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg font-medium transition-colors flex items-center`}
            >
              {isSearching ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Platform selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Platforms</h2>
        <div className="flex flex-wrap gap-2">
          {['Udemy', 'Coursera', 'edX', 'Nptel', 'FutureLearn', 'Pluralsight', 'LinkedIn Learning', 'Skillshare'].map((platform) => (
            <button
              key={platform}
              onClick={() => {
                if (platforms.includes(platform)) {
                  setPlatforms(platforms.filter(p => p !== platform));
                } else {
                  setPlatforms([...platforms, platform]);
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                platforms.includes(platform)
                  ? 'bg-blue-100 text-blue-800 border-blue-200 border'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button 
            onClick={() => fetchTrendingCourses()}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            {loading ? 'Loading...' : 'Refresh trending courses'}
          </button>
        </div>
      </div>
      
      {/* Results section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
          Trending Courses
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500">Fetching trending courses...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg text-center">
            <p className="font-medium mb-2">{error}</p>
            <button 
              onClick={() => fetchTrendingCourses()}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 px-4 py-8 rounded-lg text-center">
            <p className="text-gray-700 mb-2">No courses found</p>
            <button 
              onClick={() => fetchTrendingCourses()}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 transition-all hover:shadow-lg hover:border-blue-200 flex flex-col"
              >
                <div className="relative">
                  <img 
                    src={course.image } 
                    alt={course.title} 
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(course.title || 'Course')}`;
                    }}
                  />
                  
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {course.platform}
                    </span>
                  </div>
                  
                  {course.format && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                      {getFormatIcon(course.format)}
                      <span className="ml-1">{course.format}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {course.category || 'Education'}
                    </span>
                    {course.rating && (
                      <span className="flex items-center text-sm font-medium text-gray-700">
                        <Award className="h-3 w-3 text-yellow-500 mr-1" />
                        {course.rating}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 flex-grow">
                    {course.title}
                  </h3>
                  
                  {course.instructor && (
                    <p className="text-sm text-gray-500 mb-2">
                      by {course.instructor}
                    </p>
                  )}
                  
                  {course.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap text-xs text-gray-600 mb-3">
                    {course.duration && (
                      <span className="bg-gray-100 px-2 py-1 rounded-md mr-2 mb-2 flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {course.duration}
                      </span>
                    )}
                    
                    {course.level && (
                      <span className="bg-gray-100 px-2 py-1 rounded-md mr-2 mb-2">
                        {course.level}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-gray-800">
                      {course.price === 0 || course.price === "0" || course.price === "Free" 
                        ? "Free" 
                        : typeof course.price === 'number' 
                          ? `$${course.price}` 
                          : course.price || 'Paid'}
                    </span>
                    
                    <a 
                      href={course.link || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      View Course
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoureAggregator;