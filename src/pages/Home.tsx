import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Clock } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen pb-20 pt-10 md:pt-24 px-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-12 animate-fade-in">
        <div className="text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
            Sistema de Turnos Inteligente 2.0
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Tu estilo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">sin esperas</span> innecesarias.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Reserva tu lugar en la fila desde donde estés. Nuestro sistema híbrido te avisa cuando tu silla está lista. Calidad premium, tiempo optimizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/booking" className="btn-primary flex items-center justify-center gap-2 text-lg">
              Pedir Turno Ahora <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/queue" className="px-6 py-3 rounded-xl glass-panel hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-white">
              Ver Estado de la Fila
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Star className="w-8 h-8 text-yellow-400" />} 
            title="Expertos Estilistas"
            desc="Profesionales certificados con años de experiencia en cortes modernos."
          />
          <FeatureCard 
            icon={<Clock className="w-8 h-8 text-blue-400" />} 
            title="Tiempo Real"
            desc="Monitorea tu posición en la fila y llega justo cuando te toca."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-green-400" />} 
            title="Higiene Total"
            desc="Estándares sanitarios de nivel hospitalario para tu seguridad."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
    <div className="mb-4 p-3 bg-slate-800/50 rounded-lg w-fit">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{desc}</p>
  </div>
);