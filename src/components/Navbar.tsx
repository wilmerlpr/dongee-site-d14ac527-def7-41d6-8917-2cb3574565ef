import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors, Clock, UserCog, CalendarDays } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-indigo-400 bg-white/10' : 'text-slate-300 hover:text-white';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto glass-panel border-t md:border-b border-x-0 rounded-none md:rounded-b-2xl h-16">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2">
          <Scissors className="w-6 h-6 text-indigo-400" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">LuxeCuts</span>
        </div>
        
        <div className="flex w-full md:w-auto justify-around md:gap-8">
          <Link to="/" className={`flex flex-col md:flex-row items-center gap-1 p-2 rounded-lg transition-all ${isActive('/')}`}>
            <Scissors className="w-5 h-5" />
            <span className="text-xs md:text-sm font-medium">Inicio</span>
          </Link>
          <Link to="/booking" className={`flex flex-col md:flex-row items-center gap-1 p-2 rounded-lg transition-all ${isActive('/booking')}`}>
            <CalendarDays className="w-5 h-5" />
            <span className="text-xs md:text-sm font-medium">Agendar</span>
          </Link>
          <Link to="/queue" className={`flex flex-col md:flex-row items-center gap-1 p-2 rounded-lg transition-all ${isActive('/queue')}`}>
            <Clock className="w-5 h-5" />
            <span className="text-xs md:text-sm font-medium">Mi Turno</span>
          </Link>
          <Link to="/admin" className={`flex flex-col md:flex-row items-center gap-1 p-2 rounded-lg transition-all ${isActive('/admin')}`}>
            <UserCog className="w-5 h-5" />
            <span className="text-xs md:text-sm font-medium">Staff</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};