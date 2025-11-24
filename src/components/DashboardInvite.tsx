import { Copy, Share2 } from 'lucide-react';
import c from '../styles/colors';
import * as S from '../constants/strings';

export default function DashboardInvite({ referralCode, inviteLink }: { referralCode: string; inviteLink: string }) {
  return (
    <div className="space-y-6">
      <div className={c.panel + ' flex flex-col md:flex-row items-center gap-4'}>
        <div className={c.qrBox}>
          <img className="w-36 h-36 object-cover" src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(inviteLink)}`} alt="qr" />
        </div>
        <div className="flex-1 w-full">
          <p className="text-white font-medium mb-2">{S.REFERRAL_TITLE}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="px-3 py-2 bg-white/5 rounded text-white font-mono">{referralCode}</div>
            <button
              className={c.btnSecondary}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(referralCode);
                  (await import('./Toast')).toast.success('Referral code copied');
                } catch (e) {
                  (await import('./Toast')).toast.error('Copy failed');
                }
              }}
            >
              <Copy size={16} /> Copy
            </button>
          </div>

          <p className="text-white font-medium mt-4 mb-2">{S.INVITE_LINK_TITLE}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input readOnly value={inviteLink} className={c.input + ' flex-1 w-full'} />
            <button
              className={c.btnSecondary}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(inviteLink);
                  (await import('./Toast')).toast.success('Invite link copied');
                } catch (e) {
                  (await import('./Toast')).toast.error('Copy failed');
                }
              }}
            >
              <Copy size={16} /> Copy
            </button>
            <button
              className={c.btnWarn}
              onClick={async () => {
                try {
                  if ((navigator as any).share) {
                    await (navigator as any).share({ title: 'Invite', text: 'Join me on Solar AI Power', url: inviteLink });
                    (await import('./Toast')).toast.success('Shared');
                  } else {
                    await navigator.clipboard.writeText(inviteLink);
                    (await import('./Toast')).toast.info('Link copied (share not supported)');
                  }
                } catch (e) {
                  (await import('./Toast')).toast.error('Share failed');
                }
              }}
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
