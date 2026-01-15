import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Check, Play, Trash2, LogOut } from 'lucide-react';

export const Admin = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
  };

  const fetchQueue = async () => {
    // Usamos las nuevas tablas luxe_
    const { data } = await supabase
      .from('luxe_appointments')
      .select('*, luxe_services(name, duration_minutes)')
      .in('status', ['pending', 'in_progress'])
      .order('created_at', { ascending: true });
    if (data) setQueue(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchQueue();
      const interval = setInterval(fetchQueue, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('luxe_appointments').update({ status }).eq('id', id);
    fetchQueue();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="glass-panel p-8 rounded-2xl w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold text-white text-center">Acceso Staff</h2>
          <input 
            type="password" 
            placeholder="Contraseña (admin123)" 
            className="glass-input w-full" 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="btn-primary w-full">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Gestión de Turnos</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-slate-400 hover:text-white">
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* En Progreso */}
          <div className="space-y-4">
            <h3 className="text-indigo-400 font-bold uppercase text-sm tracking-wider">En la Silla (Atendiendo)</h3>
            {queue.filter(q => q.status === 'in_progress').length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-700 text-slate-500 text-center">
                Nadie siendo atendido
              </div>
            ) : (
              queue.filter(q => q.status === 'in_progress').map(item => (
                <div key={item.id} className="glass-panel p-6 rounded-xl border-indigo-500/50 bg-indigo-900/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.client_name}</h3>
                      <p className="text-indigo-300">{item.luxe_services?.name}</p>
                    </div>
                    <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded">En Curso</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateStatus(item.id, 'completed')}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Finalizar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pendientes */}
          <div className="space-y-4">
            <h3 className="text-slate-400 font-bold uppercase text-sm tracking-wider">En Espera ({queue.filter(q => q.status === 'pending').length})</h3>
            <div className="space-y-3">
              {queue.filter(q => q.status === 'pending').map((item, idx) => (
                <div key={item.id} className="glass-panel p-4 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-all">
                  <div>
                    <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
                    <h4 className="font-bold text-white">{item.client_name}</h4>
                    <p className="text-sm text-slate-400">{item.luxe_services?.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateStatus(item.id, 'in_progress')}
                      className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"
                      title="Pasar a la silla"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => updateStatus(item.id, 'cancelled')}
                      className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                      title="Cancelar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {queue.filter(q => q.status === 'pending').length === 0 && (
                <p className="text-slate-500 text-center py-4">No hay clientes esperando.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
