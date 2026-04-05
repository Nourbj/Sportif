/**
 * Utility to parse video URLs and return an embeddable URL or direct source.
 * Currently supports YouTube and direct links.
 */
export const getEmbedUrl = (url) => {
  if (!url) return null;

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/i;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // If it's already an embed link
  if (url.includes('/embed/') || url.includes('player.vimeo.com')) {
    return url;
  }

  return null; // Return null if not a known embeddable hosting site (might be a direct mp4)
};

export const isDirectVideo = (url) => {
  if (!url) return false;
  return url.match(/\.(mp4|webm|ogg)$/i);
};
