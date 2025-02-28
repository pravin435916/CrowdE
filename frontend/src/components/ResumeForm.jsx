import React, { useState } from "react";
import { uploadResume } from "../config/api";
import LinkedInAuth from "./LinkedinAuth";
import GitHubSkills from "./GithubSkills";
const ResumeForm = ({ onResultsReceived }) => {
  const [file, setFile] = useState(null);
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a resume file");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("linkedInUrl", linkedInUrl);

      const response = await uploadResume(formData);
      onResultsReceived(response.data);
    } catch (err) {
      setError(
        "Error processing resume: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Resume Skills Extractor
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Resume (PDF or DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Skills Finder (submit if resume not a)
          </label>
          <GitHubSkills />

          {/* <input
            type="url"
            value={linkedInUrl}
            onChange={(e) => setLinkedInUrl(e.target.value)}
            placeholder="https://github.com/in/username"
          /> */}
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {loading ? "Processing..." : "Extract Skills"}
        </button>
      </form>
    </div>
  );
};

export default ResumeForm;
