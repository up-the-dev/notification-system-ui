/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";
import { TagIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { addPurpose, Purpose } from "../store/slices/clientSlice";

const CreatePurpose: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const client = useAppSelector((state) => state.client.clientData);

  const [formData, setFormData] = useState({
    projectId: "",
    name: "",
    description: "",
    templateId: "",
  });
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  if (!client || client.Projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            You need at least one project to create a purpose
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(getApiUrl("/purpose"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_id: client.ID,
          project_id: formData.projectId,
          name: formData.name,
          description: formData.description,
          template_id: formData.templateId,
        }),
      });

      const data = await response.json();
      setApiResponse(data);

      if (data.status === "success") {
        // backend returns Purpose with ID/Name/Description/CreatedAt/IsActive
        const purpose: Purpose = data.data;
        dispatch(addPurpose({ projectId: formData.projectId, purpose }));
        setTimeout(() => navigate("/dashboard"), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
          <TagIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Create New Purpose
        </h1>
        <p className="text-gray-400">
          Define a new notification purpose for your project
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
      >
        {!apiResponse ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Select Project
              </label>
              <select
                required
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({ ...formData, projectId: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
              >
                <option value="" className="bg-gray-800">
                  Select a project
                </option>
                {client.Projects.map((project) => (
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

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Purpose Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                placeholder="e.g., User Registration, Order Confirmation"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 h-32 resize-none"
                placeholder="Describe what this purpose is used for and when notifications should be sent..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Template ID
              </label>
              <input
                type="text"
                required
                value={formData.templateId}
                onChange={(e) =>
                  setFormData({ ...formData, templateId: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                placeholder="Enter template ID"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <TagIcon className="w-5 h-5" />
                  <span>Create Purpose</span>
                </>
              )}
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-green-400 text-2xl"
              >
                ✓
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Purpose Created Successfully!
            </h2>

            <div className="bg-black/20 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">
                Purpose Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Purpose ID: </span>
                  <span className="text-white font-mono">
                    {apiResponse.data.ID}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Name: </span>
                  <span className="text-white">{apiResponse.data.Name}</span>
                </div>
                <div>
                  <span className="text-gray-400">Description: </span>
                  <span className="text-white">
                    {apiResponse.data.Description}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Status: </span>
                  <span className="text-green-400">
                    {apiResponse.data.IsActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Created: </span>
                  <span className="text-white">
                    {new Date(apiResponse.data.CreatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-4">Redirecting to dashboard...</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CreatePurpose;
