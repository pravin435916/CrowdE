// components/navigation/SimpleNavbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Lightbulb,
    Route,
    Trophy,
    Users,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    Moon,
    Sun,
    Search
} from 'lucide-react';
import Profile from '../../auth/Profile';
import LoginButton from '../../auth/LoginButton';
import LogoutButton from '../../auth/LogoutButton';
import { useAuth0 } from "@auth0/auth0-react";
const ModernNavbar = ({ userName = "John Doe", userAvatar, isDarkMode, toggleDarkMode }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();


    const navItems = [
        // { icon: <LayoutDashboard size={20} />, name: 'Dashboard', path: '/dashboard' },
        { icon: <Lightbulb size={20} />, name: 'Courses', path: '/courses' },
        { icon: <Route size={20} />, name: 'Roadmaps', path: '/' },
        { icon: <Route size={20} />, name: 'Rewards & History', path: '/gamify' },
        // { icon: <Trophy size={20} />, name: 'Achievements', path: '/achievements' },
        // { icon: <Users size={20} />, name: 'Leaderboard', path: '/leaderboard' }
    ];

    const isActive = (path) => location.pathname === path;

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);
    const { isLoading } = useAuth0();

    //   if (isLoading) return <div className="text-center mt-8">Loading...</div>;


    return (
        <>
            {/* Main Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and brand */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 font-bold text-xl">
                                Team<span className="text-blue-200">_1ne</span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-4">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => navigate(item.path)}
                                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(item.path)
                                            ? 'border-2 bg-opacity-20 '
                                            : 'text-blue-100  hover:bg-opacity-10'
                                            }`}
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right side items */}
                        <div className="flex items-center space-x-3">
                            <button className="p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-200">
                                <Search size={20} />
                            </button>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    className="p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
                                    onClick={toggleNotifications}
                                >
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                    <Bell size={20} />
                                </button>
                            </div>

                            {/* Dark mode toggle */}
                            <button
                                className="p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
                                onClick={toggleDarkMode}
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* Profile */}
                            <div className="relative">
                                {/* <button className="flex items-center text-sm focus:outline-none">
                  <img 
                    className="h-8 w-8 rounded-full border-2 border-white"
                    src={userAvatar || "https://via.placeholder.com/150"}
                    alt={userName}
                  />
                  <span className="hidden md:block ml-2 font-medium">{userName}</span>
                </button> */}
                                <LoginButton />
                                {!isLoading && (
                                    <>
                                        <div className='flex gap-2 items-center justify-center'>
                                            <Profile />
                                            <LogoutButton />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    className="p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
                                    onClick={toggleMobileMenu}
                                >
                                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3  shadow-inner">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => {
                                    navigate(item.path);
                                    setMobileMenuOpen(false);
                                }}
                                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${isActive(item.path)
                                    ? ' '
                                    : 'hover:bg-indigo-700'
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </button>
                        ))}
                        <div className="border-t border-indigo-700 pt-2 mt-2">
                            <button className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-700">
                                <Settings size={20} className="mr-3" />
                                Settings
                            </button>
                            <button className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-700">
                                <LogOut size={20} className="mr-3" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content from being hidden behind navbar */}
            <div className="h-16"></div>
        </>
    );
};

export default ModernNavbar;