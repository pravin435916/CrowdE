import React, { useState } from 'react';
import { MapPin, AlertTriangle, Users, Search, Bell, Calendar, Heart, Moon, Sun, Menu, X } from 'lucide-react';
import crowd from '../assets/crowd.jpg';
// Card Component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white bg-opacity-90 text-gray-800 shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300 rounded-lg p-6 flex flex-col items-center border-t-4 border-amber-500">
    <div className="bg-amber-100 p-3 rounded-full mb-4">
      <Icon className="w-8 h-8 text-amber-600" />
    </div>
    <h2 className="text-xl font-semibold mb-2 text-amber-800">{title}</h2>
    <p className="text-center text-gray-600">{description}</p>
  </div>
);

// Event Card Component
const EventCard = ({ title, date, location, attendees }) => (
  <div className="bg-white bg-opacity-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="h-32 bg-gradient-to-r from-amber-400 to-orange-500 flex items-end p-4">
      <h3 className="text-white font-bold text-xl">{title}</h3>
    </div>
    <div className="p-4">
      <div className="flex items-center mb-2">
        <Calendar className="w-4 h-4 text-amber-600 mr-2" />
        <span className="text-gray-700 text-sm">{date}</span>
      </div>
      <div className="flex items-center mb-2">
        <MapPin className="w-4 h-4 text-amber-600 mr-2" />
        <span className="text-gray-700 text-sm">{location}</span>
      </div>
      <div className="flex items-center">
        <Users className="w-4 h-4 text-amber-600 mr-2" />
        <span className="text-gray-700 text-sm">{attendees} expected</span>
      </div>
      <button className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md transition-colors duration-300">
        View Details
      </button>
    </div>
  </div>
);

// Navigation Component
const Navigation = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="w-full bg-white bg-opacity-90 shadow-md py-4 px-6 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Heart className="w-8 h-8 text-amber-600 mr-2" />
          <span className="text-2xl font-bold text-amber-800">CrowdE</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors duration-300">Home</a>
          <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors duration-300">Events</a>
          <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors duration-300">Safety Measures</a>
          <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors duration-300">About</a>
          <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors duration-300">Contact</a>
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors duration-300"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6 text-amber-800" /> : <Menu className="w-6 h-6 text-amber-800" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 absolute left-4 right-4">
          <div className="flex flex-col space-y-3">
            <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors duration-300 py-2 border-b border-gray-100">Home</a>
            <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors duration-300 py-2 border-b border-gray-100">Events</a>
            <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors duration-300 py-2 border-b border-gray-100">Safety Measures</a>
            <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors duration-300 py-2 border-b border-gray-100">About</a>
            <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors duration-300 py-2">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

