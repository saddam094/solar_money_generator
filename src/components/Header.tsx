import { Sun, LogOut } from 'lucide-react';
import c from '../styles/colors';
import * as S from '../constants/strings';
import logo from '../assets/images/logo.png';

type Profile = {
  full_name: string | null;
  mobile_number: string | null;
} | null;

export default function Header({ profile, signOut, onLogoClick }: { profile: Profile; signOut: () => void; onLogoClick?: () => void }) {
  return (
    <nav className={c.nav}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => onLogoClick?.()} className={c.logoBg + ' p-0 border-0 cursor-pointer'} aria-label="Go to home">
              <img src={logo} alt="logo" className="w-8 h-8 rounded-lg border border-white " />
            </button>
            <span className={c.title}>{S.APP_TITLE}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className={c.textPrimary + ' font-medium'}>{profile?.full_name || 'User'}</p>
              <p className="text-blue-200 text-sm">{profile?.mobile_number || ''}</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
