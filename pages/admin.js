import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase'; 
import { Plus, Car, ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
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
    <div className="min-h-screen bg-[#050714] text-white p-6 font-sans">
      <div className="max-w-2xl mx-auto pt-10">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
           <h1 className="text-2xl font-black italic tracking-tighter uppercase bg-gradient-to-r from-[#7EE7A1] to-[#2B7FFF] bg-clip-text text-transparent">
             MY GARAGE
           </h1>
           <Link href="/add" className="bg-[#2B7FFF] p-3 rounded-2xl shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform">
             <Plus size={24} strokeWidth={3} />
           </Link>
        </div>

        {/* VEHICLE LIST */}
        <div className="grid gap-6">
          {vehicles.map((v) => (
            <Link key={v.name} href={`/vehicle/${v.name}`}>
              <div className="bg-[#0D1126] border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between hover:bg-[#141A38] transition-all cursor-pointer group">
                <div className="flex items-center gap-5">
                  <div className="bg-[#1A224D] p-5 rounded-[1.5rem] text-[#4285F4] group-hover:text-white transition-colors">
                    <Car size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none">{v.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">
                      {v.count} {v.count === 1 ? 'DOCUMENT' : 'DOCUMENTS'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}