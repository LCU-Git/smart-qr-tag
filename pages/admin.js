import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase'; 
import { Home, Plus, Car, FileText, Trash2, ChevronRight, LogOut, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const { data } = await supabase.from('vehicles').select('*');
    if (data) {
      const grouped = data.reduce((acc, obj) => {
        const key = obj.vehicle_name;
        if (!acc[key]) acc[key] = { name: key, count: 0 };
        acc[key].count += 1;
        return acc;
      }, {});
      setVehicles(Object.values(grouped));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto pt-10">
        <div className="flex justify-between items-center mb-12">
           <h1 className="text-2xl font-black italic tracking-tighter uppercase bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">MY GARAGE</h1>
           <Link href="/add" className="bg-blue-600 p-3 rounded-2xl"><Plus size={20}/></Link>
        </div>
        <div className="grid gap-4">
          {vehicles.map((v) => (
            <Link key={v.name} href={`/vehicle/${v.name}`}>
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600/20 p-4 rounded-2xl text-blue-400"><Car size={24}/></div>
                  <div>
                    <h3 className="font-black italic uppercase tracking-tighter">{v.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{v.count} Documents</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-600"/>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}