import Link from 'next/link';
import { QrCode, ShieldCheck, Car } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-center flex-col items-center justify-center p-6 text-white text-center">
      {/* Glassmorphism Card */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl max-w-lg w-full">
        <div className="bg-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50">
          <QrCode size={40} />
        </div>
        
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Smart QR Keychain
        </h1>
        
        <p className="text-slate-300 text-lg mb-8">
          Access your RC, Insurance, and PUC documents instantly with a simple scan. 
          Secure, fast, and always with you.
        </p>

        <div className="grid grid-cols-1 gap-4">
          <Link href="/admin">
            <button className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
              <Car size={20} />
              Setup New Vehicle
            </button>
          </Link>
          
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-4">
            <ShieldCheck size={16} />
            <span>PIN Protected Security</span>
          </div>
        </div>
      </div>

      <footer className="mt-10 text-slate-500 text-sm">
        Family Fleet Management System • 100% Free & Secure
      </footer>
    </div>
  );
}