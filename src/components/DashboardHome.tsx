import { DollarSign, LogOut, Calendar, Users } from 'lucide-react';
import c from '../styles/colors';
import * as S from '../constants/strings';
import bannerImage from '../assets/images/banner.png';
import cardImage from '../assets/images/card.png';

type Profile = {
  full_name: string | null;
  mobile_number: string | null;
  referral_code?: string | null;
  balance?: number | null;
} | null;

export default function DashboardHome({
  profile,
  homeView,
  setHomeView,
}: {
  profile: Profile;
  homeView: 'daily' | 'vip';
  setHomeView: (v: 'daily' | 'vip') => void;
}) {
  return (
    <>
      {/* Hero header */}
      <div className="h-60 lg:h-96 relative mb-6 rounded-xl overflow-hidden">
        <img src={bannerImage} alt="banner" className="w-full h-full object-cover lg:object-fill" />
      </div>

      {/* 4 action cards */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 mb-6">
        <button className={c.cardSmall + ' flex flex-col items-center gap-2'}>
          <div className={'bg-yellow-400/20 p-2 rounded inline-block'}><DollarSign className={'text-yellow-400'} /></div>
          <div className={c.textPrimary + ' text-sm'}>{S.CARD_RECHARGE}</div>
        </button>
        <button className={c.cardSmall + ' flex flex-col items-center gap-2'}>
          <div className={'bg-red-400/20 p-2 rounded inline-block'}><LogOut className={'text-red-400'} /></div>
          <div className={c.textPrimary + ' text-sm'}>{S.CARD_WITHDRAW}</div>
        </button>
        <button className={c.cardSmall + ' flex flex-col items-center gap-2'}>
          <div className={'bg-blue-400/20 p-2 rounded inline-block'}><Users className={'text-blue-400'} /></div>
          <div className={c.textPrimary + ' text-sm'}>{S.CARD_CHANNEL}</div>
        </button>
        <button className={c.cardSmall + ' flex flex-col items-center gap-2'}>
          <div className={'bg-green-400/20 p-2 rounded inline-block'}><Calendar className={'text-green-400'} /></div>
          <div className={c.textPrimary + ' text-sm'}>{S.CARD_HELPINE}</div>
        </button>
      </div>

      {/* Toggle between Daily Income and VIP Plan */}
      <div className={c.toggleWrap}>
        <button onClick={() => setHomeView('daily')} className={`px-4 py-2 rounded-lg ${homeView==='daily' ? 'bg-yellow-400 text-black' : c.textMuted}`}>{S.HOME_DAILY}</button>
        <button onClick={() => setHomeView('vip')} className={`px-4 py-2 rounded-lg ${homeView==='vip' ? 'bg-yellow-400 text-black' : c.textMuted}`}>{S.HOME_VIP}</button>
      </div>

      {/* Card list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {(homeView === 'daily' ? [
          { id: 'd1', title: 'Starter Pack', price: '$5', daily: '$0.5', total: '$10', days: 20, img: cardImage },
          { id: 'd2', title: 'Popular Pack', price: '$20', daily: '$2', total: '$40', days: 20, img: cardImage },
        ] : [
          { id: 'v1', title: 'VIP Bronze', price: '$100', daily: '$8', total: '$240', days: 30, img: cardImage },
          { id: 'v2', title: 'VIP Gold', price: '$500', daily: '$50', total: '$1500', days: 30, img: cardImage },
        ]).map((card) => (
          <div key={card.id} className={c.cardInner}>
            <div className="h-52 lg:h-96 w-full bg-cover lg:bg-fill  bg-center" style={{ backgroundImage: `url('${card.img}')` }}></div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={c.textPrimary + ' font-bold'}>{card.title}</h3>
                  <div className="text-white/60 text-sm">Price: {card.price}</div>
                </div>
                <div className={c.vipText}>{card.daily}/day</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-white/60 text-sm">Total: {card.total}</div>
                <div className="text-white/60 text-sm">Days: {card.days}</div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className={c.btnPrimary}>Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
