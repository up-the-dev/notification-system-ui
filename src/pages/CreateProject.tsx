/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";
import { RocketLaunchIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { addProject } from "../store/slices/clientSlice";

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const client = useAppSelector((state) => state.client.clientData);

  const [projectName, setProjectName] = useState("");
  const [senderId, setSenderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Please register as a client first
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-colors"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(getApiUrl("/projects"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: projectName,
          client_id: client.ID,
          sender_id: senderId,
        }),
      });

      const data = await response.json();
      setApiResponse(data);

      if (data.status === "success") {
        const newProject = {
          ID: data.data.project_id,
          ClientID: client.ID,
          Name: projectName,
          APIKey: data.data.api_key,
          SenderId: senderId,
          MetaData: null,
          IsActive: true,
          CreatedAt: data.data.created_at,
          UpdatedAt: data.data.created_at,
          purposes: [], // <-- important for dashboard
        };

        dispatch(addProject(newProject));
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-4">
          <RocketLaunchIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Create New Project
        </h1>
        <p className="text-gray-400">
          Add a new project to your {(client.Name || client["Name"]) as string}{" "}
          workspace
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
                Project Name
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
                placeholder="Enter your project name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Sender Id
              </label>
              <input
                type="text"
                required
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
                placeholder="Enter your sender Id"
              />
            </div>

            <div className="bg-black/20 rounded-xl p-4 border border-cyan-500/20">
              <h3 className="text-sm font-semibold text-cyan-300 mb-2">
                Client Information
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-400">Client: </span>
                  <span className="text-white">
                    {client.Name || (client as any).name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Client ID: </span>
                  <span className="text-cyan-400 font-mono">{client.ID}</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <RocketLaunchIcon className="w-5 h-5" />
                  <span>Create Project</span>
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
              Project Created Successfully!
            </h2>

            <div className="bg-black/20 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                Your New Project Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Project Name: </span>
                  <span className="text-white font-semibold">
                    {projectName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Project ID: </span>
                  <span className="text-white font-mono">
                    {apiResponse.data.project_id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">API Key: </span>
                  <span className="text-green-400 font-mono break-all">
                    {apiResponse.data.api_key}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Created: </span>
                  <span className="text-white">
                    {new Date(apiResponse.data.created_at).toLocaleString()}
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
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateProject;
