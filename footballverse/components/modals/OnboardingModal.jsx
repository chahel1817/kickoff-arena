'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronRight, X, Shield, Zap, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnboardingModal({ isOpen, onClose }) {
    const router = useRouter();

    const handleStart = () => {
        onClose();
        router.push('/league');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#051015]/95 backdrop-blur-2xl"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                        className="relative w-full max-w-xl bg-[#0a1a20] border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                    >
                        {/* High-level accents */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent" />
                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#00ff88]/5 rounded-full blur-[100px]" />

                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 p-3 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-10 md:p-14 text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#00ff88]/20 to-[#3b82f6]/20 rounded-3xl flex items-center justify-center border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                            >
                                <Trophy size={48} className="text-[#00ff88] filter drop-shadow-[0_0_15px_#00ff88]" />
                            </motion.div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-6 uppercase"
                            >
                                Your Legacy <span style={{ background: 'linear-gradient(135deg, #00ff88 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Starts Now</span>
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/50 text-xl font-medium leading-relaxed mb-12"
                            >
                                Welcome to the elite tier of football management. <br />
                                <span className="text-white">Build your squad, define your tactics, and dominate the arena.</span>
                            </motion.p>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col gap-4"
                            >
                                <button
                                    onClick={handleStart}
                                    className="group relative w-full py-6 rounded-2xl bg-[#00ff88] text-[#01160d] font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(0,255,136,0.3)] border-none cursor-pointer"
                                >
                                    CHOOSE YOUR LEAGUE
                                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-5 rounded-2xl bg-white/5 border border-white/5 text-white/40 font-bold hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                                >
                                    EXPLORE DASHBOARD
                                </button>
                            </motion.div>
                        </div>

                        {/* Bottom decorative stats */}
                        <div className="px-10 py-6 bg-black/40 border-t border-white/5 flex justify-around items-center">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Status</span>
                                <span className="text-xs font-bold text-[#00ff88]">AUTHORIZED</span>
                            </div>
                            <div className="w-[1px] h-8 bg-white/5" />
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Access</span>
                                <span className="text-xs font-bold text-white">ELITE</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
