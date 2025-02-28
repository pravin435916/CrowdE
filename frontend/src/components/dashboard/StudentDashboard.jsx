import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy, Star, Zap, Award, TrendingUp, BookOpen } from "lucide-react";

const StudentDashboard = () => {
  const [results, setResults] = useState([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [levels, setLevels] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animations, setAnimations] = useState({});
  const [streakDays, setStreakDays] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Calculate level based on coins
  const calculateLevel = (coins) => {
    return Math.floor(coins / 100) + 1;
  };

  // Get coin rewards based on score
  const getCoinsForScore = (score) => {
    if (score >= 80) return 50;
    if (score >= 60) return 30;
    if (score >= 40) return 20;
    return 10;
  };

  useEffect(() => {
    // Launch confetti if needed
    if (showConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [showConfetti]);

  useEffect(() => {
    const fetchScores = () => {
      let scores = [];
      let coins = 0;
      let uniqueTests = new Set();
      let lastTestDate = null;
      let streakCount = 0;
      
      // Get date from a week ago
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Create user levels array
      const levelsData = [
        { name: "Novice Explorer", level: 1, coinsNeeded: 0, perks: "Access to basic tests" },
        { name: "Skill Seeker", level: 2, coinsNeeded: 100, perks: "Unlock detailed answers" },
        { name: "Knowledge Hunter", level: 3, coinsNeeded: 200, perks: "Unlock advanced tests" },
        { name: "Insight Master", level: 4, coinsNeeded: 300, perks: "Personalized recommendations" },
        { name: "Career Virtuoso", level: 5, coinsNeeded: 400, perks: "Expert career guidance" }
      ];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("career-test-")) {
          const storedData = localStorage.getItem(key);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            
            // Calculate coins based on score
            const earnedCoins = getCoinsForScore(parsedData.score);
            coins += earnedCoins;
            
            // Add test title to unique tests set
            uniqueTests.add(key.replace("career-test-", ""));
            
            // Check date for streak calculation
            const testDate = new Date(parsedData.date);
            if (testDate >= weekAgo) {
              if (!lastTestDate || isConsecutiveDay(lastTestDate, testDate)) {
                streakCount++;
              }
              lastTestDate = testDate;
            }
            
            scores.push({
              title: key.replace("career-test-", ""),
              score: parsedData.score,
              badge: getBadge(parsedData.score),
              coins: earnedCoins,
              date: new Date(parsedData.date).toLocaleDateString(),
              id: key
            });
          }
        }
      }

      // Sort by date, newest first
      scores.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Add bonus coins for unique tests
      const diversityBonus = uniqueTests.size * 5;
      coins += diversityBonus;
      
      // Add streak bonus
      const streakBonus = streakCount * 10;
      coins += streakBonus;
      
      setTotalCoins(coins);
      setStreakDays(streakCount);
      setResults(scores);
      setLevels(levelsData);
      
      // Generate simple recommendation based on test titles and scores
      generateRecommendations(scores);
      
      // Show confetti if there are results
      if (scores.length > 0) {
        setShowConfetti(true);
      }
    };

    const isConsecutiveDay = (date1, date2) => {
      const dayDiff = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
      return dayDiff === 1;
    };

    fetchScores();
  }, []);

  // Generate simple recommendations based on test scores
  const generateRecommendations = (testResults) => {
    // Skip if no results
    if (!testResults || testResults.length === 0) return;
    
    // Get the highest scoring test
    const highestScoringTest = [...testResults].sort((a, b) => b.score - a.score)[0];
    
    // Create a recommendation based on highest score
    const recommendationList = [];
    const titleLower = highestScoringTest.title.toLowerCase();
    
    if (titleLower.includes("machine learning") || titleLower.includes("data")) {
      recommendationList.push({
        title: "Data Science Path",
        description: "Based on your high score in " + highestScoringTest.title,
        match: Math.round(highestScoringTest.score * 0.9)
      });
    } else if (titleLower.includes("developer") || titleLower.includes("web")) {
      recommendationList.push({
        title: "Web Development Path",
        description: "Based on your high score in " + highestScoringTest.title,
        match: Math.round(highestScoringTest.score * 0.95)
      });
    } else if (titleLower.includes("cyber") || titleLower.includes("security")) {
      recommendationList.push({
        title: "Cybersecurity Path",
        description: "Based on your high score in " + highestScoringTest.title,
        match: Math.round(highestScoringTest.score * 0.93)
      });
    } else {
      recommendationList.push({
        title: "Technology Career Path",
        description: "Based on your test results",
        match: Math.round(highestScoringTest.score * 0.85)
      });
    }
    
    setRecommendations(recommendationList);
  };

  const getBadge = (score) => {
    if (score >= 80) return { emoji: "🏆", name: "Expert", color: "from-yellow-400 to-yellow-600" };
    if (score >= 60) return { emoji: "🥇", name: "Advanced", color: "from-blue-400 to-blue-600" };
    if (score >= 40) return { emoji: "🥈", name: "Intermediate", color: "from-green-400 to-green-600" };
    return { emoji: "🥉", name: "Beginner", color: "from-gray-400 to-gray-600" };
  };
  
  const handleCoinAnimation = (id) => {
    setAnimations(prev => ({
      ...prev,
      [id]: true
    }));
    
    setTimeout(() => {
      setAnimations(prev => ({
        ...prev,
        [id]: false
      }));
    }, 1000);
  };
  
  const currentLevel = calculateLevel(totalCoins);
  const currentLevelData = levels.find(l => l.level === currentLevel) || levels[0];
  const nextLevelData = levels.find(l => l.level === currentLevel + 1);
  const progressToNextLevel = nextLevelData 
    ? ((totalCoins - currentLevelData.coinsNeeded) / (nextLevelData.coinsNeeded - currentLevelData.coinsNeeded)) * 100
    : 100;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Career Dashboard</h1>
            <p className="opacity-80">Track your progress and discover career opportunities</p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
              <span className="text-yellow-300 text-2xl mr-2">⚡</span>
              <div>
                <p className="font-bold text-xl">{streakDays} day streak</p>
                <p className="text-xs opacity-80">Keep learning daily!</p>
              </div>
            </div>
            
            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
              <span className="text-yellow-300 text-2xl mr-2">🪙</span>
              <div>
                <p className="font-bold text-xl">{totalCoins} coins</p>
                <p className="text-xs opacity-80">Level {currentLevel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto mb-8 bg-white rounded-lg shadow-sm p-1">
        <button 
          onClick={() => setActiveTab("overview")} 
          className={`px-4 py-2 rounded-lg font-medium text-sm ${
            activeTab === "overview" 
              ? "bg-indigo-100 text-indigo-800" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab("results")} 
          className={`px-4 py-2 rounded-lg font-medium text-sm ${
            activeTab === "results" 
              ? "bg-indigo-100 text-indigo-800" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Results
        </button>
        <button 
          onClick={() => setActiveTab("recommendations")} 
          className={`px-4 py-2 rounded-lg font-medium text-sm ${
            activeTab === "recommendations" 
              ? "bg-indigo-100 text-indigo-800" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Recommendations
        </button>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column: Profile & Level */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {currentLevel}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{currentLevelData?.name || "Learner"}</h2>
                  <p className="text-gray-500 text-sm">Level {currentLevel}</p>
                </div>
              </div>
              
              {nextLevelData && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress to Level {currentLevel + 1}</span>
                    <span>{totalCoins}/{nextLevelData.coinsNeeded} coins</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${progressToNextLevel}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center mb-6">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Coins</p>
                  <p className="text-2xl font-bold text-gray-800">{totalCoins}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium mb-2">Current Perks</h3>
                <p className="text-gray-600 text-sm">{currentLevelData?.perks || "Basic features"}</p>
              </div>
              
              {nextLevelData && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="font-medium mb-2">Next Level Perks</h3>
                  <p className="text-gray-600 text-sm">{nextLevelData?.perks}</p>
                  <button className="mt-3 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
                    How to Level Up Faster
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Learning Achievements</h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Tests Completed</p>
                    <p className="text-gray-500 text-sm">{results.length} career tests</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Average Score</p>
                    <p className="text-gray-500 text-sm">
                      {results.length > 0 
                        ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length) 
                        : 0}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Career Paths Explored</p>
                    <p className="text-gray-500 text-sm">
                      {new Set(results.map(r => r.title)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column: Results List */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Recent Test Results</h2>
            
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.slice(0, 3).map((result) => (
                  <div 
                    key={result.id} 
                    className="bg-white rounded-xl shadow-lg p-5 transition-all hover:shadow-xl"
                    onClick={() => handleCoinAnimation(result.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{result.title}</h3>
                        <p className="text-gray-500 text-sm">{result.date}</p>
                      </div>
                      <div className="flex items-center">
                        <div className={`relative ${animations[result.id] ? 'animate-bounce' : ''}`}>
                          <div className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                            <span className="text-yellow-500 mr-1">🪙</span>
                            <span className="font-bold">{result.coins}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r ${result.badge.color} text-white text-xl`}>
                          {result.score}%
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-500">Performance</p>
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">{result.badge.emoji}</span>
                            <span className="font-medium">{result.badge.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium text-sm hover:bg-indigo-200 transition-colors">
                        View Details
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${result.badge.color} rounded-full`}
                          style={{ width: `${result.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {results.length > 3 && (
                  <div className="text-center">
                    <button 
                      onClick={() => setActiveTab("results")}
                      className="text-indigo-600 font-medium hover:text-indigo-800"
                    >
                      View all {results.length} results
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Tests Completed Yet</h3>
                <p className="text-gray-500 mb-6">Take career tests to see your results here and earn coins!</p>
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Start a Career Test
                </button>
              </div>
            )}
            
            {recommendations.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Recommended Career Paths</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-500">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold">{rec.title}</h3>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {rec.match}% Match
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{rec.description}</p>
                      <button className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors">
                        Explore Path
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {results.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mt-6 border border-indigo-100">
                <h3 className="font-bold text-lg mb-3">Tips to Earn More Coins</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Complete more career tests to earn coins based on your score</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Maintain a daily streak for bonus coins (+10 per day)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Try diverse career paths for additional rewards</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Score above 80% for maximum coin rewards</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Results tab content */}
      {activeTab === "results" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">All Career Test Results</h2>
          
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className="bg-white rounded-xl shadow-lg p-5 transition-all hover:shadow-xl"
                  onClick={() => handleCoinAnimation(result.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{result.title}</h3>
                      <p className="text-gray-500 text-sm">{result.date}</p>
                    </div>
                    <div className="flex items-center">
                      <div className={`relative ${animations[result.id] ? 'animate-bounce' : ''}`}>
                        <div className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                          <span className="text-yellow-500 mr-1">🪙</span>
                          <span className="font-bold">{result.coins}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r ${result.badge.color} text-white text-xl`}>
                        {result.score}%
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Performance</p>
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{result.badge.emoji}</span>
                          <span className="font-medium">{result.badge.name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium text-sm hover:bg-indigo-200 transition-colors">
                      View Details
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${result.badge.color} rounded-full`}
                        style={{ width: `${result.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Tests Completed Yet</h3>
              <p className="text-gray-500 mb-6">Take career tests to see your results here and earn coins!</p>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                Start a Career Test
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Recommendations tab content */}
      {activeTab === "recommendations" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Career Recommendations</h2>
          
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold">{rec.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {rec.match}% Match
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                  <button className="w-full py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors">
                    Explore Path
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-10 w-10 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Recommendations Yet</h3>
              <p className="text-gray-500 mb-6">Complete more career tests to get personalized recommendations!</p>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                Start a Career Test
              </button>
            </div>
          )}
          
          {recommendations.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <h3 className="font-bold text-lg mb-4">How Recommendations Work</h3>
              <p className="text-gray-600 mb-4">
                Your career recommendations are based on your test scores and the career paths you've explored.
                Complete more tests to get more accurate recommendations tailored to your skills and interests.
              </p>
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-indigo-600 mr-2" />
                  <p className="text-sm font-medium text-indigo-800">
                    Your highest score so far: {results.length > 0 ? Math.max(...results.map(r => r.score)) : 0}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;