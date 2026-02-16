import { Shield } from 'lucide-react';

export default function PlayerCard({ player }) {
    return (
        <div className="glass p-5 rounded-2xl card-hover flex flex-col items-center">
            <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-white/5 to-white/10 rounded-xl mb-4 overflow-hidden border border-white/5">
                <div className="absolute top-2 left-2 bg-primary/20 px-2 py-1 rounded text-[10px] font-bold text-primary">
                    {player?.rating || 85} OVR
                </div>
                <div className="flex items-center justify-center h-full">
                    <Shield className="w-16 h-16 text-white/10" />
                </div>
            </div>
            <h3 className="text-lg font-bold truncate w-full text-center">{player?.name || 'Unknown Player'}</h3>
            <p className="text-muted text-xs uppercase tracking-widest">{player?.position || 'Forward'}</p>

            <div className="mt-4 flex gap-2 w-full">
                <div className="flex-1 bg-white/5 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-muted uppercase">PAC</p>
                    <p className="font-bold">{player?.stats?.pac || 90}</p>
                </div>
                <div className="flex-1 bg-white/5 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-muted uppercase">SHO</p>
                    <p className="font-bold">{player?.stats?.sho || 88}</p>
                </div>
                <div className="flex-1 bg-white/5 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-muted uppercase">DRI</p>
                    <p className="font-bold">{player?.stats?.dri || 85}</p>
                </div>
            </div>
        </div>
    );
}
