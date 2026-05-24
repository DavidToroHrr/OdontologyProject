import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import PatientDashboard from './components/PatientDashboard';
import ChatBot from './components/ChatBot'; // <-- Importa el chat

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="w-full min-h-screen bg-white relative"> 
      {currentView === 'landing' ? (
        <LandingPage onStartDemo={() => setCurrentView('demo')} />
      ) : (
        <PatientDashboard onBack={() => setCurrentView('landing')} />
      )}
      
      {/* Añade el componente aquí abajo */}
      <ChatBot />
    </div>
  );
}