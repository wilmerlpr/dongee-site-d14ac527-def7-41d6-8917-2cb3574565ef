import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { User, Phone, CheckCircle2, Scissors, Loader2, AlertCircle } from 'lucide-react';

export const Booking = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    service_id: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Usamos la NUEVA tabla luxe_services
      const { data, error } = await supabase.from('luxe_services').select('*').eq('active', true);
      if (error) throw error;
      if (data) setServices(data);
    } catch (err: any) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service_id) return alert('Selecciona un servicio');
    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Insertamos en la NUEVA tabla luxe_appointments que no tiene restricciones extrañas
      const appointmentData = {
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        service_id: formData.service_id,
        status: 'pending'
      };

      const { error: insertError } = await supabase.from('luxe_appointments').insert([appointmentData]);

      if (insertError) throw insertError;
      
      navigate('/queue');
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      setErrorMsg(error.message || 'Error desconocido al agendar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 flex justify-center">
      <div className="w-full max-w-lg animate-slide-up">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Solicitar Turno</h2>
          <p className="text-slate-400">Únete a la fila virtual y te avisaremos.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold mb-1">Error:</p>
                <p>{errorMsg}</p>
                <p className="text-xs mt-2 opacity-70">Asegúrate de haber ejecutado el nuevo script SQL para crear las tablas 'luxe_appointments'.</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                required
                type="text" 
                className="glass-input w-full pl-12"
                placeholder="Ej. Juan Pérez"
                value={formData.client_name}
                onChange={e => setFormData({...formData, client_name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Teléfono (Opcional)</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="tel" 
                className="glass-input w-full pl-12"
                placeholder="Ej. 55 1234 5678"
                value={formData.client_phone}
                onChange={e => setFormData({...formData, client_phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300 ml-1">Selecciona Servicio</label>
            <div className="grid grid-cols-1 gap-3">
              {loading ? (
                <div className="text-center py-4 text-slate-400 flex flex-col items-center gap-2">
                   <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                   <span>Cargando servicios...</span>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border border-dashed border-slate-700 rounded-xl">
                  <p>No hay servicios cargados.</p>
                  <p className="text-xs mt-2">Ejecuta el script SQL para poblar 'luxe_services'.</p>
                </div>
              ) : (
                services.map((service) => (
                  <div 
                    key={service.id}
                    onClick={() => setFormData({...formData, service_id: service.id})}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                      formData.service_id === service.id 
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-indigo-500/10 shadow-lg' 
                        : 'bg-slate-900/30 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${formData.service_id === service.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <Scissors className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{service.name}</h4>
                        <p className="text-xs text-slate-400">~{service.duration_minutes} mins</p>
                      </div>
                    </div>
                    <span className="font-bold text-indigo-300">${service.price}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button 
            disabled={submitting}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            {submitting ? 'Procesando...' : 'Confirmar Turno'}
          </button>
        </form>
      </div>
    </div>
  );
};
