import { useState } from 'react';
import { useRouter } from 'next/router';
import { ShieldCheck, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Accessing the variables from your .env.local
    const expectedUser = process.env.NEXT_PUBLIC_ADMIN_USER;
    const expectedPass = process.env.NEXT_PUBLIC_ADMIN_PASS;

    if (username === expectedUser && password === expectedPass) {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin');
    } else {
      setError('Invalid Username or Password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] w-full max-w-md shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>

        <div className="bg-blue-600/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-blue-500 shadow-inner">
          <ShieldCheck size={40} />
        </div>
        
        <h1 className="text-3xl font-black text-center mb-1 uppercase italic tracking-tighter">Master Admin</h1>
        <p className="text-slate-500 text-center mb-10 text-[10px] font-bold uppercase tracking-[0.3em]">Authorized Access Only</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="USERNAME" 
              className="w-full bg-slate-900 border border-white/5 p-5 pl-14 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold text-sm"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="password" 
              placeholder="PASSWORD" 
              className="w-full bg-slate-900 border border-white/5 p-5 pl-14 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold text-sm"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-pulse">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 font-black py-6 rounded-3xl shadow-xl transition-all active:scale-95 flex justify-center uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Secure Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}