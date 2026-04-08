import { useState, useEffect } from 'react';
import { supabase } from './supabase'; // Corrected for same folder
import { Trash2, Car, Plus, QrCode, X, Search, LogOut, FileText } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedQR, setSelectedQR] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAdmin');
    if (!loggedIn) router.push('/login');
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const { data } = await supabase.from('vehicles').select('*');
    if (data) {
      const grouped = data.reduce((acc, obj) => {
        const key = obj.vehicle_name;
        if (!acc[key]) acc[key] = { name: key, id: obj.id, count: 0 };
        acc[key].count += 1;
        return acc;
      }, {});
      setVehicles(Object.values(grouped));
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 font-sans">
      <div className="p-6 md:p-12 max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-10">
          <Link href="/admin" className="group cursor-pointer">
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic transition-all group-hover:drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                MY GARAGE
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-[2px] w-4 bg-blue-500 rounded-full group-hover:w-12 transition-all duration-500"></div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Fleet Management</p>
              </div>
          </Link>
          <button onClick={() => { localStorage.removeItem('isAdmin'); router.push('/login'); }} 
                  className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-red-400 transition-all">
            <LogOut size={20} />
          </button>
        </div>

        <div className="relative mb-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input type="text" placeholder="Search your fleet..." 
                 className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-[2rem] outline-none focus:border-blue-500/50 transition-all text-lg backdrop-blur-sm"
                 onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <div key={v.id} className="relative group">
                <Link href={`/vehicle/${encodeURIComponent(v.name)}`}>
                    <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-8 rounded-[3rem] hover:border-blue-500/50 transition-all cursor-pointer h-full backdrop-blur-md">
                        <div className="bg-blue-600/20 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform">
                            <Car size={36} />
                        </div>
                        <h3 className="text-2xl font-black mb-1 tracking-tight uppercase italic">{v.name}</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                           <FileText size={12}/> {v.count} Documents
                        </p>
                    </div>
                </Link>
                <button onClick={() => setSelectedQR(`${window.location.origin}/v/${v.id}`)}
                        className="absolute top-6 right-6 p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl text-slate-400 hover:text-blue-400 transition-all border border-white/5 shadow-xl">
                    <QrCode size={20} />
                </button>
            </div>
          ))}
        </div>
      </div>

      <Link href="/add">
        <button className="fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-500 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all active:scale-90 z-40 group">
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </Link>

      {selectedQR && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-white p-10 rounded-[4rem] text-center relative max-w-sm w-full">
            <button onClick={() => setSelectedQR(null)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500">
              <X size={28} />
            </button>
            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Vault Key</h2>
            <div className="p-6 bg-slate-50 rounded-[3rem] inline-block mb-10 border border-slate-100">
              <QRCodeCanvas value={selectedQR} size={220} level={"H"} includeMargin={true} />
            </div>
            <button onClick={() => window.print()} className="w-full bg-slate-950 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs">
              Print Sticker
            </button>
          </div>
        </div>
      )}
    </div>
  );
}