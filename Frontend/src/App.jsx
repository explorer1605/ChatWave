import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import UrlInput from './components/UrlInput';
import ChatInterface from './components/ChatInterface';
import RecentChats from './components/RecentChats';
import { AnimatePresence, motion } from 'framer-motion';
import { getChats, saveChat, deleteChat as deleteChatFromStorage, getRandomEmoji } from './lib/storage';

function App() {
  const [isVideoProcessed, setIsVideoProcessed] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = () => {
    setRecentChats(getChats());
  };

  const handleProcessVideo = (url) => {
    // In a real app, you'd fetch video details here
    const newChat = {
      id: Date.now().toString(),
      videoUrl: url,
      videoTitle: `Video ${url.slice(-11)}`, // Placeholder title
      emoji: getRandomEmoji(),
      messages: [{ id: 1, role: 'ai', content: 'Hello! I\'ve processed the video. What would you like to know?' }],
      timestamp: Date.now()
    };

    saveChat(newChat);
    setCurrentChat(newChat);
    setIsVideoProcessed(true);
    loadChats();
  };

  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
    setIsVideoProcessed(true);
  };

  const handleDeleteChat = (id) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteChatFromStorage(id);
      loadChats();
    }
  };

  const handleUpdateChat = (updatedMessages) => {
    if (currentChat) {
      const updatedChat = { ...currentChat, messages: updatedMessages };
      saveChat(updatedChat);
      setCurrentChat(updatedChat);
      loadChats();
    }
  };

  const handleBack = () => {
    setIsVideoProcessed(false);
    setCurrentChat(null);
    loadChats();
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8 min-h-[80vh] justify-center">
        <AnimatePresence mode="wait">
          {!isVideoProcessed ? (
            <motion.div
              key="input"
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <UrlInput onProcess={handleProcessVideo} />

              <RecentChats
                chats={recentChats}
                onSelect={handleSelectChat}
                onDelete={handleDeleteChat}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <button
                onClick={handleBack}
                className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors pl-2"
              >
                ← Process another video
              </button>
              <ChatInterface
                initialMessages={currentChat?.messages}
                onMessagesChange={handleUpdateChat}
                chatTitle={currentChat?.videoTitle}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

export default App;
