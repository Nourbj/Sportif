/**
 * Resolves an image path to a full URL.
 * Handles both legacy external URLs and new local uploads.
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already an external URL (http/https), return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /uploads, prepend the backend URL
  // In development, this is typically handled by the proxy or a full URL
  // We'll assume the path stored in DB is relative to the root (e.g., /uploads/filename.jpg)
  const backendUrl = process.env.REACT_APP_API_URL || '';
  return `${backendUrl}${imagePath}`;
};
