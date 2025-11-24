import { useState } from 'react';
import { Sun, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from './Toast';
import c from '../styles/colors';
import * as S from '../constants/strings';
import logo from '../assets/images/logo.png';
import cardImage from '../assets/images/card.png';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export function Login({ onSwitchToRegister }: LoginProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobileNumber || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await signIn(mobileNumber, password);
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover opacity-20" style={{ backgroundImage: `url(${cardImage})` }}></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* <div className={c.logoRound}>
              <Sun className={c.logoIcon} size={48} />
            </div> */}
            <img src={logo} alt="logo" className={c.logoIcon}/>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{S.APP_TITLE}</h1>
          <p className="text-blue-200">{S.HERO_SUBTITLE}</p>
        </div>

        <div className={c.panelLarge}>
          <h2 className={c.title + ' text-2xl mb-6 text-center'}>{S.LOGIN_TITLE}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={c.btnAccent}
            >
              {loading ? 'Signing in...' : S.LOGIN_BUTTON}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToRegister}
              className="text-blue-200 hover:text-white transition-colors"
            >
              Don't have an account? <span className="font-semibold">Register</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
