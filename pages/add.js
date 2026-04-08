import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import { ChevronLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AddVehicle() {
  const [name, setName] = useState('');
  const [docType, setDocType] = useState('Registration (RC)');
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    if(!name || !url) return alert("Please fill all fields");
    const { error } = await supabase.from('vehicles').insert([
      { vehicle_name: name, document_type: docType, rc_url: url }
    ]);
    if (!error) router.push('/admin');
    else alert(error.message);
  };

  return (
    <div className="min-h-screen bg-[#050714] text-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-10">
        
        <Link href="/admin" className="text-slate-500 flex items-center gap-1 mb-10 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-widest">
          <ChevronLeft size={18}/> Back
        </Link>

        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10">
          ADD DOCUMENT
        </h1>

        <div className="space-y-4">
          <div className="bg-[#0D1126] rounded-[1.5rem] p-2 border border-white/5">
            <input 
              placeholder="Vehicle Name (e.g. XL6)" 
              className="w-full bg-transparent p-4 outline-none font-bold placeholder:text-slate-600" 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="bg-[#0D1126] rounded-[1.5rem] p-2 border border-white/5">
            <select 
              className="w-full bg-transparent p-4 outline-none font-bold appearance-none cursor-pointer" 
              onChange={(e) => setDocType(e.target.value)}
            >
              <option className="bg-[#0D1126]">Registration (RC)</option>
              <option className="bg-[#0D1126]">Insurance</option>
              <option className="bg-[#0D1126]">Pollution (PUC)</option>
            </select>
          </div>

          <div className="bg-[#0D1126] rounded-[1.5rem] p-2 border border-white/5">
            <input 
              placeholder="Document Google Drive Link" 
              className="w-full bg-transparent p-4 outline-none font-bold placeholder:text-slate-600" 
              onChange={(e) => setUrl(e.target.value)} 
            />
          </div>

          <button 
            onClick={handleSave} 
            className="w-full bg-[#2B7FFF] p-6 rounded-[1.5rem] font-black italic uppercase tracking-widest flex items-center justify-center gap-3 mt-6 shadow-xl shadow-blue-600/20 hover:bg-[#3b8bff] transition-all active:scale-95"
          >
            <FileText size={20} /> Save to Vault
          </button>
        </div>
      </div>
    </div>
  );
}