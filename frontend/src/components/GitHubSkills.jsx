import React, { useState } from "react";
import axios from "axios";

export const GitHubSkills = () => {
  const [username, setUsername] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSkills = async () => {
    if (!username) {
      setError("Please enter a GitHub username.");
      return;
    }

    setLoading(true);
    setError("");
    setSkills([]);

    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`
      );
      const repos = response.data;
      const skillSet = new Set();

      for (const repo of repos) {
        if (repo.language) skillSet.add(repo.language);
        if (repo.topics) {
          repo.topics.forEach((topic) => skillSet.add(topic));
        }
        if (repo.description) {
          const keywords = repo.description
            .toLowerCase()
            .match(
              /(machine learning|AI|frontend|backend|cloud|blockchain|devops|data science|full stack|react|next.js|docker|kubernetes|typescript|graphql)/g
            );
          if (keywords) {
            keywords.forEach((keyword) => skillSet.add(keyword));
          }
        }
      }

      setSkills(Array.from(skillSet));
    //   localStorage.setItem("skills", JSON.stringify(Array.from(skillSet)));
    } catch (err) {
      setError(
        "Failed to fetch data. Check the GitHub username and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  console.log("skills",skills)

  return (
    <div className="flex flex-col items-start justify-start mt-4 w-full mx-auto ">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={fetchSkills}
        disabled={loading}
        className="w-full max-w-[10rem]  mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
      >
        {loading ? "Loading..." : "Get Skills"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {skills.length > 0 && (
        <div className="mt-4 w-full">
          <h3 className="text-lg font-semibold text-center">
            Estimated Skills:
          </h3>
          <ul className="list-disc list-inside bg-gray-100 p-3 rounded-md">
            {skills.map((skill, index) => (
              <li key={index} className="text-gray-800">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// export default GitHubSkills;
