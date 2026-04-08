import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function AddVehicle() {
  const [name, setName] = useState('');
  const [docType, setDocType] = useState('RC');
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    const { error } = await supabase.from('vehicles').insert([
      { vehicle_name: name, document_type: docType, rc_url: url }
    ]);
    if (!error) router.push('/admin');
    else alert(error.message);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-md mx-auto pt-10">
        <Link href="/admin" className="text-slate-500 flex items-center gap-2 mb-8"><ArrowLeft size={16}/> Back</Link>
        <h1 className="text-3xl font-black italic uppercase mb-8">Add Document</h1>
        <div className="space-y-6">
          <input placeholder="Vehicle Name (e.g. XL6)" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl" onChange={(e) => setName(e.target.value)} />
          <select className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl" onChange={(e) => setDocType(e.target.value)}>
            <option value="RC">Registration (RC)</option>
            <option value="Insurance">Insurance</option>
            <option value="Pollution">Pollution (PUC)</option>
          </select>
          <input placeholder="Document Google Drive Link" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl" onChange={(e) => setUrl(e.target.value)} />
          <button onClick={handleSave} className="w-full bg-blue-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2"><Save size={20}/> Save to Vault</button>
        </div>
      </div>
    </div>
  );
}