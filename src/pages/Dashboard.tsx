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
  PaperAirplaneIcon,
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

  // Get membership stats - only show cards for active memberships
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
    <div className="min-h-screen px-4 py-8">
      <ParticleSystem />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full mb-6 relative overflow-hidden"
          >
            <ChartBarIcon className="w-12 h-12 text-white" />
            
            {/* Floating particles around icon */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 0 
                }}
                animate={{ 
                  x: Math.cos(i * 60 * Math.PI / 180) * 40,
                  y: Math.sin(i * 60 * Math.PI / 180) * 40,
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
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome back, {clientData.Name}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{clientData.Description}</p>
        </motion.div>

        {/* No Memberships State */}
        {memberships.length === 0 && !membershipLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 mb-12"
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
              className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8 relative overflow-hidden"
            >
              <SparklesIcon className="w-20 h-20 text-white" />
              
              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    scale: 0,
                    opacity: 0 
                  }}
                  animate={{ 
                    x: Math.cos(i * 45 * Math.PI / 180) * 60,
                    y: Math.sin(i * 45 * Math.PI / 180) * 60,
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

            <h2 className="text-4xl font-bold text-white mb-6">
              🚀 Ready to Get Started?
            </h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto text-lg">
              You don't have any active memberships yet. Choose your notification plans to start sending SMS and WhatsApp messages!
            </p>
            
            <Link to="/create-membership">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-3 mx-auto text-lg"
              >
                <SparklesIcon className="w-6 h-6" />
                <span>Choose Your Plans</span>
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Membership Stats - Only show cards for active memberships */}
        {memberships.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* SMS Stats - Only show if user has SMS membership */}
            {smsMemeberships.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-500/30 relative overflow-hidden"
              >
                {/* Background animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <DevicePhoneMobileIcon className="w-10 h-10 text-blue-400" />
                    </motion.div>
                    <div className="text-right">
                      <p className="text-blue-300 text-sm font-semibold">SMS Remaining</p>
                      <motion.p 
                        className="text-3xl font-bold text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        {remainingSMS.toLocaleString()}
                      </motion.p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                      initial={{ width: 0 }}
                      animate={{ width: `${totalSMSQuota > 0 ? ((totalSMSQuota - usedSMSQuota) / totalSMSQuota) * 100 : 0}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {usedSMSQuota.toLocaleString()} / {totalSMSQuota.toLocaleString()} used
                  </p>
                </div>
              </motion.div>
            )}

            {/* WhatsApp Stats - Only show if user has WhatsApp membership */}
            {whatsappMemberships.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 relative overflow-hidden"
              >
                {/* Background animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <ChatBubbleLeftRightIcon className="w-10 h-10 text-green-400" />
                    </motion.div>
                    <div className="text-right">
                      <p className="text-green-300 text-sm font-semibold">WhatsApp Remaining</p>
                      <motion.p 
                        className="text-3xl font-bold text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                      >
                        {remainingWhatsApp.toLocaleString()}
                      </motion.p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                      initial={{ width: 0 }}
                      animate={{ width: `${totalWhatsAppQuota > 0 ? ((totalWhatsAppQuota - usedWhatsAppQuota) / totalWhatsAppQuota) * 100 : 0}%` }}
                      transition={{ delay: 0.6, duration: 1 }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {usedWhatsAppQuota.toLocaleString()} / {totalWhatsAppQuota.toLocaleString()} used
                  </p>
                </div>
              </motion.div>
            )}

            {/* Total Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-semibold">Total Projects</p>
                    <motion.p 
                      className="text-4xl font-bold text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      {totalProjects}
                    </motion.p>
                  </div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <FolderIcon className="w-14 h-14 text-purple-400" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Active Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-lg rounded-3xl p-8 border border-cyan-500/30 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-300 text-sm font-semibold">Active Plans</p>
                    <motion.p 
                      className="text-4xl font-bold text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                    >
                      {memberships.filter(m => m.Status.toLowerCase() === 'active').length}
                    </motion.p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <ChartBarIcon className="w-14 h-14 text-cyan-400" />
                  </motion.div>
                </div>
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
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Your Memberships</h2>
              <Link to="/create-membership">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl flex items-center space-x-2 shadow-lg"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add Plans</span>
                </motion.button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`bg-white/5 backdrop-blur-lg rounded-3xl p-8 border relative overflow-hidden ${
                      isExpiring ? 'border-orange-500/50' : 'border-white/10'
                    }`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${channelColor} rounded-full -translate-y-20 translate-x-20`}></div>
                    </div>

                    {/* Expiring Warning */}
                    {isExpiring && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-4 right-4 bg-orange-500/20 border border-orange-500/30 rounded-lg px-3 py-2 flex items-center space-x-2"
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 text-xs font-semibold">Expiring Soon</span>
                      </motion.div>
                    )}

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <motion.div 
                          className={`p-4 rounded-2xl bg-gradient-to-r ${channelColor}`}
                          whileHover={{ rotate: 5 }}
                        >
                          {channelIcon}
                        </motion.div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Status</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            membership.Status.toLowerCase() === 'active' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {membership.Status}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-4">
                        {membership.Plan?.Name || `${membership.Plan?.Channel} Plan`}
                      </h3>
                      
                      <div className="space-y-4 mb-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Quota Usage</span>
                            <span className="text-sm text-white font-semibold">
                              {membership.QuotaUsed.toLocaleString()} / {membership.QuotaTotal.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${quotaPercentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-3 rounded-full ${
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
            className="text-center py-20 mb-12"
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
              className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-8 relative"
            >
              <RocketLaunchIcon className="w-20 h-20 text-white" />
              
              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0 
                  }}
                  animate={{ 
                    x: Math.cos(i * 60 * Math.PI / 180) * 50,
                    y: Math.sin(i * 60 * Math.PI / 180) * 50,
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

            <h2 className="text-4xl font-bold text-white mb-6">
              🚀 Launch Your First Project!
            </h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto text-lg">
              You're all set with your memberships! Now create your first project to start sending notifications.
            </p>
            
            <Link to="/create-project">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-3 mx-auto text-lg"
              >
                <RocketLaunchIcon className="w-6 h-6" />
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
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Quick Actions</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/create-project">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-2xl flex items-center space-x-3 shadow-lg"
                >
                  <PlusIcon className="w-6 h-6" />
                  <span className="font-semibold">New Project</span>
                </motion.div>
              </Link>

              <Link to="/create-purpose">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl flex items-center space-x-3 shadow-lg"
                >
                  <TagIcon className="w-6 h-6" />
                  <span className="font-semibold">New Purpose</span>
                </motion.div>
              </Link>

              <Link to="/send-sms">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl flex items-center space-x-3 shadow-lg"
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                  <span className="font-semibold">Send Message</span>
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
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Projects</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {clientData.Projects?.map((project, index) => (
                <motion.div
                  key={project?.ID}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 relative overflow-hidden"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full -translate-y-16 translate-x-16"></div>
                  </div>

                  <div className="relative z-10">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-2">
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
                          <code className="text-cyan-400 text-sm bg-black/20 px-3 py-1 rounded-lg">
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
                    <div className="bg-black/20 rounded-2xl p-6 mb-6 space-y-4">
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
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Purposes ({project?.purposes?.length})
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {project?.purposes?.map((purpose) => {
                            // Determine purpose medium from metadata
                            const metadata = purpose.MetaData ? JSON.parse(purpose.MetaData) : null;
                            const medium = metadata?.medium || 'sms'; // default to SMS
                            
                            const mediumColor = medium === 'sms' 
                              ? 'from-blue-500/10 to-cyan-500/10 border-blue-500/20' 
                              : 'from-green-500/10 to-emerald-500/10 border-green-500/20';
                            
                            const mediumIcon = medium === 'sms' 
                              ? <DevicePhoneMobileIcon className="w-4 h-4" />
                              : <ChatBubbleLeftRightIcon className="w-4 h-4" />;

                            return (
                              <motion.div
                                key={purpose?.ID}
                                whileHover={{ scale: 1.02 }}
                                className={`bg-gradient-to-r ${mediumColor} border rounded-xl p-4`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <div className={`p-2 rounded-lg ${medium === 'sms' ? 'bg-blue-500/20' : 'bg-green-500/20'}`}>
                                      {mediumIcon}
                                    </div>
                                    <div>
                                      <h5 className="font-semibold text-white text-sm">
                                        {purpose?.Name}
                                      </h5>
                                      <span className={`text-xs px-2 py-1 rounded ${
                                        medium === 'sms' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                                      }`}>
                                        {medium.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
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
                                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
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
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;