// Main Component
const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-amber-50 text-gray-800'} transition-colors duration-300`}>
      <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <image src={crowd} alt="Crowd" className=" inset-0 object-cover w-full h-screen z-50" />
      
      {/* Hero Section with Background Image */}
      <div className="relative pt-24 pb-32 px-6 flex flex-col items-center justify-center text-center">
        {/* Background Image with Overlay */}
        {/* <div className="absolute inset-0 bg-cover bg-center" style={{ 
          backgroundImage: crowd,
          filter: "brightness(0.5)"
        }}></div> */}
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Sacred Gatherings, <span className="text-amber-400">Safely Managed</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            AI-powered crowd management system for temples, pilgrimages, and spiritual events — ensuring safety while preserving devotional experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg shadow-lg transition-colors duration-300 text-lg font-medium">
              Plan Your Pilgrimage
            </button>
            <button className="bg-white hover:bg-gray-100 text-amber-800 px-8 py-4 rounded-lg shadow-lg transition-colors duration-300 text-lg font-medium">
              View Safety Measures
            </button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
            <Heart className="w-8 h-8 text-amber-500 mr-2" />
            <span className={isDarkMode ? 'text-white' : 'text-amber-800'}>Divine Care Features</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={MapPin} 
              title="Sacred Space Monitoring" 
              description="Track real-time devotee density with AI-powered heatmaps to ensure comfortable worship experience."
            />
            <FeatureCard 
              icon={AlertTriangle} 
              title="Divine Safety Alerts" 
              description="AI detects potential overcrowding and sends real-time alerts to maintain sanctity and safety."
            />
            <FeatureCard 
              icon={Users} 
              title="Blessed Path Navigation" 
              description="AI-driven suggestions for safe and efficient pathways through temples and holy sites."
            />
          </div>
        </div>
      </div>
      
      {/* Search & Navigation Section */}
      <div className="py-12 px-6 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Find Sacred Events</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search temples, events..."
                className="w-full px-5 py-4 rounded-lg shadow-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 pl-12"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            </div>
            
            <select className="w-full md:w-auto px-5 py-4 rounded-lg shadow-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
              <option value="">All Event Types</option>
              <option value="temple">Temple Festivals</option>
              <option value="pilgrimage">Pilgrimages</option>
              <option value="ceremony">Sacred Ceremonies</option>
            </select>
            
            <button className="w-full md:w-auto bg-amber-800 hover:bg-amber-900 text-white px-8 py-4 rounded-lg shadow-lg transition-colors duration-300 font-medium">
              Search
            </button>
          </div>
        </div>
      </div>
      
      {/* Upcoming Events Section */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-amber-500 mr-2" />
            <span className={isDarkMode ? 'text-white' : 'text-amber-800'}>Upcoming Sacred Events</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <EventCard 
              title="Temple Festival" 
              date="March 15, 2025" 
              location="Golden Temple, Amritsar" 
              attendees="10,000+"
            />
            <EventCard 
              title="Annual Pilgrimage" 
              date="April 2, 2025" 
              location="Varanasi Ghats" 
              attendees="25,000+"
            />
            <EventCard 
              title="Diwali Celebration" 
              date="November 12, 2025" 
              location="Multiple Locations" 
              attendees="100,000+"
            />
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg shadow-lg transition-colors duration-300 font-medium inline-flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              View All Events
            </button>
          </div>
        </div>
      </div>
      
      {/* Crowd Alert System Section */}
      <div className="py-16 px-6 bg-amber-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-amber-800 mb-6">Real-time Devotee Capacity Alerts</h2>
                <p className="text-gray-600 mb-6">
                  Our AI-powered system monitors crowd density in real-time and sends alerts to ensure comfortable and safe worship experiences for all devotees.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <Bell className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Comfortable Capacity</h3>
                      <p className="text-gray-600 text-sm">Space for devotional activities with comfortable movement.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-yellow-100 p-2 rounded-full mr-4">
                      <Bell className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Moderate Density</h3>
                      <p className="text-gray-600 text-sm">Movement is restricted but still safe. Consider alternate timing.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-4">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">High Density Alert</h3>
                      <p className="text-gray-600 text-sm">Wait times are long. Entry may be regulated for safety.</p>
                    </div>
                  </div>
                </div>
                
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg shadow-lg transition-colors duration-300 font-medium">
                  Subscribe to Alerts
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-8 md:p-12 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
                  <h3 className="text-xl font-bold text-amber-800 mb-4">Current Status</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Golden Temple</span>
                        <span className="text-green-600 font-medium">Comfortable</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full w-2/5"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Varanasi Ghats</span>
                        <span className="text-yellow-600 font-medium">Moderate</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full w-3/5"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Tirupati Temple</span>
                        <span className="text-red-600 font-medium">High</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-amber-800 text-amber-100 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <Heart className="w-8 h-8 text-amber-300 mr-2" />
              <span className="text-2xl font-bold text-white">CrowdE</span>
            </div>
            <p className="text-amber-200">
              AI-powered crowd management for sacred and spiritual gatherings.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-amber-200 hover:text-white transition-colors duration-300">Home</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white transition-colors duration-300">Events</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white transition-colors duration-300">Safety Measures</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white transition-colors duration-300">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Popular Destinations</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-amber-200 hover:text-white transition-colors duration-300">Golden Temple</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white transition-colors duration-300">Varanasi</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white transition-colors duration-300">Tirupati</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white transition-colors duration-300">Haridwar</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Stay Connected</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="bg-amber-700 hover:bg-amber-600 p-2 rounded-full transition-colors duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="bg-amber-700 hover:bg-amber-600 p-2 rounded-full transition-colors duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="bg-amber-700 hover:bg-amber-600 p-2 rounded-full transition-colors duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
              </a>
            </div>
            <form>
              <label className="block text-white mb-2">Subscribe to updates</label>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
                />
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-lg transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-amber-700 text-center text-amber-300">
          <p>&copy; 2025 CrowdE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;