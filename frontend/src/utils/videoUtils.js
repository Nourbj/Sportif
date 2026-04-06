import { getFullImageUrl } from './imageUtils';

export const getFullVideoUrl = (videoPath) => getFullImageUrl(videoPath);

export const getYouTubeEmbedUrl = (url = '') => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.replace('/', '').trim();
      return id ? `https://www.youtube.com/embed/${id}` : '';
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        const id = parsed.searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : '';
      }
      if (parsed.pathname.startsWith('/embed/')) {
        const id = parsed.pathname.split('/embed/')[1];
        return id ? `https://www.youtube.com/embed/${id}` : '';
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/shorts/')[1];
        return id ? `https://www.youtube.com/embed/${id}` : '';
      }
    }
  } catch (err) {
    return '';
  }
  return '';
};

export const getEmbedUrl = (url = '') => getYouTubeEmbedUrl(url);

export const isDirectVideo = (url = '') => {
  if (!url) return false;
  if (url.startsWith('data:') || url.startsWith('blob:')) return true;
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) return true;
  const lower = url.toLowerCase();
  return ['.mp4', '.webm', '.ogg', '.mov', '.m4v'].some(ext => lower.includes(ext));
};
