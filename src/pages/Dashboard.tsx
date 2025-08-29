import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import {
  setClientData,
  setLoading,
  setError,
  setMemberships,
  setMembershipLoading,
  Membership,
} from "../store/slices/clientSlice";
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
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowPathIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token, clientId } = useAppSelector((state) => state.auth);
  const { clientData, loading, error, memberships, membershipLoading } = useAppSelector(
    (state) => state.client
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch client + projects + purposes
  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId || !token) return;

      dispatch(setLoading(true));
      try {
        const response = await fetch(getApiUrl(`/clients/${clientId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.status === "success") {
          dispatch(setClientData(data.data));
        } else {
          dispatch(setError(data.message || "Failed to fetch client data"));
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        dispatch(setError("Failed to fetch client data"));
      }
    };

    fetchClientData();
  }, [clientId, token, dispatch]);

  // Fetch memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      if (!clientId || !token) return;

      dispatch(setMembershipLoading(true));
      try {
        const response = await fetch(getApiUrl(`/membership/${clientId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.status === "success") {
          dispatch(setMemberships(data.data || []));
        } else {
          console.error("Failed to fetch memberships:", data.message);
          dispatch(setMemberships([]));
        }
      } catch (error) {
        console.error("Error fetching memberships:", error);
        dispatch(setMemberships([]));
      }
    };

    fetchMemberships();
  }, [clientId, token, dispatch]);

  // Clipboard utility
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Check if membership is expiring (within 7 days or quota > 90%)
  const isMembershipExpiring = (membership: Membership) => {
    const validTill = new Date(membership.ValidTill);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((validTill.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const quotaPercentage = (membership.QuotaUsed / membership.QuotaTotal) * 100;
    
    return daysUntilExpiry <= 7 || quotaPercentage >= 90;
  };

  // Get membership stats
  const smsMemeberships = memberships.filter(m => m.Plan?.Channel?.toLowerCase() === 'sms');
  const whatsappMemberships = memberships.filter(m => m.Plan?.Channel?.toLowerCase() === 'whatsapp');
  
  const totalSMSQuota = smsMemeberships.reduce((sum, m) => sum + m.QuotaTotal, 0);
  const usedSMSQuota = smsMemeberships.reduce((sum, m) => sum + m.QuotaUsed, 0);
  const remainingSMS = totalSMSQuota - usedSMSQuota;

  const totalWhatsAppQuota = whatsappMemberships.reduce((sum, m) => sum + m.QuotaTotal, 0);
  const usedWhatsAppQuota = whatsappMemberships.reduce((sum, m) => sum + m.QuotaUsed, 0);
  const remainingWhatsApp = totalWhatsAppQuota - usedWhatsAppQuota;

  // Loading state
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

  // Error state
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

  // No client data
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

  const totalProjects = clientData.Projects?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ParticleSystem />

      {/* Header */}
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

      {/* No Memberships State */}
      {memberships.length === 0 && !membershipLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6 relative overflow-hidden"
          >
            <SparklesIcon className="w-16 h-16 text-white" />
            
            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  opacity: 0 
                }}
                animate={{ 
                  x: Math.cos(i * 60 * Math.PI / 180) * 50,
                  y: Math.sin(i * 60 * Math.PI / 180) * 50,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-4">
            🚀 Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            You don't have any active memberships yet. Choose your notification plans to start sending SMS and WhatsApp messages!
          </p>
          
          <Link to="/create-membership">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Choose Your Plans</span>
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* Membership Stats */}
      {memberships.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <DevicePhoneMobileIcon className="w-8 h-8 text-blue-400" />
              <div className="text-right">
                <p className="text-blue-300 text-sm font-semibold">SMS Remaining</p>
                <p className="text-2xl font-bold text-white">{remainingSMS.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalSMSQuota > 0 ? ((totalSMSQuota - usedSMSQuota) / totalSMSQuota) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {usedSMSQuota.toLocaleString()} / {totalSMSQuota.toLocaleString()} used
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-400" />
              <div className="text-right">
                <p className="text-green-300 text-sm font-semibold">WhatsApp Remaining</p>
                <p className="text-2xl font-bold text-white">{remainingWhatsApp.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalWhatsAppQuota > 0 ? ((totalWhatsAppQuota - usedWhatsAppQuota) / totalWhatsAppQuota) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {usedWhatsAppQuota.toLocaleString()} / {totalWhatsAppQuota.toLocaleString()} used
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-semibold">Total Projects</p>
                <p className="text-3xl font-bold text-white">{totalProjects}</p>
              </div>
              <FolderIcon className="w-12 h-12 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 text-sm font-semibold">Active Plans</p>
                <p className="text-3xl font-bold text-white">{memberships.filter(m => m.Status.toLowerCase() === 'active').length}</p>
              </div>
              <ChartBarIcon className="w-12 h-12 text-cyan-400" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Membership Details */}
      {memberships.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Memberships</h2>
            <Link to="/create-membership">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Plans</span>
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memberships.map((membership, index) => {
              const isExpiring = isMembershipExpiring(membership);
              const quotaPercentage = (membership.QuotaUsed / membership.QuotaTotal) * 100;
              const validTill = new Date(membership.ValidTill);
              const daysRemaining = Math.ceil((validTill.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              const channelColor = membership.Plan?.Channel?.toLowerCase() === 'sms' 
                ? 'from-blue-500 to-cyan-500' 
                : 'from-green-500 to-emerald-500';
              
              const channelIcon = membership.Plan?.Channel?.toLowerCase() === 'sms' 
                ? <DevicePhoneMobileIcon className="w-6 h-6" />
                : <ChatBubbleLeftRightIcon className="w-6 h-6" />;

              return (
                <motion.div
                  key={membership.ID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 border relative overflow-hidden ${
                    isExpiring ? 'border-orange-500/50' : 'border-white/10'
                  }`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${channelColor} rounded-full -translate-y-16 translate-x-16`}></div>
                  </div>

                  {/* Expiring Warning */}
                  {isExpiring && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 right-4 bg-orange-500/20 border border-orange-500/30 rounded-lg px-2 py-1 flex items-center space-x-1"
                    >
                      <ExclamationTriangleIcon className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 text-xs font-semibold">Expiring Soon</span>
                    </motion.div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${channelColor}`}>
                        {channelIcon}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Status</p>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          membership.Status.toLowerCase() === 'active' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {membership.Status}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {membership.Plan?.Name || `${membership.Plan?.Channel} Plan`}
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">Quota Usage</span>
                          <span className="text-sm text-white font-semibold">
                            {membership.QuotaUsed.toLocaleString()} / {membership.QuotaTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${quotaPercentage}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-2 rounded-full ${
                              quotaPercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                              quotaPercentage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              `bg-gradient-to-r ${channelColor}`
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Valid Till</span>
                        </div>
                        <span className={`text-sm font-semibold ${
                          daysRemaining <= 7 ? 'text-orange-400' : 'text-white'
                        }`}>
                          {validTill.toLocaleDateString()} ({daysRemaining} days)
                        </span>
                      </div>
                    </div>

                    {/* Renewal Button */}
                    {isExpiring && (
                      <Link to="/create-membership">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <ArrowPathIcon className="w-4 h-4" />
                          <span>Renew Plan</span>
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* No Projects State */}
      {totalProjects === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 mb-8"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-6 relative"
          >
            <RocketLaunchIcon className="w-16 h-16 text-white" />
            
            {/* Floating particles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 0 
                }}
                animate={{ 
                  x: Math.cos(i * 90 * Math.PI / 180) * 40,
                  y: Math.sin(i * 90 * Math.PI / 180) * 40,
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-4">
            🚀 Launch Your First Project!
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            You're all set with your memberships! Now create your first project to start sending notifications.
          </p>
          
          <Link to="/create-project">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <RocketLaunchIcon className="w-5 h-5" />
              <span>Create Your First Project</span>
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* Quick Actions */}
      {totalProjects > 0 && (
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
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>New Project</span>
              </motion.div>
            </Link>

            <Link to="/create-purpose">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center space-x-2"
              >
                <TagIcon className="w-5 h-5" />
                <span>New Purpose</span>
              </motion.div>
            </Link>

            <Link to="/send-sms">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl flex items-center space-x-2"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                <span>Send SMS</span>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Projects + Purposes */}
      {totalProjects > 0 && (
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
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project?.Name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Created: {new Date(project?.CreatedAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Status:{" "}
                      <span
                        className={
                          project?.IsActive ? "text-green-400" : "text-red-400"
                        }
                      >
                        {project?.IsActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">Project ID</p>
                    <div className="flex items-center space-x-2">
                      <code className="text-cyan-400 text-sm bg-black/20 px-2 py-1 rounded">
                        {project?.ID?.slice(0, 8)}...
                      </code>
                      <button
                        onClick={() => copyToClipboard(project?.ID)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedKey === project?.ID ? (
                          <CheckIcon className="w-4 h-4 text-green-400" />
                        ) : (
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sender & APIKey */}
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

                {/* Purposes Section */}
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
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-white text-sm">
                              {purpose?.Name}
                            </h5>
                            <button
                              onClick={() => copyToClipboard(purpose?.ID)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              {copiedKey === purpose?.ID ? (
                                <CheckIcon className="w-4 h-4 text-green-400" />
                              ) : (
                                <ClipboardDocumentIcon className="w-4 h-4" />
                              )}
                            </button>
                          </div>
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
      )}
    </div>
  );
};

export default Dashboard;