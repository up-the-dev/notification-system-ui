import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { setClientData, setLoading, setError } from "../store/slices/clientSlice";
import { getApiUrl } from "../config/api";
import ParticleSystem from "../components/ParticleSystem";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  PlusIcon,
  KeyIcon,
  FolderIcon,
  TagIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token, clientId } = useAppSelector((state) => state.auth);
  const { clientData, loading, error } = useAppSelector((state) => state.client);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId || !token) return;

      dispatch(setLoading(true));
      try {
        const response = await fetch(getApiUrl(`/clients/${clientId}`), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (data.status === 'success') {
          dispatch(setClientData(data.data));
        } else {
          dispatch(setError(data.message || 'Failed to fetch client data'));
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        dispatch(setError('Failed to fetch client data'));
      }
    };

    fetchClientData();
  }, [clientId, token, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Welcome {user?.email}
          </h2>
          <p className="text-gray-400 mb-6">No client data available</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const totalProjects = clientData.Projects?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ParticleSystem />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Welcome back, {clientData.Name}
        </h1>
        <p className="text-gray-400">{clientData.Description}</p>
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
                {totalProjects}
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
                Active Projects
              </p>
              <p className="text-3xl font-bold text-white">
                {clientData.Projects?.filter(p => p.IsActive).length || 0}
              </p>
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
                {totalProjects}
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
          {clientData.Projects?.map((project, index) => (
            <motion.div
              key={project?.ID}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {project?.Name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Created:{" "}
                    {new Date(project?.CreatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Status:{" "}
                    <span className={project?.IsActive ? "text-green-400" : "text-red-400"}>
                      {project?.IsActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">Project ID</p>
                  <code className="text-cyan-400 text-sm bg-black/20 px-2 py-1 rounded">
                    {project?.ID?.slice(0, 8)}...
                  </code>
                </div>
              </div>

              <div className="bg-black/20 rounded-xl p-4 mb-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-orange-300">
                      Sender ID
                    </span>
                  </div>
                  <code className="text-orange-400 text-sm font-mono">
                    {project?.SenderId}
                  </code>
                </div>
                
                {project?.APIKey && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-green-300">
                        API Key
                      </span>
                      <button
                        onClick={() => copyToClipboard(project?.APIKey)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedKey === project?.APIKey ? (
                          <CheckIcon className="w-4 h-4 text-green-400" />
                        ) : (
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <code className="text-green-400 text-sm font-mono break-all">
                      {project?.APIKey}
                    </code>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
