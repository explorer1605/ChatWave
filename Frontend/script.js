// Function to switch views with animation
function switchView(viewId) {
    // Remove active class from all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Add active class to the target view
    const target = document.getElementById(viewId);
    target.classList.add('active');
}

// Event: Start Chat
analyzeBtn.addEventListener('click', () => {
    const url = document.getElementById('yt-url').value;
    if (url) {
        switchView('chat-view');
        addToHistory(url);
    }
});

// Event: New Chat (Go Back)
document.getElementById('new-chat-btn').addEventListener('click', () => {
    switchView('landing-view');
});