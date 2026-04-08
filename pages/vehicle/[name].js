import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // Corrected path to pages/supabase.js
import Link from 'next/link';
import { Home, Plus, Car, FileText, Trash2, ShieldCheck } from 'lucide-react';

export default function VehicleFolder() {
  const router = useRouter();
  const { name } = router.query;
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAdmin');
    if (!loggedIn) router.push('/login');
    if (name) fetchDocs();
  }, [name]);

  const fetchDocs = async () => {
    const { data } = await supabase.from('vehicles').select('*').eq('vehicle_name', name);
    if (data) setDocs(data);
  };

  const deleteDoc = async (id) => {
    if (confirm("Delete this document?")) {
      await supabase.from('vehicles').delete().eq('id', id);
      fetchDocs();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-2xl mx-auto pt-10">
        
        {/* TOP NAVIGATION */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/admin" className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-blue-400 transition-all">
            <Home size={20} />
          </Link>
          <Link href="/admin">
            <div className="text-center group cursor-pointer">
              <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic tracking-tighter uppercase">
                MY GARAGE
              </h1>
            </div>
          </Link>
          <Link href="/add" className="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
            <Plus size={20} />
          </Link>
        </div>

        {/* HEADER CARD */}
        <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-8 rounded-[3rem] mb-8 flex items-center gap-6 backdrop-blur-md">
          <div className="bg-blue-600/20 p-5 rounded-[1.5rem] text-blue-400">
            <Car size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">{name}</h2>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] tracking-widest uppercase mt-1">
              <ShieldCheck size={14}/> {docs.length} Documents Secured
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {docs.map((doc) => (
            <div key={doc.id} className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex items-center justify-between group hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 p-4 rounded-2xl text-slate-400 group-hover:text-blue-400">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-black italic text-sm uppercase">{doc.document_type || 'Document'}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Verified Digital Copy</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={doc.rc_url} target="_blank" rel="noreferrer" className="bg-slate-900 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600">
                  View
                </a>
                <button onClick={() => deleteDoc(doc.id)} className="p-2 text-slate-600 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}