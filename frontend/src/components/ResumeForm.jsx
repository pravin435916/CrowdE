import React, { useState, useEffect } from "react";
import { uploadResume } from "../config/api";
import GitHubSkills from "./GitHubSkills";
import { FileUp, Briefcase, AlertCircle, Github, ArrowRight } from "lucide-react";

const ResumeForm = ({ onResultsReceived }) => {
  const [file, setFile] = useState(null);
  const [githubSkill, setGithubSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const storedSkills = localStorage.getItem("skills");
    if (storedSkills) {
      setGithubSkill(storedSkills);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a resume ");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      if (file) {
        formData.append("resume", file);
      }

      if(file) {
        const response = await uploadResume(formData);
        onResultsReceived(response.data);
      }
    //   if(githubSkill) {
    //     onResultsReceived(githubSkill)
    //   }
      
    } catch (err) {
      setError(
        "Error processing data: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };
  console.log("githubSkill",githubSkill)

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
            Upload your resume or extract skills from GitHub
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <FileUp className="mr-2 text-blue-500" size={18} />
            Upload Resume (PDF or DOCX)
          </label>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
            } transition-all duration-200 cursor-pointer`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("resume-file").click()}
          >
            <input id="resume-file" type="file" accept=".pdf,.docx,.doc" onChange={handleFileChange} className="hidden" />
            <div className="flex flex-col items-center justify-center">
              {file ? (
                <p className="text-sm font-medium text-green-800">
                  {file.name} ({(file.size / 1024).toFixed(0)} KB)
                </p>
              ) : (
                <p className="text-gray-700 font-medium mb-1">Drag & drop or click to upload</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Github className="mr-2 text-blue-500" size={18} />
            GitHub Skills Finder
          </label>
          <p className="text-xs text-gray-500 mb-3">Extract skills from your GitHub profile</p>

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
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70"
        >
          {loading ? "Analyzing..." : "Extract Skills"}
          <ArrowRight className="ml-2" size={18} />
        </button>
      </form>
    </div>
  );
};

export default ResumeForm;