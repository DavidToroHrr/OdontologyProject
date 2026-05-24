import React, { useState } from 'react';
import { 
  Activity, ActivitySquare, ChevronRight, Smartphone, 
  BellRing, HeartPulse, Send, Stethoscope, Menu, X, ShieldAlert 
} from 'lucide-react';

export default function LandingPage({ onStartDemo }) {
  const [formData, setFormData] = useState({ name: '', email: '', clinic: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', msg: '' });
    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', msg: '¡Mensaje enviado con éxito! Te contactaremos pronto.' });
        setFormData({ name: '', email: '', clinic: '', message: '' });
      } else {
        setStatus({ type: 'error', msg: data.error || 'Hubo un error.' });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: 'Error de conexión.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 w-full overflow-x-hidden">
      
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-2 rounded-xl text-white shadow-md">
                <Stethoscope size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">Dental<span className="text-teal-600">Track</span></span>
            </div>
            
            <div className="hidden md:flex space-x-8 text-sm font-semibold text-slate-600">
              <a href="#como-funciona" className="hover:text-teal-600 transition-colors">Cómo Funciona</a>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <button className="text-slate-600 font-bold hover:text-slate-900 transition-colors text-sm">Login Clínicas</button>
              <button onClick={onStartDemo} className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-lg shadow-slate-300 flex items-center gap-2">
                <Activity size={16}/> Iniciar Demo
              </button>
            </div>

            <button className="md:hidden text-slate-700 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 shadow-xl absolute w-full left-0 animate-in slide-in-from-top-2">
            <a href="#como-funciona" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-slate-700 hover:text-teal-600 p-2">Cómo Funciona</a>
            <hr className="border-slate-100" />
            <button onClick={() => { setIsMobileMenuOpen(false); onStartDemo(); }} className="w-full bg-teal-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
              <Activity size={18}/> Iniciar Demo Interactiva
            </button>
          </div>
        )}
      </nav>

      <section className="pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 border border-teal-200 text-teal-800 text-sm font-bold mb-6">
              <Activity size={16} /> Salud Oral Inteligente
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-slate-900">
              El futuro de tu sonrisa, <br className="hidden sm:block" />
              <span className="text-teal-600">impulsado por tecnología.</span>
            </h1>
            <p className="text-lg text-slate-700 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              No somos una clínica tradicional. DentalTrack es una plataforma que te acompaña a diario con monitoreo, recompensas y contacto directo con tu especialista.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={onStartDemo} className="bg-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-700 hover:-translate-y-1 transition-all shadow-xl shadow-teal-200 flex items-center justify-center gap-2">
                Probar Dashboard <ChevronRight size={20} />
              </button>
              <a href="#contacto" className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all text-center">
                Soy Especialista
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative cursor-pointer group px-4 lg:px-0" onClick={onStartDemo}>
            <div className="absolute inset-0 bg-teal-100 rounded-[2.5rem] transform rotate-3 scale-105 -z-10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"></div>
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 relative overflow-hidden transition-all duration-300 group-hover:shadow-teal-900/10">
              
              <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
                  <ActivitySquare size={18}/> Entrar a la Demo
                </span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><ActivitySquare className="text-teal-600"/> Mi Evolución</h3>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Óptimo</span>
              </div>
              
              <div className="space-y-5 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-2"><span className="text-slate-600 font-medium">Inflamación Gingival</span><span className="font-bold text-slate-900">12% ↓</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5"><div className="bg-teal-500 h-2.5 rounded-full w-1/5"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2"><span className="text-slate-600 font-medium">Uso de Alineadores</span><span className="font-bold text-slate-900">22 hrs/día</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5"><div className="bg-slate-800 h-2.5 rounded-full w-[95%]"></div></div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
                <ShieldAlert className="text-orange-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Monitoreo Activo</h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">Tus últimos reportes indican excelente constancia. ¡Sigue así!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Más allá de la consulta dental</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:-translate-y-2 transition-all duration-300">
              <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-700 mb-6"><Smartphone size={28} /></div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Seguimiento Diario</h3>
              <p className="text-slate-700 text-sm leading-relaxed">Reporta diario tus síntomas desde tu celular para evitar complicaciones.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:-translate-y-2 transition-all duration-300">
              <div className="bg-teal-100 w-14 h-14 rounded-2xl flex items-center justify-center text-teal-700 mb-6"><BellRing size={28} /></div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Recordatorios</h3>
              <p className="text-slate-700 text-sm leading-relaxed">Nunca olvides tu medicación, ponerte tus retenedores o agendar tu control.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:-translate-y-2 transition-all duration-300">
              <div className="bg-rose-100 w-14 h-14 rounded-2xl flex items-center justify-center text-rose-700 mb-6"><HeartPulse size={28} /></div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Educación</h3>
              <p className="text-slate-700 text-sm leading-relaxed">Mini videos y explicaciones simples sobre tu tratamiento.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">¿Eres odontólogo o clínica?</h2>
            <p className="mt-4 text-slate-400 text-lg">Digitaliza tus procesos. Conecta con nosotros.</p>
          </div>

          <div className="bg-slate-800 p-8 md:p-10 rounded-3xl border border-slate-700 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nombre Completo</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Correo Electrónico</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nombre de la Clínica / Consultorio</label>
                <input type="text" name="clinic" value={formData.clinic} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">¿Cómo podemos ayudarte?</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} required rows="4" className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition resize-none text-white"></textarea>
              </div>
              
              {status.msg && (
                <div className={`p-4 rounded-xl text-sm font-bold ${status.type === 'success' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                  {status.msg}
                </div>
              )}
              
              <button type="submit" disabled={isSubmitting} className="w-full bg-teal-500 text-white font-bold py-4 rounded-xl hover:bg-teal-600 transition-colors flex justify-center items-center gap-2 disabled:bg-slate-600">
                {isSubmitting ? 'Enviando...' : <><Send size={18}/> Enviar Solicitud de Acceso</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}