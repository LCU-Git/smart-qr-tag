import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from './supabase'; 
import { ArrowLeft, Upload, ShieldCheck, ChevronDown, CheckCircle2, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function AddVehicle() {
  const [existingVehicles, setExistingVehicles] = useState([]);
  const [name, setName] = useState('');
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [pin, setPin] = useState('');
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('RC');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAdmin');
    if (!loggedIn) router.push('/login');
    
    const fetchExisting = async () => {
      const { data } = await supabase.from('vehicles').select('vehicle_name');
      if (data) {
        const uniqueNames = [...new Set(data.map(v => v.vehicle_name))];
        setExistingVehicles(uniqueNames);
        if (uniqueNames.length > 0) setName(uniqueNames[0]);
        else setIsNewVehicle(true);
      }
    };
    fetchExisting();
  }, []);

  const handleSave = async () => {
    if (!name || pin.length !== 4 || !file) return alert("All fields are required!");
    setLoading(true);

    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const { error: storageError } = await supabase.storage.from('vehicle-docs').upload(fileName, file);
      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage.from('vehicle-docs').getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('vehicles').insert([
        { vehicle_name: name.toUpperCase(), passcode: pin, rc_url: urlData.publicUrl, document_type: docType }
      ]);

      if (dbError) throw dbError;
      router.push('/admin');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      
      {/* SMART LOGO HEADER */}
      <div className="w-full max-w-md flex flex-col items-center mt-8 mb-12">
        <Link href="/admin">
          <div className="text-center group cursor-pointer">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic tracking-tighter">
              MY GARAGE
            </h1>
            <div className="h-0.5 w-8 bg-blue-500 mx-auto mt-1 group-hover:w-16 transition-all duration-500"></div>
          </div>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
          
          <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase italic tracking-tight">
            <PlusCircle className="text-blue-500" size={24} /> New Record
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Vehicle Selection</label>
                    <button onClick={() => { setIsNewVehicle(!isNewVehicle); setName(''); }} className="text-[10px] font-black text-blue-500 uppercase hover:underline">
                        {isNewVehicle ? "Show List" : "+ New Profile"}
                    </button>
                </div>
                {isNewVehicle ? (
                    <input placeholder="ENTER VEHICLE NAME" className="w-full p-5 bg-slate-900 rounded-2xl outline-none border border-blue-500/20 focus:border-blue-500 uppercase font-bold" value={name} onChange={(e) => setName(e.target.value)} />
                ) : (
                    <div className="relative">
                        <select value={name} onChange={(e) => setName(e.target.value)} className="w-full p-5 bg-slate-900 rounded-2xl outline-none border border-white/5 appearance-none cursor-pointer font-bold uppercase">
                            {existingVehicles.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <ChevronDown className="absolute right-5 top-5 text-slate-500" size={20} />
                    </div>
                )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic px-1">Document Type</label>
              <div className="relative">
                <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full p-5 bg-slate-900 rounded-2xl outline-none border border-white/5 appearance-none cursor-pointer font-bold uppercase">
                  <option value="RC">RC Document</option>
                  <option value="Insurance">Insurance Policy</option>
                  <option value="PUC">Pollution (PUC)</option>
                </select>
                <ChevronDown className="absolute right-5 top-5 text-slate-500" size={20} />
              </div>
            </div>

            <input placeholder="4-DIGIT PIN" maxLength={4} className="w-full p-5 bg-slate-900 rounded-2xl text-center text-3xl tracking-[1rem] outline-none border border-white/5 focus:border-blue-500 font-black" onChange={(e) => setPin(e.target.value)} />
            
            <div className="relative border-2 border-dashed border-white/10 rounded-[2rem] p-10 text-center hover:bg-white/5 transition-all cursor-pointer group">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
              {file ? <CheckCircle2 className="mx-auto text-emerald-400" size={40} /> : <Upload className="mx-auto text-slate-600 group-hover:text-blue-500 transition-colors" size={40} />}
              <p className="text-[10px] font-black text-slate-500 mt-4 uppercase tracking-widest">{file ? file.name : "Select Document"}</p>
            </div>

            <button onClick={handleSave} disabled={loading} className="w-full bg-blue-600 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-900/40 active:scale-95 transition-all text-xs">
              {loading ? "Syncing..." : "Finalize Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}