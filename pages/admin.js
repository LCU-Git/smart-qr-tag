import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase'; 
import { Plus, Car, QrCode, X, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [showQR, setShowQR] = useState(null);
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
      // Grouping to show one card per vehicle
      const grouped = data.reduce((acc, obj) => {
        if (!acc[obj.vehicle_name]) acc[obj.vehicle_name] = obj;
        return acc;
      }, {});
      setVehicles(Object.values(grouped));
    }
  };

  return (
    <div className="min-h-screen bg-[#050714] text-white p-6 font-sans">
      <div className="max-w-2xl mx-auto pt-10">
        <div className="flex justify-between items-center mb-12">
           <h1 className="text-2xl font-black italic tracking-tighter uppercase bg-gradient-to-r from-[#7EE7A1] to-[#2B7FFF] bg-clip-text text-transparent">MY GARAGE</h1>
           <Link href="/add" className="bg-[#2B7FFF] p-3 rounded-2xl"><Plus size={24} /></Link>
        </div>

        <div className="grid gap-6">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-[#0D1126] border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between group">
              <Link href={`/vehicle/${v.vehicle_name}`} className="flex items-center gap-5 flex-1">
                <div className="bg-[#1A224D] p-5 rounded-[1.5rem] text-[#4285F4]"><Car size={28} /></div>
                <div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">{v.vehicle_name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">TAP TO VIEW DOCUMENTS</p>
                </div>
              </Link>
              
              <button onClick={() => setShowQR(`${baseUrl}/v/${v.id}`)} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
                <QrCode size={24} />
              </button>
            </div>
          ))}
        </div>

        {showQR && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
            <div className="bg-[#0D1126] p-10 rounded-[3rem] border border-white/10 text-center relative max-w-sm w-full">
              <button onClick={() => setShowQR(null)} className="absolute top-6 right-6 text-slate-500"><X /></button>
              <h2 className="text-xl font-black italic uppercase mb-8">VEHICLE QR CODE</h2>
              <div className="bg-white p-4 rounded-3xl inline-block mb-6">
                <QRCodeSVG value={showQR} size={200} />
              </div>
              <p className="text-[10px] text-slate-600 font-bold break-all uppercase mb-6 tracking-widest">{showQR}</p>
              <a href={showQR} target="_blank" className="flex items-center justify-center gap-2 text-blue-400 font-bold text-xs uppercase"><ExternalLink size={14}/> Test Link</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}