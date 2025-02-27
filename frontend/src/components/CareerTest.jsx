import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { chatSession } from "../config/gemini"; // Assuming this is your Gemini API configuration

const CareerTest = () => {
  const location = useLocation();
  const data = location.state?.data;
  
  const [testQuestions, setTestQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [previousResults, setPreviousResults] = useState(null);
  const [isSubmiited, setIsSubmitted] = useState(false);
  useEffect(() => {
    // Check if there are previous results in localStorage
    const storedResults = localStorage.getItem(`career-test-${data?.title}`);
    if (storedResults) {
      setPreviousResults(JSON.parse(storedResults));
    }
    
    // Generate test questions when component mounts
    if (data) {
      generateTest();
    }
  }, [data]);

  const generateTest = async () => {
    setLoading(true);
    try {
      // Create a prompt for the Gemini API based on career data
      const testPrompt = `Create a short assessment test for a "${data.title}" role with 5 multiple-choice questions.
      The questions should test knowledge about ${data.required_skills.join(', ')} and ${data.skills_to_acquire.join(', ')}.
      
      Return the response as a valid JSON object with this structure:
      {
        "questions": [
          {
            "id": 1,
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A",
            "explanation": "Brief explanation of why this is the correct answer"
          }
        ]
      }
      
      Make sure the test is appropriate for someone interested in becoming a ${data.title}. 
      Include questions of varying difficulty levels. Make sure the JSON is valid with no extra text.`;
      
      const testResult = await chatSession.sendMessage(testPrompt);
      const testText = testResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      // Extract JSON from response (in case there's additional text)
      const jsonMatch = testText.match(/(\{[\s\S]*\})/);
      const jsonString = jsonMatch ? jsonMatch[0] : testText;
      
      try {
        const parsedTest = JSON.parse(jsonString);
        setTestQuestions(parsedTest.questions);
        // Initialize userAnswers object with empty values
        const initialAnswers = {};
        parsedTest.questions.forEach(q => {
          initialAnswers[q.id] = null;
        });
        setUserAnswers(initialAnswers);
        setError(null);
      } catch (jsonError) {
        console.error("Failed to parse test JSON:", jsonError);
        setError("Failed to create test. Please try again.");
      }
    } catch (err) {
      console.error("Error generating test:", err);
      setError("Failed to create test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    
    testQuestions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / testQuestions.length) * 100);
    setScore(finalScore);
    
    // Store result in localStorage
    const resultData = {
      title: data.title,
      score: finalScore,
      date: new Date().toISOString(),
      questionCount: testQuestions.length,
      correctAnswers
    };
    
    localStorage.setItem(`career-test-${data.title}`, JSON.stringify(resultData));
    return finalScore;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setShowResults(true);
    setIsSubmitted(true);
  };

  const resetTest = () => {
    // Reset user answers
    const initialAnswers = {};
    testQuestions.forEach(q => {
      initialAnswers[q.id] = null;
    });
    setUserAnswers(initialAnswers);
    setShowResults(false);
  };

  const generateNewTest = () => {
    resetTest();
    generateTest();
  };

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h2 className="text-red-700 font-medium">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            onClick={generateTest}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Generating your personalized assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Career Test: {data?.title}</h1>
        <p className="text-gray-600 mb-4">{data?.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {data?.required_skills.map(skill => (
            <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {previousResults && !showResults && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="text-yellow-700 font-medium">Previous Test Result</h2>
          <p className="text-gray-700">
            You scored <span className="font-bold">{previousResults.score}%</span> on 
            {' '}{new Date(previousResults.date).toLocaleDateString()}
          </p>
          <div className="mt-2">
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => setPreviousResults(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {showResults ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Your Results</h2>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{score}%</span>
              </div>
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={score > 70 ? "#4ade80" : score > 40 ? "#facc15" : "#f87171"}
                  strokeWidth="3"
                  strokeDasharray={`${score}, 100`}
                />
              </svg>
            </div>
          </div>
          
          <div className="space-y-6">
            {testQuestions.map((question) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium mb-2">{question.question}</p>
                <div className="ml-4 space-y-2">
                  {question.options.map((option) => (
                    <div 
                      key={option} 
                      className={`p-2 rounded ${
                        userAnswers[question.id] === option && option === question.correctAnswer 
                          ? 'bg-green-100 border border-green-300' 
                          : userAnswers[question.id] === option 
                            ? 'bg-red-100 border border-red-300'
                            : option === question.correctAnswer
                              ? 'bg-green-50 border border-green-200'
                              : ''
                      }`}
                    >
                      {option}
                      {userAnswers[question.id] === option && option === question.correctAnswer && (
                        <span className="ml-2 text-green-600">✓</span>
                      )}
                      {userAnswers[question.id] === option && option !== question.correctAnswer && (
                        <span className="ml-2 text-red-600">✗</span>
                      )}
                    </div>
                  ))}
                </div>
                {(userAnswers[question.id] !== question.correctAnswer || true) && (
                  <div className="mt-3 bg-blue-50 p-3 rounded-md text-sm">
                    <span className="font-medium">Explanation:</span> {question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-4">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={resetTest}
            >
              Retake Test
            </button>
            <button 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              onClick={generateNewTest}
            >
              Generate New Test
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Assessment Test</h2>
          
          <div className="space-y-8">
            {testQuestions.map((question, index) => (
              <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <p className="font-medium mb-4">
                  <span className="bg-blue-600 text-white text-sm py-1 px-2 rounded-full mr-2">
                    {index + 1}
                  </span>
                  {question.question}
                </p>
                <div className="space-y-2 ml-8">
                  {question.options.map((option) => (
                    <div 
                      key={option} 
                      className={`border rounded-md p-3 cursor-pointer transition-colors ${
                        userAnswers[question.id] === option 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                      onClick={() => handleAnswerSelect(question.id, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <button 
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                Object.values(userAnswers).some(answer => answer === null)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={handleSubmit}
              disabled={Object.values(userAnswers).some(answer => answer === null)}
            >
              Submit Answers
            </button>
            {Object.values(userAnswers).some(answer => answer === null) && (
              <p className="text-sm text-gray-500 mt-2">
                Please answer all questions before submitting.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Learning Resources</h2>
        <ul className="space-y-3">
          {isSubmiited && data?.learning_resources.map((resource, index) => (
            <li key={index} className="flex items-start">
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                resource.type === 'course' ? 'bg-green-100 text-green-600' : 
                resource.type === 'book' ? 'bg-blue-100 text-blue-600' : 
                'bg-purple-100 text-purple-600'
              }`}>
                {resource.type === 'course' ? '📚' : resource.type === 'book' ? '📖' : '🔗'}
              </div>
              <div>
                <h3 className="font-medium">{resource.name}</h3>
                <p className="text-sm text-gray-600">
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • 
                  {resource.difficulty}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CareerTest;