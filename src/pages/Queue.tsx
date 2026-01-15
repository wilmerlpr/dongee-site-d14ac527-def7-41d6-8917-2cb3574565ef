import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, RefreshCw, Armchair } from 'lucide-react';
import { format, addMinutes } from 'date-fns';

export const Queue = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchQueue = async () => {
    setLoading(true);
    // Usamos luxe_appointments y luxe_services
    const { data, error } = await supabase
      .from('luxe_appointments')
      .select(`
        id, client_name, status, created_at, 
        luxe_services ( name, duration_minutes )
      `)
      .in('status', ['pending', 'in_progress'])
      .order('created_at', { ascending: true });

    if (!error && data) {
      setQueue(data);
      setLastUpdated(new Date());
    } else if (error) {
      console.error('Error fetching queue:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 30000); 
    return () => clearInterval(interval);
  }, []);

  const getEstimatedTime = (index: number) => {
    let accumulatedMinutes = 0;
    // Calculamos tiempo basado en la duración de los servicios anteriores
    for (let i = 0; i < index; i++) {
        accumulatedMinutes += queue[i].luxe_services?.duration_minutes || 30;
    }
    return addMinutes(new Date(), accumulatedMinutes);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Fila en Vivo</h2>
            <p className="text-slate-400 mt-1">
              Actualizado: {format(lastUpdated, 'HH:mm:ss')}
            </p>
          </div>
          <button onClick={fetchQueue} className="p-3 rounded-full glass-panel hover:bg-white/10 transition-colors">
            <RefreshCw className={`w-5 h-5 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {queue.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
              <Armchair className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">¡Sillas Disponibles!</h3>
            <p className="text-slate-400">No hay nadie esperando. Ven ahora y te atendemos de inmediato.</p>
          </div>
        ) : (
          <div className="grid gap-4">
             {/* Current Turn Highlight */}
            {queue.find(item => item.status === 'in_progress') && (
              <div className="glass-panel bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/50 p-6 rounded-2xl mb-4">
                <div className="flex items-center gap-4">
                   <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                    </span>
                   <div>
                      <p className="text-indigo-300 font-bold uppercase tracking-wider text-xs">En la silla ahora</p>
                      <h3 className="text-2xl font-bold text-white">{queue.find(item => item.status === 'in_progress').client_name}</h3>
                      <p className="text-white/70 text-sm">{queue.find(item => item.status === 'in_progress').luxe_services?.name}</p>
                   </div>
                </div>
              </div>
            )}

            {/* Waiting List */}
            <div className="space-y-3">
              <h4 className="text-slate-400 font-medium uppercase text-xs tracking-wider ml-2">En Espera</h4>
              {queue.filter(item => item.status === 'pending').map((item, index) => {
                const estimatedTime = getEstimatedTime(index + (queue.some(q => q.status === 'in_progress') ? 1 : 0));
                
                return (
                  <div key={item.id} className="glass-panel p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{item.client_name}</h4>
                        <p className="text-xs text-slate-500">{item.luxe_services?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-indigo-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-sm font-bold">~{format(estimatedTime, 'HH:mm')}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Hora aprox.</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
