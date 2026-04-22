'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Trophy, Zap, Users, Shield } from 'lucide-react';

const LOADING_STEPS = [
    { text: "Initializing Arena...", icon: <Zap className="w-6 h-6" /> },
    { text: "Recruiting Talent...", icon: <Users className="w-6 h-6" /> },
    { text: "Preparing the Pitch...", icon: <Shield className="w-6 h-6" /> },
    { text: "Calibrating Tactics...", icon: <Trophy className="w-6 h-6" /> },
    { text: "Ready for Kickoff!", icon: <Zap className="w-6 h-6" /> }
];

export default function InitialLoader({ onComplete }) {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
        }, 800);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.random() * 15;
                return next >= 100 ? 100 : next;
            });
        }, 300);

        const timeout = setTimeout(() => {
            if (onComplete) onComplete();
        }, 4500);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
            clearTimeout(timeout);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070a] text-white overflow-hidden"
        >
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00ff88]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
                {/* Logo Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                    }}
                    className="mb-12 relative"
                >
                    <div className="w-24 h-24 bg-gradient-to-tr from-[#00ff88] to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(0,255,136,0.3)] rotate-12">
                        <Trophy className="w-12 h-12 text-black -rotate-12" />
                    </div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-10px] border border-dashed border-[#00ff88]/30 rounded-2xl"
                    />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00ff88] to-white bg-[length:200%_auto] animate-shimmer"
                >
                    KICKOFF ARENA
                </motion.h1>
                <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.6 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs font-medium tracking-[0.4em] uppercase mb-12 text-[#00ff88]"
                >
                    The Ultimate Manager
                </motion.p>

                {/* Progress Bar Container */}
                <div className="w-full mb-8">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#00ff88] via-[#00ff88] to-blue-500 shadow-[0_0_15px_rgba(0,255,136,0.5)]"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                        />
                    </div>
                    <div className="flex justify-between mt-4 px-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center gap-2 text-[#00ff88]"
                            >
                                {LOADING_STEPS[step].icon}
                                <span className="text-sm font-bold tracking-tight uppercase">
                                    {LOADING_STEPS[step].text}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                        <span className="text-sm font-mono text-[#00ff88]/60">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>

                {/* Professional Footer Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium"
                >
                    Optimizing Assets • Initializing Core
                </motion.div>
            </div>

            {/* Decorative bottom line */}
            <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-[#00ff88]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 4.5, ease: "linear" }}
            />
        </motion.div>
    );
}
