import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy el asistente virtual de SmileSync. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const currentHistory = [...messages]; 
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    // Contexto simulado para la IA
    const patientContext = {
      name: "David",
      treatment: "Ortodoncia Invisible",
      points: 4500
    };

    try {
      const res = await fetch('https://odontologyproject.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          history: currentHistory, 
          patientContext: patientContext 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'Ups, tuve un error de conexión.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'No me pude conectar con el servidor.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-teal-600 text-white p-4 rounded-full shadow-2xl hover:bg-teal-700 hover:scale-105 transition-all z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Ventana del Chat (Contenedor principal modificado) */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          
          {/* Header Fijo (shrink-0 asegura que no se comprima) */}
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="text-teal-400" />
              <span className="font-bold">Asistente SmileSync</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Área de mensajes con Scroll independiente */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-br-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Animación de "escribiendo" */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            {/* Div invisible para forzar el auto-scroll hacia abajo */}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Input Fijo (shrink-0 para que nunca desaparezca) */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu duda..." 
              className="flex-1 px-4 py-2 bg-slate-100 border-none rounded-full text-sm outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:bg-slate-300 transition"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}