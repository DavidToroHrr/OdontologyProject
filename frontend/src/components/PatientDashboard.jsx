import React, { useState } from 'react';
import { 
  Activity, Calendar, Trophy, HeartPulse, LogOut, CheckCircle2, 
  ChevronRight, Video, Gift, ShoppingBag, Clock, ShieldAlert, 
  Menu, X, Stethoscope, BellRing, ActivitySquare, Sparkles 
} from 'lucide-react';

export default function PatientDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('evolution');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [points, setPoints] = useState(4500);
  const [symptomLogged, setSymptomLogged] = useState(false);
  const [videosWatched, setVideosWatched] = useState([]);
  const [rewardsClaimed, setRewardsClaimed] = useState([]);

  const logSymptom = () => {
    setSymptomLogged(true);
    setPoints(prev => prev + 50);
  };

  const watchVideo = (id, reward) => {
    if (!videosWatched.includes(id)) {
      setVideosWatched([...videosWatched, id]);
      setPoints(prev => prev + reward);
    }
  };

  const claimReward = (id, cost) => {
    if (points >= cost && !rewardsClaimed.includes(id)) {
      setPoints(prev => prev - cost);
      setRewardsClaimed([...rewardsClaimed, id]);
    }
  };

  const navItems = [
    { id: 'evolution', label: 'Mi Evolución', icon: ActivitySquare },
    { id: 'appointments', label: 'Mis Citas', icon: Calendar },
    { id: 'rewards', label: 'Recompensas', icon: Trophy },
    { id: 'education', label: 'Educación', icon: HeartPulse },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appointments':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800">Próximas Citas</h2>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-2xl flex flex-col items-center justify-center font-bold">
                  <span className="text-sm">JUN</span>
                  <span className="text-xl">12</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Control de Ortodoncia</h3>
                  <p className="text-slate-600 flex items-center gap-1 text-sm"><Clock size={14}/> 10:00 AM - Dr. Juan Pérez</p>
                </div>
              </div>
              <span className="bg-teal-50 text-teal-700 border border-teal-200 px-4 py-2 rounded-lg text-sm font-bold">
                Confirmada
              </span>
            </div>
          </div>
        );
      
      case 'rewards':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Tienda de Beneficios</h2>
                <p className="text-slate-600 mt-1">Canjea tus TrackPoints por premios reales.</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm text-slate-500 font-medium">Saldo Actual</p>
                <p className="text-2xl font-black text-teal-600">{points} pts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'r1', title: 'Kit de Limpieza Pro', cost: 1500, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-100' },
                { id: 'r2', title: 'Blanqueamiento Básico', cost: 4000, icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-100' },
                { id: 'r3', title: '15% Dcto. Siguiente Control', cost: 3000, icon: Gift, color: 'text-rose-600', bg: 'bg-rose-100' }
              ].map((reward) => (
                <div key={reward.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div>
                    <div className={`w-12 h-12 ${reward.bg} ${reward.color} rounded-xl flex items-center justify-center mb-4`}>
                      <reward.icon size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2">{reward.title}</h3>
                    <p className="text-slate-600 font-semibold mb-6">{reward.cost} pts</p>
                  </div>
                  <button 
                    onClick={() => claimReward(reward.id, reward.cost)}
                    disabled={points < reward.cost || rewardsClaimed.includes(reward.id)}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      rewardsClaimed.includes(reward.id) 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : points >= reward.cost 
                          ? 'bg-slate-900 text-white hover:bg-slate-800' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {rewardsClaimed.includes(reward.id) ? '¡Canjeado!' : 'Canjear'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800">Aprende y Gana</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'v1', title: 'Técnica de cepillado con Brackets', reward: 150, time: '3 min' },
                { id: 'v2', title: '¿Qué hacer si hay sensibilidad?', reward: 100, time: '2 min' }
              ].map((video) => (
                <div key={video.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="h-32 bg-slate-200 relative flex items-center justify-center">
                    <Video size={48} className="text-slate-400 group-hover:text-teal-500 group-hover:scale-110 transition-all duration-300" />
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">{video.time}</span>
                  </div>
                  <div className="p-5 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-900">{video.title}</h3>
                      <p className="text-sm text-teal-600 font-semibold mt-1">+{video.reward} pts</p>
                    </div>
                    <button 
                      onClick={() => watchVideo(video.id, video.reward)}
                      disabled={videosWatched.includes(video.id)}
                      className={`p-3 rounded-full transition-colors ${videosWatched.includes(video.id) ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-600'}`}
                    >
                      {videosWatched.includes(video.id) ? <CheckCircle2 size={24} /> : <ChevronRight size={24} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="text-teal-500"/> Reporte Diario
                  </h2>
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">+50 pts hoy</span>
                </div>

                {!symptomLogged ? (
                  <div className="space-y-4">
                    <p className="text-slate-700 font-medium">¿Cómo te has sentido hoy?</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Excelente', 'Sensibilidad leve', 'Dolor moderado', 'Molestia aguda'].map((nivel, idx) => (
                        <button 
                          key={idx} 
                          onClick={logSymptom} 
                          className="p-4 border border-slate-200 rounded-xl hover:bg-teal-50 hover:border-teal-300 hover:shadow-md transition-all duration-300 text-sm font-bold text-slate-700 flex flex-col items-center gap-3 group"
                        >
                          <span className="text-3xl transition-transform group-hover:scale-110">{['😄', '🙂', '😬', '😫'][idx]}</span>
                          {nivel}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-teal-50 p-6 rounded-xl border border-teal-200 text-center transition-all">
                    <CheckCircle2 className="mx-auto text-teal-500 mb-3" size={48} />
                    <h3 className="font-bold text-teal-900 text-xl">¡Registro Exitoso!</h3>
                    <p className="text-teal-700 mt-2">Has sumado 50 TrackPoints por ser constante.</p>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-600 shrink-0"><ShieldAlert size={28}/></div>
                <div>
                  <h3 className="font-bold text-orange-900 text-lg">Alerta Preventiva</h3>
                  <p className="text-sm text-orange-800 mt-2 leading-relaxed">
                    Notamos que reportaste sensibilidad leve por 3 días consecutivos. Te sugerimos usar crema dental desensibilizante y cepillado suave. El especialista ha sido notificado.
                  </p>
                  <button onClick={() => setActiveTab('education')} className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
                    Ver video recomendado
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl"></div>
                <h2 className="text-lg font-bold mb-1">Racha Actual</h2>
                <p className="text-4xl font-black text-teal-400 my-4 flex items-end gap-2">
                  14 <span className="text-lg font-normal text-slate-400 mb-1">días seguidos</span>
                </p>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
                  <div className="bg-teal-400 h-2 rounded-full w-[70%]"></div>
                </div>
                <p className="text-xs text-slate-400 font-medium">Mantén la racha para bonos extra.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative overflow-hidden text-slate-900 font-sans w-full">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Stethoscope className="text-teal-400" />
            <span className="font-bold text-xl tracking-tight">Dental<span className="text-teal-500">Track</span></span>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === item.id 
                  ? 'bg-teal-500/10 text-teal-400' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onBack} className="flex items-center gap-3 text-slate-400 hover:text-red-400 w-full px-4 py-2 transition-colors">
            <LogOut size={20} /> Salir de la Demo
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto w-full h-screen">
        <header className="bg-white p-4 md:p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200 transition md:hidden"
            >
              <Menu size={24}/>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">Hola, David 👋</h1>
              <p className="text-xs md:text-sm text-slate-600 hidden sm:block">Tu tratamiento va por excelente camino.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">TrackPoints</span>
              <span className="font-black text-teal-600">{points}</span>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition">
              <BellRing size={24} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <img src={`https://ui-avatars.com/api/?name=David&background=0d9488&color=fff&rounded=true`} alt="User" className="w-10 h-10 border-2 border-slate-200 rounded-full shadow-sm" />
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}