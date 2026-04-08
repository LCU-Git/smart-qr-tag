import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // Corrected for pages/v/id.js
import { Lock, FileText, Car, ShieldCheck, Loader2, Home } from 'lucide-react';
import Link from 'next/link';

export default function VehicleViewer() {
  const router = useRouter();
  const { id } = router.query;
  const [pin, setPin] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (id) {
      const getVehicle = async () => {
        const { data } = await supabase.from('vehicles').select('vehicle_name').eq('id', id).single();
        if (data) setVehicle(data);
      };
      getVehicle();
    }
  }, [id]);

  const verifyPin = async () => {
    setFetching(true);
    setError(''); 
    const { data } = await supabase.from('vehicles').select('*').eq('id', id).eq('passcode', pin).single();
    
    if (data) {
      setVehicle(data);
      setUnlocked(true);
    } else {
      setError('Wrong password. Please try again.');
      setPin('');
    }
    setFetching(false);
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <Link href="/admin" className="p-3 bg-white/5 rounded-2xl text-slate-400 mb-8"><Home size={20} /></Link>
        <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] w-full max-w-sm text-center shadow-2xl backdrop-blur-xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
          <div className="bg-blue-600/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-blue-500"><Lock size={32} /></div>
          <h1 className="text-3xl font-black mb-1 uppercase italic tracking-tighter">{vehicle?.vehicle_name || 'VAULT'}</h1>
          <p className="text-slate-500 mb-10 text-[10px] font-bold uppercase tracking-[0.3em] italic">Security Protocol</p>
          <div className="space-y-5">
              <input type="password" maxLength={4} className="w-full bg-slate-900 border border-white/5 p-6 rounded-3xl text-white text-center text-4xl tracking-[1.2rem] outline-none focus:border-blue-500 font-black" onChange={(e) => setPin(e.target.value)} />
              {error && <div className="text-red-400 bg-red-400/10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">{error}</div>}
              <button onClick={verifyPin} disabled={fetching} className="w-full bg-blue-600 font-black py-6 rounded-3xl active:scale-95 transition-all uppercase tracking-widest text-xs">{fetching ? <Loader2 className="animate-spin mx-auto"/> : 'Access Vault'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white font-sans">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-10 pt-4">
            <Link href="/admin" className="p-3 bg-white/5 rounded-2xl text-slate-400"><Home size={20} /></Link>
            <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] tracking-widest italic uppercase"><ShieldCheck size={16}/> Secured</div>
        </div>
        <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-10 rounded-[3rem] mb-10 flex flex-col items-center text-center">
          <div className="bg-blue-600/20 p-6 rounded-[2rem] text-blue-500 mb-6"><Car size={48}/></div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">{vehicle.vehicle_name}</h2>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="bg-slate-900 p-4 rounded-2xl text-slate-400"><FileText size={24} /></div>
            <div>
              <span className="font-black block text-sm uppercase italic">{vehicle.document_type || 'Document'}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest tracking-tighter">Official Scan</span>
            </div>
          </div>
          <a href={vehicle.rc_url} target="_blank" rel="noreferrer" className="bg-blue-600 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest">Open</a>
        </div>
      </div>
    </div>
  );
}