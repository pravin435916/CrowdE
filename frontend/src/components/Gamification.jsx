import { useState, useEffect } from "react";
import confetti from "canvas-confetti"; // Add this package: npm install canvas-confetti

const Gamification = () => {
  const [results, setResults] = useState([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [levels, setLevels] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animations, setAnimations] = useState({});
  const [streakDays, setStreakDays] = useState(0);

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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Career Progress</h1>
            <p className="opacity-80">Track your journey to career mastery</p>
          </div>
          <div className="flex items-center bg-white text-black bg-opacity-20 rounded-full px-4 py-2">
            <span className="text-yellow-300 text-2xl mr-2">⚡</span>
            <div>
              <p className="font-bold text-xl">{streakDays} day streak</p>
              <p className="text-xs opacity-80">Keep learning daily!</p>
            </div>
          </div>
        </div>
      </div>
      
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Tests Completed</p>
                  <p className="text-gray-500 text-sm">{results.length} career tests</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
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
          <h2 className="text-2xl font-bold mb-4">Career Test Results</h2>
          
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No Tests Completed Yet</h3>
              <p className="text-gray-500 mb-6">Take career tests to see your results here and earn coins!</p>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                Start a Career Test
              </button>
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
    </div>
  );
};

export default Gamification;