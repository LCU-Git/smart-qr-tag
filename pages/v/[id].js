import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase'; // Corrected path
import { ShieldCheck, FileText, Lock } from 'lucide-react';

export default function PublicViewer() {
  const router = useRouter();
  const { id } = router.query;
  const [vehicle, setVehicle] = useState(null);
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (id) fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    const { data } = await supabase.from('vehicles').select('*').eq('id', id).single();
    if (data) setVehicle(data);
  };

  const checkPin = () => {
    if (pin === "1234") setIsUnlocked(true);
    else alert("Wrong PIN");
  };

  if (!vehicle) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white italic">Loading Vault...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-20 text-center">
        {!isUnlocked ? (
          <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl">
            <div className="bg-blue-600/20 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-blue-400"><Lock size={40} /></div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{vehicle.vehicle_name}</h2>
            <input 
              type="password" 
              placeholder="••••"
              className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-center text-2xl tracking-[0.5em] mb-4"
              onChange={(e) => setPin(e.target.value)}
            />
            <button onClick={checkPin} className="w-full bg-blue-600 p-4 rounded-2xl font-black uppercase tracking-widest text-sm">Unlock Vault</button>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in duration-500">
             <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[3rem] mb-6">
                <ShieldCheck className="mx-auto text-emerald-400 mb-4" size={48} />
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">{vehicle.vehicle_name}</h2>
                <p className="text-emerald-400/60 text-[10px] font-bold uppercase mt-2">Access Granted</p>
             </div>
             <a href={vehicle.rc_url} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10">
                <div className="flex items-center gap-4">
                  <FileText className="text-blue-400" />
                  <span className="font-black italic uppercase text-sm">{vehicle.document_type}</span>
                </div>
                <span className="text-[10px] font-bold bg-blue-600 px-4 py-1 rounded-full uppercase">View</span>
             </a>
          </div>
        )}
      </div>
    </div>
  );
}