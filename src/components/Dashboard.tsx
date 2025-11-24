import { useState, useEffect } from 'react';
import { X, Send, Home, QrCode, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardHome from './DashboardHome';
import DashboardInvite from './DashboardInvite';
import DashboardMine from './DashboardMine';
import Header from './Header';
import c from '../styles/colors';
import * as S from '../constants/strings';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{
    full_name: string | null;
    mobile_number: string | null;
    referral_code?: string | null;
    balance?: number | null;
  } | null>(null);
  const [tab, setTab] = useState<'home' | 'invite' | 'mine'>('home');
  const [showPopup, setShowPopup] = useState(true);
  const [homeView, setHomeView] = useState<'daily' | 'vip'>('daily');

  useEffect(() => {
    if (user) {
      try {
        const users = JSON.parse(localStorage.getItem('smg_users') || '[]');
        const found = users.find((u: any) => u.id === user.id);
        if (found) {
          setProfile({
            full_name: found.full_name ?? null,
            mobile_number: found.mobile_number ?? null,
            referral_code: found.referral_code ?? null,
            balance: found.balance ?? 0,
          });
        }
      } catch (e) {
        // ignore
      }
    }
  }, [user]);

  

  const referralCode = profile?.referral_code ?? (user?.id ? user.id.substring(0, 8) : '----');
  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${referralCode}` : `/?ref=${referralCode}`;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header profile={profile} signOut={signOut} onLogoClick={() => setTab('home')} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Popup modal */}
        {showPopup && (
          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
            <div className={c.popupOverlay} onClick={() => setShowPopup(false)}></div>

            <div className={c.popupCard}>
              <button
                aria-label="Close"
                onClick={() => setShowPopup(false)}
                className={c.popupClose}
              >
                <X size={18} />
              </button>

              <div className="p-6 text-center">
                <h2 className="text-2xl font-extrabold text-blue-600">{S.POPUP_TITLE}</h2>
                <div className="text-sm text-slate-500 mt-1 mb-4">{S.POPUP_SUBTITLE}</div>

                <div className="space-y-2 text-left text-slate-700">
                  {S.POPUP_BULLETS.map((b, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="text-2xl">•</div>
                      <div className="text-sm">{b}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <div className="text-base font-bold text-slate-800">{S.POPUP_INVITE_TITLE}</div>
                  <div className="mt-2 text-slate-700">
                    <div className="flex items-center gap-2 justify-center"><span>🎁</span> <span>Level 1 10%</span></div>
                    <div className="flex items-center gap-2 justify-center"><span>🎁</span> <span>Level 2 0%</span></div>
                    <div className="flex items-center gap-2 justify-center"><span>🎁</span> <span>Level 3 0%</span></div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => { setShowPopup(false); /* could open channel link */ }}
                    className={c.btnPrimaryFull}
                  >
                    <Send size={16} />
                    <span>{S.POPUP_CHANNEL_BUTTON}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab content */}
        {tab === 'home' && (
          <DashboardHome profile={profile} homeView={homeView} setHomeView={setHomeView} />
        )}

        {tab === 'invite' && (
          <DashboardInvite referralCode={referralCode} inviteLink={inviteLink} />
        )}

        {tab === 'mine' && (
          <DashboardMine profile={profile} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed left-0 right-0 bottom-4 z-50 flex justify-center">
        <div className={c.bottomNavWrap}>
          <button onClick={() => setTab('home')} className={`flex flex-col items-center text-white/90 ${tab==='home' ? 'text-white' : ''}`}>
            <Home size={18} />
            <span className="text-xs">{S.BOTTOM_HOME}</span>
          </button>
          <button onClick={() => setTab('invite')} className={`flex flex-col items-center text-white/90 ${tab==='invite' ? 'text-white' : ''}`}>
            <QrCode size={18} />
            <span className="text-xs">{S.BOTTOM_INVITE}</span>
          </button>
          <button onClick={() => setTab('mine')} className={`flex flex-col items-center text-white/90 ${tab==='mine' ? 'text-white' : ''}`}>
            <User size={18} />
            <span className="text-xs">{S.BOTTOM_MINE}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
