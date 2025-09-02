/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";
import { 
  TagIcon, 
  ArrowLeftIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { addPurpose, Purpose } from "../store/slices/clientSlice";

interface Variable {
  name: string;
  type: 'text' | 'number';
  position: number;
}

const CreatePurpose: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const client = useAppSelector((state) => state.client.clientData);

  const [step, setStep] = useState(1); // 1: Medium Selection, 2: Purpose Details
  const [selectedMedium, setSelectedMedium] = useState<'sms' | 'whatsapp' | ''>('');
  const [formData, setFormData] = useState({
    projectId: "",
    name: "",
    description: "",
    templateId: "",
    language: "en_US",
    templateType: "utility",
  });
  const [variables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const mediumOptions = [
    {
      id: 'sms' as const,
      name: 'SMS',
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Create SMS purpose'
    },
    {
      id: 'whatsapp' as const,
      name: 'WhatsApp',
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Create WhatsApp purpose'
    }
  ];

  const languageOptions = [
    { code: 'en_US', name: 'English (US)' },
    { code: 'en_GB', name: 'English (UK)' },
    { code: 'hi_IN', name: 'Hindi (India)' },
    { code: 'es_ES', name: 'Spanish (Spain)' },
    { code: 'fr_FR', name: 'French (France)' },
  ];

  const templateTypeOptions = [
    { value: 'utility', name: 'Utility' },
    { value: 'marketing', name: 'Marketing' },
  ];

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

  const validateStep1 = () => {
    if (!selectedMedium) {
      setError("Please select a medium (SMS or WhatsApp)");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!formData.projectId) {
      setError("Please select a project");
      return false;
    }
    if (!formData.name.trim()) {
      setError("Purpose name is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.templateId.trim()) {
      setError("Template ID is required");
      return false;
    }
    
    // Validate variables for WhatsApp
    if (selectedMedium === 'whatsapp' && variables.length > 0) {
      const positions = variables.map(v => v.position);
      const uniquePositions = new Set(positions);
      if (positions.length !== uniquePositions.size) {
        setError("Variable positions must be unique");
        return false;
      }
      
      for (const variable of variables) {
        if (!variable.name.trim()) {
          setError("All variable names are required");
          return false;
        }
      }
    }
    
    setError("");
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const addVariable = () => {
    const nextPosition = variables.length > 0 ? Math.max(...variables.map(v => v.position)) + 1 : 1;
    setVariables([...variables, { name: '', type: 'text', position: nextPosition }]);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: keyof Variable, value: any) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);

    try {
      let metadata: any = {
        medium: selectedMedium
      };

      if (selectedMedium === 'whatsapp') {
        metadata = {
          ...metadata,
          language: { code: formData.language },
          variables: variables,
          template_type: formData.templateType
        };
      }

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
          metadata: JSON.stringify(metadata),
        }),
      });

      const data = await response.json();
      setApiResponse(data);

      if (data.status === "success") {
        const purpose: Purpose = {
          ...data.data,
          MetaData: JSON.stringify(metadata)
        };
        dispatch(addPurpose({ projectId: formData.projectId, purpose }));
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        setError(data.message || "Failed to create purpose");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create purpose. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step >= stepNum
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {step > stepNum ? (
                <CheckCircleIcon className="w-6 h-6" />
              ) : (
                stepNum
              )}
            </div>
            {stepNum < 2 && (
              <div
                className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  step > stepNum
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-gray-700"
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
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {!apiResponse ? (
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Choose Medium</h2>
                <p className="text-gray-400 mb-6">Select the communication medium for this purpose</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mediumOptions.map((medium) => (
                    <motion.div
                      key={medium.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMedium(medium.id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedMedium === medium.id
                          ? `border-transparent bg-gradient-to-r ${medium.color} bg-opacity-20`
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${medium.color}`}>
                          {medium.icon}
                        </div>
                        {selectedMedium === medium.id && (
                          <CheckCircleIcon className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{medium.name}</h3>
                      <p className="text-gray-400">{medium.description}</p>
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
                <h2 className="text-2xl font-bold text-white mb-6">Purpose Configuration</h2>
                <p className="text-gray-400 mb-6">Configure your {selectedMedium?.toUpperCase()} purpose</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Select Project *
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
                      Purpose Name *
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
                      Description *
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
                      Template ID *
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

                  {/* WhatsApp specific fields */}
                  {selectedMedium === 'whatsapp' && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 space-y-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-green-300">WhatsApp Configuration</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Language *
                          </label>
                          <select
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                          >
                            {languageOptions.map((lang) => (
                              <option key={lang.code} value={lang.code} className="bg-gray-800">
                                {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Template Type *
                          </label>
                          <select
                            value={formData.templateType}
                            onChange={(e) => setFormData({ ...formData, templateType: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                          >
                            {templateTypeOptions.map((type) => (
                              <option key={type.value} value={type.value} className="bg-gray-800">
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Variables Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-semibold text-gray-300">
                            Variables (Optional)
                          </label>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addVariable}
                            className="px-3 py-2 bg-green-500/20 text-green-300 rounded-lg flex items-center space-x-2 text-sm"
                          >
                            <PlusIcon className="w-4 h-4" />
                            <span>Add Variable</span>
                          </motion.button>
                        </div>

                        {variables.length > 0 && (
                          <div className="space-y-4">
                            {variables.map((variable, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-black/20 rounded-xl p-4 border border-green-500/10"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">
                                      Variable Name
                                    </label>
                                    <input
                                      type="text"
                                      value={variable.name}
                                      onChange={(e) => updateVariable(index, 'name', e.target.value)}
                                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500/50"
                                      placeholder="customer_name"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">
                                      Type
                                    </label>
                                    <select
                                      value={variable.type}
                                      onChange={(e) => updateVariable(index, 'type', e.target.value as 'text' | 'number')}
                                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500/50"
                                    >
                                      <option value="text" className="bg-gray-800">Text</option>
                                      <option value="number" className="bg-gray-800">Number</option>
                                    </select>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">
                                      Position
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={variable.position}
                                      onChange={(e) => updateVariable(index, 'position', parseInt(e.target.value))}
                                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500/50"
                                    />
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={() => removeVariable(index)}
                                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
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
                  <span className="text-gray-400">Medium: </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedMedium === 'sms' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                  }`}>
                    {selectedMedium?.toUpperCase()}
                  </span>
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

        {/* Navigation Buttons */}
        {!apiResponse && (
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
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
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
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CreatePurpose;