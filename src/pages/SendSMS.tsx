/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { getApiUrl } from "../config/api";
import {
  PaperAirplaneIcon,
  ArrowLeftIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

const SendSMS: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const { clientData } = useAppSelector((state) => state.client);
  const [formData, setFormData] = useState({
    projectId: "",
    purposeId: "",
    mobile: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  if (!clientData || !clientData.Projects || clientData.Projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            You need at least one project to send SMS
          </h2>
          <button
            onClick={() => navigate("/create-project")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-colors"
          >
            Create Project First
          </button>
        </div>
      </div>
    );
  }

  const selectedProject = clientData.Projects.find(
    (p) => p.ID === formData.projectId
  );
  const availablePurposes = selectedProject?.purposes || []; // ✅ pull from Redux slice

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedProject) {
      alert("Please select a project");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl("/sms"), {
        method: "POST",
        headers: {
          "X-CLIENT-ID": clientData.ID,
          "X-PROJECT-ID": formData.projectId,
          "X-API-KEY": selectedProject.APIKey || "",
          "X-PURPOSE-ID": formData.purposeId || formData.projectId, // ✅ use selected purpose if provided
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mobile: formData.mobile,
          message: formData.message,
        }),
      });

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      setResponse({
        status: "error",
        message: "Failed to send SMS. Please check your connection.",
      });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ projectId: "", purposeId: "", mobile: "", message: "" });
    setResponse(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/dashboard")}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
          <DevicePhoneMobileIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
          Send SMS
        </h1>
        <p className="text-gray-400">Send SMS notifications using your API</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
      >
        {!response ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Select Project
              </label>
              <select
                required
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectId: e.target.value,
                    purposeId: "",
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
              >
                <option value="" className="bg-gray-800">
                  Select a project
                </option>
                {clientData.Projects.map((project) => (
                  <option
                    key={project.ID}
                    value={project.ID}
                    className="bg-gray-800"
                  >
                    {project.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Details */}
            {selectedProject && (
              <div className="bg-black/20 rounded-xl p-4 border border-orange-500/20">
                <h3 className="text-sm font-semibold text-orange-300 mb-2">
                  Selected Project Details
                </h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-400">Project: </span>
                    <span className="text-white">{selectedProject.Name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">API Key: </span>
                    <span className="text-orange-400 font-mono text-xs">
                      {selectedProject.APIKey
                        ? selectedProject.APIKey.slice(0, 20) + "..."
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Purpose Select */}
            {availablePurposes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Select Purpose (Optional)
                </label>
                <select
                  value={formData.purposeId}
                  onChange={(e) =>
                    setFormData({ ...formData, purposeId: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                >
                  <option value="" className="bg-gray-800">
                    Use project default
                  </option>
                  {availablePurposes.map((purpose) => (
                    <option
                      key={purpose.ID}
                      value={purpose.ID}
                      className="bg-gray-800"
                    >
                      {purpose.Name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                placeholder="Enter mobile number (e.g., 8208709752)"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Message
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 h-32 resize-none"
                placeholder="Type your message here..."
                maxLength={160}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {formData.message.length}/160 characters
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>Send SMS</span>
                </>
              )}
            </motion.button>
          </form>
        ) : (
          // ✅ Response Screen stays the same
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                response.status === "success"
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-2xl ${
                  response.status === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {response.status === "success" ? "✓" : "✗"}
              </motion.div>
            </div>

            <h2
              className={`text-2xl font-bold mb-4 ${
                response.status === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {response.status === "success"
                ? "SMS Sent Successfully!"
                : "SMS Failed to Send"}
            </h2>

            <div className="bg-black/20 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">
                Response Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Status: </span>
                  <span
                    className={
                      response.status === "success"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {response.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Message: </span>
                  <span className="text-white">{response.message}</span>
                </div>
                {response.data && (
                  <div>
                    <span className="text-gray-400">Data: </span>
                    <span className="text-white">{response.data}</span>
                  </div>
                )}
                {response.serverTime && (
                  <div>
                    <span className="text-gray-400">Server Time: </span>
                    <span className="text-white">
                      {new Date(response.serverTime).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetForm}
                className="flex-1 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                Send Another SMS
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SendSMS;
