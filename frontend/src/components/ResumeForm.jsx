import React, { useState } from "react";
import { uploadResume } from "../config/api";
import GitHubSkills from "./GithubSkills";
import { FileUp, Briefcase, AlertCircle, Github, ArrowRight } from "lucide-react";

const ResumeForm = ({ onResultsReceived }) => {
  const [file, setFile] = useState(null);
  const [githubSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

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
      formData.append("githubSkill", githubSkill);

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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Briefcase className="mr-2 text-blue-600" size={24} />
            Resume Skills Extractor
          </h2>
          <p className="text-gray-600 mt-1">
            Upload your resume to identify key skills for your career path
          </p>
        </div>

        {loading && (
          <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm animate-pulse">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            Processing...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <FileUp className="mr-2 text-blue-500" size={18} />
            Upload Resume (PDF or DOCX)
          </label>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            } transition-all duration-200 cursor-pointer`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("resume-file").click()}
          >
            <input
              id="resume-file"
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <FileUp size={28} className="text-blue-600" />
              </div>

              {file ? (
                <div className="py-3 px-4 bg-green-50 border border-green-100 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    {file.name} ({(file.size / 1024).toFixed(0)} KB)
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 font-medium mb-1">
                    Drag & drop your resume here or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: PDF, DOCX, DOC
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Github className="mr-2 text-blue-500" size={18} />
            GitHub Skills Finder
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              Alternative
            </span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
            If you don't have a resume, extract skills from your GitHub profile
          </p>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <GitHubSkills />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
            <AlertCircle className="mr-2 shrink-0 mt-0.5" size={16} />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              Analyzing Resume...
            </>
          ) : (
            <>
              Extract Skills
              <ArrowRight className="ml-2" size={18} />
            </>
          )}
        </button>
        
        <div className="text-center text-xs text-gray-500 mt-2">
          Your data is processed securely and never shared
        </div>
      </form>
    </div>
  );
};

export default ResumeForm;