import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { addMembership, Plan } from "../store/slices/clientSlice";
import { getApiUrl } from "../config/api";
import { 
  SparklesIcon, 
  RocketLaunchIcon, 
  CheckCircleIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  StarIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

interface MembershipType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const membershipTypes: MembershipType[] = [
  {
    id: 'sms',
    name: 'SMS',
    icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    description: 'Send SMS notifications'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    description: 'Send WhatsApp messages'
  }
];

const CreateMembership: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, clientId } = useAppSelector((state) => state.auth);
  
  const [step, setStep] = useState(1); // 1: Membership Selection, 2: Plan Selection
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch plans when membership types are selected
  useEffect(() => {
    if (selectedMemberships.length > 0) {
      fetchPlans();
    }
  }, [selectedMemberships]);

  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      const response = await fetch(getApiUrl("/plans"));
      const data = await response.json();
      
      if (data.plans) {
        // Filter plans based on selected membership types
        const filteredPlans = data.plans.filter((plan: Plan) => 
          selectedMemberships.includes(plan.Channel.toLowerCase())
        );
        setPlans(filteredPlans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Failed to fetch plans. Please try again.");
    }
    setPlansLoading(false);
  };

  const validateStep1 = () => {
    if (selectedMemberships.length === 0) {
      setError("Please select at least one membership type");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (selectedPlans.length === 0) {
      setError("Please select at least one plan");
      return false;
    }
    setError("");
    return true;
  };

  const handleMembershipToggle = (membershipId: string) => {
    setSelectedMemberships(prev => {
      const newSelection = prev.includes(membershipId)
        ? prev.filter(id => id !== membershipId)
        : [...prev, membershipId];
      
      // Clear selected plans when membership changes
      setSelectedPlans([]);
      return newSelection;
    });
    setError(""); // Clear error when user makes selection
  };

  const handlePlanToggle = (planId: string) => {
    setSelectedPlans(prev => 
      prev.includes(planId)
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
    setError(""); // Clear error when user makes selection
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Create membership payload
      const membershipPayload = selectedPlans.map(planId => ({
        client_id: clientId,
        plan_id: planId
      }));

      const response = await fetch(getApiUrl("/membership"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(membershipPayload),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Add memberships to Redux store
        data.data.forEach((membership: any) => {
          dispatch(addMembership(membership));
        });
        
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 3000);
      } else {
        throw new Error(data.message || "Membership creation failed");
      }

    } catch (error: any) {
      console.error("Membership creation error:", error);
      setError(error.message || "Failed to create membership. Please try again.");
    }
    setLoading(false);
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(""); // Clear errors when going back
    }
  };

  const smsPlans = plans.filter(plan => plan.Channel.toLowerCase() === 'sms');
  const whatsappPlans = plans.filter(plan => plan.Channel.toLowerCase() === 'whatsapp');

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center"
        >
          {/* Celebration Animation */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full mb-6 relative overflow-hidden"
            >
              <SparklesIcon className="w-16 h-16 text-white" />
              
              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
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
                    x: Math.cos(i * 45 * Math.PI / 180) * 60,
                    y: Math.sin(i * 45 * Math.PI / 180) * 60,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            🎉 Membership Plans Added! 🎉
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-300 mb-8"
          >
            Your new membership plans have been activated successfully!
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              🚀 Updating your dashboard...
            </h3>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-3 rounded-full"
              />
            </div>
            
            <p className="text-gray-400 text-sm">
              Activating your plans and setting up your workspace...
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </motion.button>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-6"
          >
            <SparklesIcon className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Add Membership Plans
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Expand your notification capabilities with additional plans
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step >= stepNum
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {step > stepNum ? <CheckCircleIcon className="w-6 h-6" /> : stepNum}
              </div>
              {stepNum < 2 && (
                <div
                  className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    step > stepNum ? "bg-gradient-to-r from-cyan-500 to-purple-500" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start space-x-3"
            >
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Choose Membership Types</h2>
                <p className="text-gray-400 mb-6">Select the notification channels you want to add (you can select both)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {membershipTypes.map((membership) => (
                    <motion.div
                      key={membership.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMembershipToggle(membership.id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedMemberships.includes(membership.id)
                          ? `border-transparent bg-gradient-to-r ${membership.color} bg-opacity-20`
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${membership.color}`}>
                          {membership.icon}
                        </div>
                        {selectedMemberships.includes(membership.id) && (
                          <CheckCircleIcon className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{membership.name}</h3>
                      <p className="text-gray-400">{membership.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Select Your Plans</h2>
                <p className="text-gray-400 mb-6">Choose the plans that best fit your needs</p>
                
                {plansLoading ? (
                  <div className="text-center py-8">
                    <motion.div
                      className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-gray-400 mt-4">Loading plans...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {selectedMemberships.includes('sms') && smsPlans.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-blue-400 mb-6 flex items-center">
                          <DevicePhoneMobileIcon className="w-6 h-6 mr-2" />
                          SMS Plans
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {smsPlans.map((plan) => (
                            <motion.div
                              key={plan.ID}
                              whileHover={{ scale: 1.03, y: -5 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handlePlanToggle(plan.ID)}
                              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                selectedPlans.includes(plan.ID)
                                  ? "border-blue-500 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 shadow-lg shadow-blue-500/25"
                                  : "border-white/10 bg-gradient-to-br from-white/5 to-white/2 hover:border-blue-300/30 hover:shadow-lg"
                              }`}
                            >
                              {/* Background Pattern */}
                              <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full -translate-y-16 translate-x-16"></div>
                              </div>
                              
                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                                    <DevicePhoneMobileIcon className="w-6 h-6 text-white" />
                                  </div>
                                  {selectedPlans.includes(plan.ID) && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="p-1 rounded-full bg-green-500"
                                    >
                                      <CheckCircleIcon className="w-5 h-5 text-white" />
                                    </motion.div>
                                  )}
                                </div>
                                
                                <h4 className="text-xl font-bold text-white mb-2">{plan.Name}</h4>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{plan.Description}</p>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-lg font-bold">
                                      <CurrencyRupeeIcon className="w-5 h-5 text-green-400 mr-1" />
                                      <span className="text-white">₹{plan.Price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <ClockIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                      <span className="text-gray-300">{plan.Duration} days</span>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-black/20 rounded-lg p-3">
                                    <div className="flex items-center justify-center">
                                      <DevicePhoneMobileIcon className="w-4 h-4 text-blue-400 mr-2" />
                                      <span className="text-white font-semibold">{plan.Quota.toLocaleString()} SMS</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-center pt-2">
                                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                    <span className="text-xs text-gray-400">Popular Choice</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMemberships.includes('whatsapp') && whatsappPlans.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
                          <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2" />
                          WhatsApp Plans
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {whatsappPlans.map((plan) => (
                            <motion.div
                              key={plan.ID}
                              whileHover={{ scale: 1.03, y: -5 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handlePlanToggle(plan.ID)}
                              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                selectedPlans.includes(plan.ID)
                                  ? "border-green-500 bg-gradient-to-br from-green-500/20 to-emerald-500/10 shadow-lg shadow-green-500/25"
                                  : "border-white/10 bg-gradient-to-br from-white/5 to-white/2 hover:border-green-300/30 hover:shadow-lg"
                              }`}
                            >
                              {/* Background Pattern */}
                              <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full -translate-y-16 translate-x-16"></div>
                              </div>
                              
                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                                  </div>
                                  {selectedPlans.includes(plan.ID) && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="p-1 rounded-full bg-green-500"
                                    >
                                      <CheckCircleIcon className="w-5 h-5 text-white" />
                                    </motion.div>
                                  )}
                                </div>
                                
                                <h4 className="text-xl font-bold text-white mb-2">{plan.Name}</h4>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{plan.Description}</p>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-lg font-bold">
                                      <CurrencyRupeeIcon className="w-5 h-5 text-green-400 mr-1" />
                                      <span className="text-white">₹{plan.Price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <ClockIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                      <span className="text-gray-300">{plan.Duration} days</span>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-black/20 rounded-lg p-3">
                                    <div className="flex items-center justify-center">
                                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-green-400 mr-2" />
                                      <span className="text-white font-semibold">{plan.Quota.toLocaleString()} messages</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-center pt-2">
                                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                    <span className="text-xs text-gray-400">Premium Choice</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {step < 2 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
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
                    <span>Add Membership Plans</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateMembership;