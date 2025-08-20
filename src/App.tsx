import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import FloatingActionButton from './components/FloatingActionButton';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import CreatePurpose from './pages/CreatePurpose';
import SendSMS from './pages/SendSMS';
import { ClientProvider } from './context/ClientContext';
import { PlusIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

function App() {
  return (
    <ClientProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <AnimatedBackground />
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/create-purpose" element={<CreatePurpose />} />
              <Route path="/send-sms" element={<SendSMS />} />
            </Routes>
          </AnimatePresence>
          
          {/* Floating Action Buttons */}
          <FloatingActionButton
            to="/create-project"
            icon={<PlusIcon className="w-6 h-6" />}
            label="New Project"
            gradient="from-cyan-500 to-purple-500"
            position="bottom-right"
          />
          
          <FloatingActionButton
            to="/send-sms"
            icon={<PaperAirplaneIcon className="w-6 h-6" />}
            label="Send SMS"
            gradient="from-orange-500 to-red-500"
            position="bottom-left"
          />
        </div>
      </Router>
    </ClientProvider>
  );
}

export default App;