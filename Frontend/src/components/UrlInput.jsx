import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, ArrowRight, CheckCircle2, Loader2, Youtube } from 'lucide-react';
import { cn } from '../lib/utils';

const UrlInput = ({ onProcess }) => {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) return;

        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            onProcess(url);
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4 border border-slate-100">
                    <Youtube className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-2">
                    YouTube Chatbot
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Chat with any YouTube video. Just paste the URL below.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group">
                <div className={cn(
                    "absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl transition-all duration-300",
                    status === 'loading' ? "bg-indigo-500/10 blur-2xl" : "group-hover:bg-indigo-500/10"
                )} />

                <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 flex items-center transition-all duration-300 focus-within:shadow-2xl focus-within:border-indigo-100 focus-within:ring-4 focus-within:ring-indigo-500/10">
                    <div className="pl-4 text-slate-400">
                        <Link2 className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste YouTube URL here..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 h-10 px-4 text-lg w-full outline-none"
                        disabled={status === 'loading'}
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading' || !url}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
                            status === 'loading'
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                        )}
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing</span>
                            </>
                        ) : status === 'success' ? (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Ready</span>
                            </>
                        ) : (
                            <>
                                <span>Chat</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default UrlInput;
