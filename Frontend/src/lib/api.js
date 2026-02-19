const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const buildUrl = (path) => `${API_BASE}${path}`;

const fetchJson = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || 'Request failed');
  }

  return data;
};

export const processVideo = async (url) => {
  return fetchJson('/process-video', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
};

export const askQuestion = async (videoId, question) => {
  return fetchJson('/chat', {
    method: 'POST',
    body: JSON.stringify({ video_id: videoId, question }),
  });
};

export const extractVideoIdFromUrl = (url = '') => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '').split('/')[0] || null;
    }
    return parsed.searchParams.get('v');
  } catch {
    return null;
  }
};
