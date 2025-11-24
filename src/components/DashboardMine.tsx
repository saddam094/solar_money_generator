import { User, BarChart3, Smartphone, Users, Sun, DollarSign } from 'lucide-react';
import c from '../styles/colors';
import bannerImage from '../assets/images/banner.png';

type Profile = {
  full_name: string | null;
  mobile_number: string | null;
  referral_code?: string | null;
  balance?: number | null;
} | null;
export default function DashboardMine({ profile }: { profile: Profile }) {
  return (
    <div className="space-y-6">
      <div className="bg-cover bg-center rounded-xl p-6 relative overflow-hidden">
        <img src={bannerImage} alt="banner" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className={"w-20 h-20 rounded-full flex items-center justify-center " + c.cardSmall}>
            <User size={36} className={c.textPrimary} />
          </div>
          <div>
            <p className={c.textPrimary + ' font-bold text-lg'}>{profile?.full_name || 'User'}</p>
            <p className={c.textMuted}>VIP Level: VIP1</p>
            <p className={c.vipText + ' font-bold'}>Balance: {profile?.balance ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'My Devices', icon: Smartphone },
          { label: 'Bank Details', icon: Users },
          { label: 'Income Details', icon: BarChart3 },
          { label: 'About Us', icon: Sun },
          { label: 'Withdraw Details', icon: DollarSign },
          { label: 'Download App', icon: Smartphone },
        ].map((item) => (
          <button key={item.label} className={c.card + ' flex flex-col items-center gap-2'}>
            <item.icon className={c.textPrimary} size={22} />
            <span className={c.textMuted + ' text-sm'}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
