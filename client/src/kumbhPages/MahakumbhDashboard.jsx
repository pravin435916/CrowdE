import React, { useState, useEffect } from "react";
import { 
  Users, 
  AlertTriangle, 
  MapPin, 
  BarChart3, 
  Radio, 
  BellRing, 
  MessageSquare, 
  UserCog, 
  ArrowUpRight,
  Clock,
  ChevronDown,
  Megaphone,
  PieChart,
  UserPlus,
  ArrowLeft,
  ArrowRight,
  Settings,
  Lock,
  Droplet,
  Umbrella,
  Landmark,
  Wind,
  Thermometer,
  Waves
} from "lucide-react";

// Reusable stat card component
const StatCard = ({ title, value, icon: Icon, change, color }) => (
  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
    <div className="flex justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {change && (
          <p className={`text-xs font-medium flex items-center mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}% 
            <ArrowUpRight className={`w-3 h-3 ml-1 ${change < 0 && 'transform rotate-180'}`} />
            <span className="text-gray-500 ml-1">from last hour</span>
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full bg-opacity-20 ${color}`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

// Alert component
const Alert = ({ level, message, time, location, onDismiss, onRespond }) => {
  const getBgColor = () => {
    switch(level) {
      case 'high': return 'bg-red-100 border-red-500';
      case 'medium': return 'bg-yellow-100 border-yellow-500';
      case 'low': return 'bg-blue-100 border-blue-500';
      default: return 'bg-gray-100 border-gray-500';
    }
  };

  const getTextColor = () => {
    switch(level) {
      case 'high': return 'text-red-800';
      case 'medium': return 'text-yellow-800';
      case 'low': return 'text-blue-800';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className={`mb-3 p-4 rounded-lg border-l-4 ${getBgColor()}`}>
      <div className="flex justify-between">
        <div className="flex items-start">
          <AlertTriangle className={`w-5 h-5 mr-2 mt-0.5 ${getTextColor()}`} />
          <div>
            <div className="flex items-center">
              <h4 className={`font-bold ${getTextColor()}`}>
                {level === 'high' ? 'Critical Alert' : level === 'medium' ? 'Warning' : 'Notice'}
              </h4>
              <span className="text-xs text-gray-500 ml-2">{time}</span>
            </div>
            <p className="text-gray-700">{message}</p>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> {location}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onRespond}
            className="text-xs bg-white text-gray-700 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 transition-colors duration-200"
          >
            Respond
          </button>
          <button 
            onClick={onDismiss}
            className="text-xs bg-gray-200 text-gray-700 rounded px-2 py-1 hover:bg-gray-300 transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// Security staff card component
const StaffCard = ({ name, area, status, imageId }) => {
  const getStatusColor = () => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'break': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 flex items-center">
      <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-800 font-bold mr-3">
        {name.charAt(0)}
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-gray-800">{name}</h4>
        <p className="text-xs text-gray-500 flex items-center">
          <MapPin className="w-3 h-3 mr-1" /> {area}
        </p>
      </div>
      <div className="flex items-center">
        <span className={`w-2 h-2 rounded-full ${getStatusColor()} mr-1`}></span>
        <span className="text-xs text-gray-500">{status}</span>
      </div>
    </div>
  );
};

// Area Status component
const AreaStatus = ({ name, capacity, current, status }) => {
  // Calculate percentage of capacity
  const percentage = Math.round((current / capacity) * 100);
  
  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 60) return 'bg-green-500';
    if (percentage < 85) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border-t-4 border-orange-500">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-800">{name}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          status === 'Open' ? 'bg-green-100 text-green-800' : 
          status === 'Limited' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {status}
        </span>
      </div>
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>Current: {current.toLocaleString()}</span>
        <span>Capacity: {capacity.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${getColor()}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-3 flex justify-end space-x-2">
        <button className="text-xs bg-orange-50 text-orange-800 border border-orange-200 rounded px-2 py-1 hover:bg-orange-100 transition-colors duration-200">
          Divert Flow
        </button>
        <button className="text-xs bg-orange-600 text-white rounded px-2 py-1 hover:bg-orange-700 transition-colors duration-200">
          Actions
        </button>
      </div>
    </div>
  );
};

// Weather component
const WeatherInfo = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <h3 className="text-sm font-bold text-blue-800 mb-2">Weather Conditions</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="flex flex-col items-center">
            <Thermometer className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-700 mt-1">28°C</span>
            <span className="text-xs text-gray-500">Temperature</span>
          </div>
        </div>
        <div>
          <div className="flex flex-col items-center">
            <Droplet className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-700 mt-1">65%</span>
            <span className="text-xs text-gray-500">Humidity</span>
          </div>
        </div>
        <div>
          <div className="flex flex-col items-center">
            <Wind className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-700 mt-1">12 km/h</span>
            <span className="text-xs text-gray-500">Wind</span>
          </div>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-blue-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Waves className="w-4 h-4 text-blue-600 mr-1" />
            <span className="text-xs text-gray-700">River Level:</span>
          </div>
          <span className="text-xs font-medium text-green-700">Normal</span>
        </div>
      </div>
    </div>
  );
};

const MahakumbhDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [alerts, setAlerts] = useState([
    { 
      id: 1, 
      level: 'high', 
      message: 'Dangerous crowd density at Har Ki Pauri', 
      time: '2 mins ago', 
      location: 'Har Ki Pauri Ghat' 
    },
    { 
      id: 2, 
      level: 'medium', 
      message: 'Slow movement at Sector 12 bridge crossing', 
      time: '5 mins ago', 
      location: 'Sector 12 - Bridge Access' 
    },
    { 
      id: 3, 
      level: 'low', 
      message: 'Medical assistance required at Camp Area 4', 
      time: '10 mins ago', 
      location: 'Camp Area 4 - Section B' 
    }
  ]);
  
  // Total visitor stats
  const [visitorStats, setVisitorStats] = useState({
    total: 3285000,
    inTransit: 456000,
    atGhats: 975000,
    inCamps: 1854000,
    change: 5.2
  });
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update current time
      setCurrentTime(new Date());
      
      // Randomly update total visitors (fluctuations)
      const visitorChange = Math.floor(Math.random() * 10000) - 2000;111111111
      const transitChange = Math.floor(Math.random() * 5000) - 2000;
      const ghatChange = Math.floor(Math.random() * 8000) - 3000;
      
      setVisitorStats(prev => ({
        ...prev,
        total: Math.max(3000000, prev.total + visitorChange),
        inTransit: Math.max(100000, prev.inTransit + transitChange),
        atGhats: Math.max(500000, prev.atGhats + ghatChange),
        inCamps: Math.max(1000000, prev.total + visitorChange - transitChange - ghatChange),
        change: visitorChange > 0 ? 5.2 + Math.random() * 2 : -1 * (Math.random() * 2)
      }));
      
      // Occasionally add new alerts (15% chance)
      if (Math.random() < 0.15) {
        const alertMessages = [
          "Crowd density increasing at Triveni Ghat",
          "Slow movement reported at Sector 8 entrance",
          "Medical team requested at Ashram Area",
          "Temporary water shortage at Camp Area 7",
          "Traffic congestion on Haridwar-Rishikesh Road"
        ];
        
        const alertLocations = [
          "Triveni Ghat", 
          "Sector 8 - Main Entrance", 
          "Ashram Area - Block C",
          "Camp Area 7 - Water Station 3",
          "Haridwar-Rishikesh Road - Checkpoint 2"
        ];
        
        const randomMessage = alertMessages[Math.floor(Math.random() * alertMessages.length)];
        const randomLocation = alertLocations[Math.floor(Math.random() * alertLocations.length)];
        
        const newAlert = {
          id: Date.now(),
          level: Math.random() < 0.2 ? 'high' : Math.random() < 0.5 ? 'medium' : 'low',
          message: randomMessage,
          time: 'Just now',
          location: randomLocation
        };
        
        setAlerts(prev => [newAlert, ...prev].slice(0, 5));
      }
      
      // Update ghat areas with fluctuating crowd numbers
      setGhatAreas(prev => 
        prev.map(area => {
          const fluctuation = Math.floor(Math.random() * (area.capacity * 0.05)) - (area.capacity * 0.02);
          const newCurrent = Math.max(1000, Math.min(area.capacity * 1.1, area.current + fluctuation));
          const percentage = (newCurrent / area.capacity) * 100;
          
          let newStatus = area.status;
          if (percentage > 90) newStatus = 'Restricted';
          else if (percentage > 75) newStatus = 'Limited';
          else newStatus = 'Open';
          
          return {
            ...area,
            current: newCurrent,
            status: newStatus
          };
        })
      );
      
      // Update camp areas with smaller fluctuations
      setCampAreas(prev => 
        prev.map(area => {
          const fluctuation = Math.floor(Math.random() * (area.capacity * 0.02)) - (area.capacity * 0.01);
          const newCurrent = Math.max(1000, Math.min(area.capacity * 1.05, area.current + fluctuation));
          const percentage = (newCurrent / area.capacity) * 100;
          
          let newStatus = area.status;
          if (percentage > 90) newStatus = 'Full';
          else if (percentage > 75) newStatus = 'Limited';
          else newStatus = 'Available';
          
          return {
            ...area,
            current: newCurrent,
            status: newStatus
          };
        })
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle alert dismiss
  const handleDismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
  // Staff data
  const securityStaff = [
    { id: 1, name: 'Rajesh Kumar', area: 'Har Ki Pauri', status: 'active' },
    { id: 2, name: 'Priya Singh', area: 'Sector 8 Control', status: 'active' },
    { id: 3, name: 'Mohan Patel', area: 'Bridge Crossing', status: 'break' },
    { id: 4, name: 'Sanjay Verma', area: 'Emergency Response', status: 'active' },
    { id: 5, name: 'Lakshmi Devi', area: 'Medical Coordination', status: 'active' },
    { id: 6, name: 'Amit Sharma', area: 'Traffic Control', status: 'break' },
    { id: 7, name: 'Vijay Singh', area: 'Camp Security', status: 'active' }
  ];
  
  // Ghat area data
  const [ghatAreas, setGhatAreas] = useState([
    { id: 1, name: 'Har Ki Pauri', capacity: 200000, current: 185000, status: 'Limited' },
    { id: 2, name: 'Triveni Ghat', capacity: 150000, current: 137000, status: 'Limited' },
    { id: 3, name: 'Gau Ghat', capacity: 100000, current: 58000, status: 'Open' },
    { id: 4, name: 'Subhash Ghat', capacity: 120000, current: 112000, status: 'Limited' },
    { id: 5, name: 'Asthi Pravah Ghat', capacity: 80000, current: 45000, status: 'Open' },
    { id: 6, name: 'VIP Ghat', capacity: 25000, current: 12000, status: 'Open' }
  ]);
  
  // Camp area data
  const [campAreas, setCampAreas] = useState([
    { id: 1, name: 'Sector 9 Camps', capacity: 500000, current: 478000, status: 'Limited' },
    { id: 2, name: 'Sector 12 Camps', capacity: 450000, current: 412000, status: 'Limited' },
    { id: 3, name: 'Ashram Area', capacity: 300000, current: 285000, status: 'Limited' },
    { id: 4, name: 'Temporary Tents', capacity: 600000, current: 510000, status: 'Limited' }
  ]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar */}
      <header className="bg-orange-800 text-white shadow-md py-2 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          <h1 className="text-xl font-bold">Mahakumbh Authority Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-orange-200">
            <Clock className="w-4 h-4 mr-1" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
          
          <div className="relative">
            <button className="flex items-center space-x-1 bg-orange-700 rounded-full px-3 py-1">
              <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-orange-900 font-bold">
                A
              </div>
              <span>Admin</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-1">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === "overview" 
                ? "bg-orange-100 text-orange-800" 
                : "text-gray-600 hover:text-orange-800 hover:bg-orange-50"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === "security" 
                ? "bg-orange-100 text-orange-800" 
                : "text-gray-600 hover:text-orange-800 hover:bg-orange-50"
              }`}
              onClick={() => setActiveTab("security")}
            >
              <UserCog className="w-4 h-4 mr-2" />
              Security
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === "alerts" 
                ? "bg-orange-100 text-orange-800" 
                : "text-gray-600 hover:text-orange-800 hover:bg-orange-50"
              }`}
              onClick={() => setActiveTab("alerts")}
            >
              <BellRing className="w-4 h-4 mr-2" />
              Alerts
              {alerts.length > 0 && (
                <span className="ml-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === "communication" 
                ? "bg-orange-100 text-orange-800" 
                : "text-gray-600 hover:text-orange-800 hover:bg-orange-50"
              }`}
              onClick={() => setActiveTab("communication")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Communication
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === "river" 
                ? "bg-orange-100 text-orange-800" 
                : "text-gray-600 hover:text-orange-800 hover:bg-orange-50"
              }`}
              onClick={() => setActiveTab("river")}
            >
              <Waves className="w-4 h-4 mr-2" />
              River Monitoring
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === "settings" 
                ? "bg-orange-100 text-orange-800" 
                : "text-gray-600 hover:text-orange-800 hover:bg-orange-50"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
        
        {/* Title Bar with Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mahakumbh 2025</h1>
            <p className="text-gray-500 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Haridwar, Uttarakhand
            </p>
          </div>
          
          <div className="flex space-x-3 mt-3 md:mt-0">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md shadow-sm flex items-center transition-colors duration-200">
              <Megaphone className="w-4 h-4 mr-2" />
              Mass Announcement
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md shadow-sm flex items-center transition-colors duration-200">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency Protocol
            </button>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            title="Total Pilgrims Today" 
            value={visitorStats.total.toLocaleString()} 
            icon={Users} 
            change={visitorStats.change}
            color="bg-orange-500"
          />
          <StatCard 
            title="Pilgrims in Transit" 
            value={visitorStats.inTransit.toLocaleString()} 
            icon={Radio} 
            change={3.2}
            color="bg-blue-500"
          />
          <StatCard 
            title="Currently at Ghats" 
            value={visitorStats.atGhats.toLocaleString()} 
            icon={Landmark} 
            change={5.8}
            color="bg-green-500"
          />
          <StatCard 
            title="Active Alerts" 
            value={alerts.length.toString()} 
            icon={AlertTriangle} 
            change={alerts.length > 2 ? 12.5 : -8.3}
            color="bg-red-500"
          />
        </div>
        
        {/* Weather Info */}
        <div className="mb-6">
          <WeatherInfo />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Crowd Density Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Live Crowd Density Map</h2>
                <div className="flex items-center space-x-2">
                  <select className="text-sm border border-gray-300 rounded p-1">
                    <option>Heat Map</option>
                    <option>Flow Analysis</option>
                    <option>Zone View</option>
                    <option>Satellite Overlay</option>
                  </select>
                  <button className="bg-orange-100 text-orange-800 p-1 rounded hover:bg-orange-200 transition-colors duration-200">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button className="bg-orange-100 text-orange-800 p-1 rounded hover:bg-orange-200 transition-colors duration-200">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Placeholder for the heat map */}
              <div className="relative h-80 bg-orange-50 rounded-lg border border-orange-200 flex items-center justify-center">
                <div className="absolute inset-0 p-4">
                  {/* This is a simplified representation of a Kumbh Mela layout */}
                  <div className="h-full flex flex-col">
                    {/* Top section - City Entry */}
                    <div className="h-1/6 flex">
                      <div className="w-1/4 bg-green-200 rounded-tl-lg flex items-center justify-center text-xs font-medium text-green-800 border border-green-300">
                        City Entry A
                      </div>
                      <div className="w-1/4 bg-yellow-200 flex items-center justify-center text-xs font-medium text-yellow-800 border border-yellow-300">
                        City Entry B
                      </div>
                      <div className="w-1/4 bg-red-200 flex items-center justify-center text-xs font-medium text-red-800 border border-red-300">
                        Railway Station
                      </div>
                      <div className="w-1/4 bg-green-200 rounded-tr-lg flex items-center justify-center text-xs font-medium text-green-800 border border-green-300">
                        Bus Terminal
                      </div>
                    </div>
                    
                    {/* Camp areas */}
                    <div className="h-2/6 flex">
                      <div className="w-1/3 bg-yellow-200 flex items-center justify-center text-xs font-medium text-yellow-800 border border-yellow-300">
                        Sector 9 Camps
                      </div>
                      <div className="w-1/3 bg-yellow-200 flex items-center justify-center text-xs font-medium text-yellow-800 border border-yellow-300">
                        Sector 12 Camps
                      </div>
                      <div className="w-1/3 bg-green-200 flex items-center justify-center text-xs font-medium text-green-800 border border-green-300">
                        Ashram Area
                      </div>
                    </div>
                    
                    {/* Main ghat area */}
                    <div className="h-2/6 flex">
                      <div className="w-1/2 bg-red-200 flex items-center justify-center text-xs font-medium text-red-800 border border-red-300">
                        Har Ki Pauri
                      </div>
                      <div className="w-1/4 bg-yellow-200 flex items-center justify-center text-xs font-medium text-yellow-800 border border-yellow-300">
                        Triveni Ghat
                      </div>
                      <div className="w-1/4 bg-green-200 flex items-center justify-center text-xs font-medium text-green-800 border border-green-300">
                        Other Ghats
                      </div>
                    </div>
                    
                    {/* River */}
                    <div className="h-1/6 flex bg-blue-200 rounded-b-lg border border-blue-300">
                      <div className="w-full flex items-center justify-center text-xs font-medium text-blue-800">
                        Ganga River
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-3 right-3 bg-white p-2 rounded-md shadow-sm text-xs">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 bg-green-200 border border-green-300 rounded-sm mr-1"></div>
                    <span>Safe Density (&lt;60%)</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded-sm mr-1"></div>
                    <span>Moderate Density (60-85%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-200 border border-red-300 rounded-sm mr-1"></div>
                    <span>High Density (&gt;85%)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Main Ghat Wait Time</p>
                  <p className="text-lg font-bold text-orange-800">3.5 hrs</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Peak Expected</p>
                  <p className="text-lg font-bold text-orange-800">14:30-17:00</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Processing Rate</p>
                  <p className="text-lg font-bold text-orange-800">42,000/hr</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Active Alerts */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Active Alerts</h2>
                <button className="text-xs text-orange-600 hover:text-orange-800">View All</button>
              </div>
              
              <div className="space-y-1">
                {alerts.length > 0 ? (
                  alerts.map(alert => (
                    <Alert 
                      key={alert.id}
                      level={alert.level}
                      message={alert.message}
                      time={alert.time}
                      location={alert.location}
                      onDismiss={() => handleDismissAlert(alert.id)}
                      onRespond={() => {}}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No active alerts</p>
                )}
              </div>
            </div>
            
            {/* Action Center */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Critical Actions</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-orange-100 hover:bg-orange-200 text-orange-800 p-3 rounded-lg flex flex-col items-center justify-center transition-colors duration-200">
                  <Users className="w-5 h-5 mb-1" />
                  <span className="text-xs">Flow Control</span>
                </button>
                <button className="bg-orange-100 hover:bg-orange-200 text-orange-800 p-3 rounded-lg flex flex-col items-center justify-center transition-colors duration-200">
                  <Radio className="w-5 h-5 mb-1" />
                  <span className="text-xs">Emergency Broadcast</span>
                </button>
                <button className="bg-orange-100 hover:bg-orange-200 text-orange-800 p-3 rounded-lg flex flex-col items-center justify-center transition-colors duration-200">
                  <PieChart className="w-5 h-5 mb-1" />
                  <span className="text-xs">Predictive Analytics</span>
                </button>
                <button className="bg-orange-100 hover:bg-orange-200 text-orange-800 p-3 rounded-lg flex flex-col items-center justify-center transition-colors duration-200">
                  <UserPlus className="w-5 h-5 mb-1" />
                  <span className="text-xs">Deploy Team</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Ghat Management */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Ghat Area Management</h2>
              <select className="text-xs border border-gray-300 rounded p-1">
                <option>All Ghats</option>
                <option>Critical Ghats</option>
                <option>Primary Bathing Areas</option>
                <option>Secondary Locations</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ghatAreas.map(area => (
                <AreaStatus 
                  key={area.id}
                  name={area.name}
                  capacity={area.capacity}
                  current={area.current}
                  status={area.status}
                />
              ))}
            </div>
          </div>
          
          {/* Camp Management */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Camp Area Management</h2>
              <button className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 transition-colors duration-200">
                Resource Allocation
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {campAreas.map(area => (
                <AreaStatus 
                  key={area.id}
                  name={area.name}
                  capacity={area.capacity}
                  current={area.current}
                  status={area.status}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Security Team Management */}
        <div className="grid grid-cols-1 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Security Personnel</h2>
              <div className="flex space-x-2">
                <button className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 transition-colors duration-200">
                  View All Teams
                </button>
                <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors duration-200">
                  <UserPlus className="w-3 h-3 inline" /> Add Personnel
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {securityStaff.map(staff => (
                <StaffCard 
                  key={staff.id}
                  name={staff.name}
                  area={staff.area}
                  status={staff.status}
                  imageId={staff.id}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Emergency Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Medical Resources</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                <span className="font-medium">Ambulances Available</span>
                <span className="font-bold text-green-700">48/60</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-md">
                <span className="font-medium">Medical Tents</span>
                <span className="font-bold text-yellow-700">24/30</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                <span className="font-medium">Emergency Staff</span>
                <span className="font-bold text-green-700">320/350</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Water & Sanitation</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                <span className="font-medium">Drinking Water Stations</span>
                <span className="font-bold text-green-700">95% Operational</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                <span className="font-medium">Toilet Facilities</span>
                <span className="font-bold text-green-700">92% Operational</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-md">
                <span className="font-medium">Waste Management</span>
                <span className="font-bold text-yellow-700">84% Capacity</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Transport Resources</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-md">
                <span className="font-medium">Shuttle Buses</span>
                <span className="font-bold text-yellow-700">75% Available</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                <span className="font-medium">Parking Capacity</span>
                <span className="font-bold text-green-700">62% Filled</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded-md">
                <span className="font-medium">Key Roads</span>
                <span className="font-bold text-red-700">2 Congested</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MahakumbhDashboard;