import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming this utility exists based on existing code

const RecentChats = ({ chats, onSelect, onDelete }) => {
    if (!chats || chats.length === 0) return null;

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl mx-auto mt-12"
        >
            <div className="flex items-center gap-2 mb-6 px-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-700">Recent Chats</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {chats.map((chat, index) => (
                    <motion.div
                        key={chat.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-white hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 rounded-2xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer"
                        onClick={() => onSelect(chat)}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-200">
                                {chat.emoji || '💬'}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-slate-800 truncate pr-6 group-hover:text-indigo-600 transition-colors">
                                    {chat.videoTitle || 'Untitled Chat'}
                                </h3>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <span>{formatDate(chat.timestamp)}</span>
                                    <span>•</span>
                                    <span>{chat.messages?.length || 0} messages</span>
                                </p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(chat.id);
                                }}
                                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete chat"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default RecentChats;
