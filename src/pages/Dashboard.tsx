import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useClient } from "../context/ClientContext";
import ParticleSystem from "../components/ParticleSystem";
import {
  PlusIcon,
  KeyIcon,
  FolderIcon,
  TagIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const { client } = useClient();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            No Client Data Found
          </h2>
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-colors"
          >
            Register as Client
          </Link>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  console.log(client.projects);
  const totalPurposes = client.projects.reduce(
    (total, project) => total + (project.purposes?.length || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ParticleSystem />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Welcome back, {client.name}
        </h1>
        <p className="text-gray-400">{client.description}</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300 text-sm font-semibold">
                Total Projects
              </p>
              <p className="text-3xl font-bold text-white">
                {client?.projects?.length}
              </p>
            </div>
            <FolderIcon className="w-12 h-12 text-cyan-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-semibold">
                Total Purposes
              </p>
              <p className="text-3xl font-bold text-white">{totalPurposes}</p>
            </div>
            <TagIcon className="w-12 h-12 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-semibold">API Keys</p>
              <p className="text-3xl font-bold text-white">
                {client.projects.length}
              </p>
            </div>
            <KeyIcon className="w-12 h-12 text-green-400" />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/create-project">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>New Project</span>
            </motion.div>
          </Link>

          <Link to="/create-purpose">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
            >
              <TagIcon className="w-5 h-5" />
              <span>New Purpose</span>
            </motion.div>
          </Link>

          <Link to="/send-sms">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2"
            >
              <span>📱</span>
              <span>Send SMS</span>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Projects List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Your Projects</h2>
        <div className="space-y-6">
          {client.projects.map((project, index) => (
            <motion.div
              key={project?.project_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {project?.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Created:{" "}
                    {new Date(project?.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">Project ID</p>
                  <code className="text-cyan-400 text-sm bg-black/20 px-2 py-1 rounded">
                    {project?.project_id?.slice(0, 8)}...
                  </code>
                </div>
              </div>

              <div className="bg-black/20 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-green-300">
                    API Key
                  </span>
                  <button
                    onClick={() => copyToClipboard(project?.api_key)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedKey === project?.api_key ? (
                      <CheckIcon className="w-4 h-4 text-green-400" />
                    ) : (
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <code className="text-green-400 text-sm font-mono break-all">
                  {project?.api_key}
                </code>
              </div>

              {project?.purposes && project?.purposes.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Purposes ({project?.purposes?.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project?.purposes?.map((purpose) => (
                      <div
                        key={purpose?.ID}
                        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-3"
                      >
                        <h5 className="font-semibold text-white text-sm mb-1">
                          {purpose?.Name}
                        </h5>
                        <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                          {purpose?.Description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              purpose?.IsActive
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {purpose?.IsActive ? "Active" : "Inactive"}
                          </span>
                          <code className="text-purple-400 text-xs">
                            {purpose?.ID?.slice(0, 8)}...
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
