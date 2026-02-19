export const STORAGE_KEY = 'yt_chatbot_history';

export const getChats = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const chats = JSON.parse(stored);
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

        // Filter out chats older than 30 days
        const recentChats = chats.filter(chat => chat.timestamp > thirtyDaysAgo);

        // If we filtered out items, update storage
        if (recentChats.length !== chats.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recentChats));
        }

        return recentChats.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
        console.error('Failed to load chats:', error);
        return [];
    }
};

export const saveChat = (chat) => {
    try {
        const chats = getChats();
        const existingIndex = chats.findIndex(c => c.id === chat.id);

        if (existingIndex >= 0) {
            chats[existingIndex] = { ...chats[existingIndex], ...chat, timestamp: Date.now() };
        } else {
            chats.unshift({
                ...chat,
                timestamp: Date.now(),
                emoji: chat.emoji || getRandomEmoji()
            });
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
        return chats;
    } catch (error) {
        console.error('Failed to save chat:', error);
        return [];
    }
};

export const deleteChat = (id) => {
    try {
        const chats = getChats();
        const newChats = chats.filter(chat => chat.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newChats));
        return newChats;
    } catch (error) {
        console.error('Failed to delete chat:', error);
        return [];
    }
};

const EMOJIS = ['🎥', '🎬', '📺', '📼', '📽️', '🍿', '🎧', '🎸', '🎹', '🎮', '👾', '🚀', '💡', '📚', '🧠', '⚽', '🏀', '🎨', '🏖️', '🏔️'];

export const getRandomEmoji = () => {
    return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
};
