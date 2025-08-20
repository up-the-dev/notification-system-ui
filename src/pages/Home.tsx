import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useClient } from "../context/ClientContext";
import { getApiUrl } from "../config/api";
import { SparklesIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { s } from "framer-motion/client";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setClient } = useClient();
  const [formData, setFormData] = useState({
    clientName: "",
    clientDescription: "",
    projectName: "",
    senderId: "",
  });
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [clientresponse, setClientResponse] = useState(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(getApiUrl("/clients"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.clientName,
          description: formData.clientDescription,
          project: {
            name: formData.projectName,
            sender_id: formData.senderId,
          },
          sender_id: formData.senderId,
        }),
      });

      const data = await response.json();
      console.log("Response data:", data);
      if (data.status === "success") {
        const newClient = {
          client_id: data.data?.client_id,
          name: formData.clientName,
          description: formData.clientDescription,
          projects: [
            {
              project_id: data.data.project_id,
              name: formData.projectName,
              api_key: data.data.api_key,
              created_at: data.data.created_at,
              purposes: [],
            },
          ],
        };
        setClient(newClient);
        setRegistrationSuccess(true);
        setClientResponse(data);
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-6"
          >
            <SparklesIcon className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to ShauryaNotify
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your centralized notification system starts here. Create your client
            profile and get your first API key.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
        >
          {registrationSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                <motion.div
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">
                Registration Successful!
              </h2>

              <div className="bg-black/20 rounded-xl p-6 mb-6 text-left">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                  Your API Credentials
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Client ID: </span>
                    <span className="text-white font-mono">
                      {clientresponse?.data?.client_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Project ID: </span>
                    <span className="text-white font-mono">
                      {clientresponse?.data?.project_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">API Key: </span>
                    <span className="text-green-400 font-mono break-all">
                      {clientresponse?.data?.api_key}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4">Redirecting to dashboard...</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                />
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(event) =>
                    setFormData({ ...formData, clientName: event.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Client Description
                </label>
                <textarea
                  required
                  value={formData.clientDescription}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      clientDescription: event.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 h-24 resize-none"
                  placeholder="Describe your business or project"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  First Project Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      projectName: event.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
                  placeholder="Your first project name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Sender ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.senderId}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      senderId: event.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
                  placeholder="Your sender ID"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <RocketLaunchIcon className="w-5 h-5" />
                    <span>Launch Your ShauryaNotify</span>
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
