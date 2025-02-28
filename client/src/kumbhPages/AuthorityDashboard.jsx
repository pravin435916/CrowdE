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
  Lock
} from "lucide-react";

// Reusable stat card component
const StatCard = ({ title, value, icon: Icon, change, color }) => (
  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-500">
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
    <div className={`mb-3 p-4 rounded-lg border-l-4 ${getBgColor()} animate-fadeIn`}>
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
      <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold mr-3">
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
    <div className="bg-white rounded-lg shadow p-4 border-t-4 border-amber-500">
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
        <span>Current: {current}</span>
        <span>Capacity: {capacity}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${getColor()}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-3 flex justify-end space-x-2">
        <button className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded px-2 py-1 hover:bg-amber-100 transition-colors duration-200">
          Adjust Limit
        </button>
        <button className="text-xs bg-amber-600 text-white rounded px-2 py-1 hover:bg-amber-700 transition-colors duration-200">
          Actions
        </button>
      </div>
    </div>
  );
};

const AuthorityDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [alerts, setAlerts] = useState([
    { 
      id: 1, 
      level: 'high', 
      message: 'Overcrowding detected at Main Shrine entrance', 
      time: '2 mins ago', 
      location: 'Main Shrine - East Entrance' 
    },
    { 
      id: 2, 
      level: 'medium', 
      message: 'VIP queue approaching capacity (85%)', 
      time: '5 mins ago', 
      location: 'VIP Entrance' 
    },
    { 
      id: 3, 
      level: 'low', 
      message: 'Cleaning required at prasad distribution area', 
      time: '15 mins ago', 
      location: 'Prasad Distribution Hall' 
    }
  ]);
  
  // Total visitor stats
  const [visitorStats, setVisitorStats] = useState({
    total: 4350,
    inQueue: 1275,
    inTemple: 2180,
    exited: 895,
    change: 8
  });
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update current time
      setCurrentTime(new Date());
      
      // Randomly update total visitors (small fluctuations)
      const visitorChange = Math.floor(Math.random() * 21) - 5;
      const queueChange = Math.floor(Math.random() * 15) - 5;
      
      setVisitorStats(prev => ({
        ...prev,
        total: prev.total + visitorChange,
        inQueue: Math.max(0, prev.inQueue + queueChange),
        inTemple: prev.inTemple + visitorChange - queueChange,
        change: visitorChange > 0 ? 8 + Math.random() * 4 : -1 * (Math.random() * 4)
      }));
      
      // Occasionally add new alerts (10% chance)
      if (Math.random() < 0.1) {
        const newAlert = {
          id: Date.now(),
          level: Math.random() < 0.2 ? 'high' : Math.random() < 0.5 ? 'medium' : 'low',
          message: 'New crowd density alert detected',
          time: 'Just now',
          location: Math.random() < 0.5 ? 'Main Shrine' : 'Outer Courtyard'
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 5));
      }
    }, 5001);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle alert dismiss
  const handleDismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
  // Staff data
  const securityStaff = [
    { id: 1, name: 'Rajesh Kumar', area: 'Main Entrance', status: 'active' },
    { id: 2, name: 'Priya Singh', area: 'Inner Sanctum', status: 'active' },
    { id: 3, name: 'Mohan Patel', area: 'Queue Management', status: 'break' },
    { id: 4, name: 'Sanjay Verma', area: 'Exit Area', status: 'active' },
    { id: 5, name: 'Lakshmi Devi', area: 'Prasad Hall', status: 'active' }
  ];
  
  // Temple area data
  const areas = [
    { id: 1, name: 'Main Shrine', capacity: 1000, current: 780, status: 'Open' },
    { id: 2, name: 'Outer Courtyard', capacity: 1500, current: 1280, status: 'Limited' },
    { id: 3, name: 'Queue Line A', capacity: 800, current: 710, status: 'Limited' },
    { id: 4, name: 'VIP Entrance', capacity: 200, current: 80, status: 'Open' },
    { id: 5, name: 'Prasad Distribution', capacity: 500, current: 410, status: 'Open' },
    { id: 6, name: 'Exit Pathway', capacity: 600, current: 120, status: 'Open' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar */}
      <header className="bg-amber-800 text-white shadow-md py-2 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          <h1 className="text-xl font-bold">Temple Authority Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-amber-200">
            <Clock className="w-4 h-4 mr-1" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
          
          <div className="relative">
            <button className="flex items-center space-x-1 bg-amber-700 rounded-full px-3 py-1">
              <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-amber-900 font-bold">
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
          <div className="flex space-x-1">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === "overview" 
                ? "bg-amber-100 text-amber-800" 
                : "text-gray-600 hover:text-amber-800 hover:bg-amber-50"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === "security" 
                ? "bg-amber-100 text-amber-800" 
                : "text-gray-600 hover:text-amber-800 hover:bg-amber-50"
              }`}
              onClick={() => setActiveTab("security")}
            >
              <UserCog className="w-4 h-4 mr-2" />
              Security
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === "alerts" 
                ? "bg-amber-100 text-amber-800" 
                : "text-gray-600 hover:text-amber-800 hover:bg-amber-50"
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
                ? "bg-amber-100 text-amber-800" 
                : "text-gray-600 hover:text-amber-800 hover:bg-amber-50"
              }`}
              onClick={() => setActiveTab("communication")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Communication
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === "settings" 
                ? "bg-amber-100 text-amber-800" 
                : "text-gray-600 hover:text-amber-800 hover:bg-amber-50"
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
            <h1 className="text-2xl font-bold text-gray-800">Sri Venkateshwara Temple</h1>
            <p className="text-gray-500">Crowd Management System</p>
          </div>
          
          <div className="flex space-x-3 mt-3 md:mt-0">
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-md shadow-sm flex items-center transition-colors duration-200">
              <Megaphone className="w-4 h-4 mr-2" />
              Send Announcement
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
            title="Total Visitors Today" 
            value={visitorStats.total.toLocaleString()} 
            icon={Users} 
            change={visitorStats.change}
            color="bg-amber-500"
          />
          <StatCard 
            title="Visitors in Queue" 
            value={visitorStats.inQueue.toLocaleString()} 
            icon={Radio} 
            change={3.2}
            color="bg-blue-500"
          />
          <StatCard 
            title="Currently in Temple" 
            value={visitorStats.inTemple.toLocaleString()} 
            icon={MapPin} 
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
                  </select>
                  <button className="bg-amber-100 text-amber-800 p-1 rounded hover:bg-amber-200 transition-colors duration-200">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button className="bg-amber-100 text-amber-800 p-1 rounded hover:bg-amber-200 transition-colors duration-200">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Placeholder for the heat map */}
              <div className="relative h-80 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-center">
                <div className="absolute inset-0 p-4">
                  {/* This is a simplified representation of a temple layout */}
                  <div className="h-full flex flex-col">
                    {/* Top section - Entry */}
                    <div className="h-1/6 flex">
                      <div className="w-1/4 bg-green-200 rounded-tl-lg flex items-center justify-center text-xs font-medium text-green-800 border border-green-300">
                        Entry A
                      </div>
                      <div className="w-1/4 bg-green-200 flex items-center justify-center text-xs font-medium text-green-800 border border-green-300">
                        Entry B
                      </div>
                      <div className="w-1/4 bg-yellow-200 flex items-center justify-center text-xs font-medium text-yellow-800 border border-yellow-300">
                        Entry C
                      </div>
                      <div className="w-1/4 bg-green-200 rounded-tr-lg flex items-center justify-center text-xs font-medium text-green-800 border border-green-300">
                        VIP
                      </div>
                    </div>
                    
                    {/* Queue area */}
                    <div className="h-2/6 flex">
                      <div className="w-1/3 bg-yellow-200 flex items-center justify-center text-xs font-medium text-yellow-800 border border-yellow-300">
                        Queue A
                      </div>
                      <div className="w-1/3 bg-red-200 flex items-center justify-center text-xs font-medium text-red-800 border border-red-300">
                        Queue B
                      </div>
                      <div className="w-1/3 bg-yellow-200 flex items-center justify-center text-xs font-medium text-yellow-800 border border-yellow-300">
                        Queue C
                      </div>
                    </div>
                    
                    {/* Main temple area */}
                    <div className="h-2/6 flex">
                      <div className="w-full bg-red-200 flex items-center justify-center text-xs font-medium text-red-800 border border-red-300">
                        Main Shrine
                      </div>
                    </div>
                    
                    {/* Exit area */}
                    <div className="h-1/6 flex">
                      <div className="w-1/2 bg-green-200 rounded-bl-lg flex items-center justify-center text-xs font-medium text-green-800 border border-green-300">
                        Exit A
                      </div>
                      <div className="w-1/2 bg-green-200 rounded-br-lg flex items-center justify-center text-xs font-medium text-green-800 border border-green-300">
                        Exit B
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-3 right-3 bg-white p-2 rounded-md shadow-sm text-xs">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 bg-green-200 border border-green-300 rounded-sm mr-1"></div>
                    <span>Low Density (&lt;60%)</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded-sm mr-1"></div>
                    <span>Medium Density (60-85%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-200 border border-red-300 rounded-sm mr-1"></div>
                    <span>High Density (&gt;85%)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Average Wait Time</p>
                  <p className="text-lg font-bold text-amber-800">45 min</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Peak Time Today</p>
                  <p className="text-lg font-bold text-amber-800">10:30 AM</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Flow Rate</p>
                  <p className="text-lg font-bold text-amber-800">380/hr</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Active Alerts */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Active Alerts</h2>
                <button className="text-xs text-amber-600 hover:text-amber-800">View All</button>
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
              <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 rounded-lg flex flex-col items-center justify-center transition-colors duration-200">
                  <Users className="w-5 h-5 mb-1" />
                  <span className="text-xs">Adjust Capacity</span>
                </button>
                <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 rounded-lg flex flex-col items-center justify-center transition-colors duration-200">
                  <Radio className="w-5 h-5 mb-1" />
                  <span className="text-xs">Staff Comms</span>
                </button>
                <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 rounded-lg flex flex-col items-center justify-center transition-colors duration-200">
                  <PieChart className="w-5 h-5 mb-1" />
                  <span className="text-xs">View Reports</span>
                </button>
                <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 rounded-lg flex flex-col items-center justify-center transition-colors duration-200">
                  <UserPlus className="w-5 h-5 mb-1" />
                  <span className="text-xs">Add Staff</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Security Personnel */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Security Personnel</h2>
              <button className="text-xs bg-amber-600 text-white px-2 py-1 rounded hover:bg-amber-700 transition-colors duration-200">
                Manage Staff
              </button>
            </div>
            
            <div className="space-y-3">
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
          
          {/* Area Management */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Area Management</h2>
              <select className="text-xs border border-gray-300 rounded p-1">
                <option>All Areas</option>
                <option>Critical Areas</option>
                <option>Entry Points</option>
                <option>Exit Points</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {areas.map(area => (
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
      </div>
    </div>
  );
};

export default AuthorityDashboard;