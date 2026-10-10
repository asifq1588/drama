/**
 * Media URL cleaning & transformation utilities
 * Solves thumbnail loading failures and video embed/stream issues
 */

export const DEFAULT_POSTER_FALLBACK = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80';
export const DEFAULT_BANNER_FALLBACK = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80';

/**
 * Converts various image links (Google Drive, Dropbox, Blogger, etc.) into clean direct image URLs
 */
export function getCleanImageUrl(rawUrl?: string, fallback: string = DEFAULT_POSTER_FALLBACK): string {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return fallback;
  }

  let url = rawUrl.trim();

  // 0. Extract direct image URL if user pasted HTML embed (common on imgbb.com)
  // e.g. <a href="..."><img src="https://i.ibb.co/xyz/image.jpg" ...></a>
  const htmlImgMatch = url.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (htmlImgMatch && htmlImgMatch[1]) {
    url = htmlImgMatch[1].trim();
  }

  // Extract from BBCode (common on imgbb.com: [img]https://i.ibb.co/xyz.jpg[/img])
  const bbCodeMatch = url.match(/\[img\](.*?)\[\/img\]/i);
  if (bbCodeMatch && bbCodeMatch[1]) {
    url = bbCodeMatch[1].trim();
  }

  // Extract from Markdown: ![alt](https://i.ibb.co/xyz.jpg)
  const mdMatch = url.match(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/i);
  if (mdMatch && mdMatch[1]) {
    url = mdMatch[1].trim();
  }

  // 1. ImgBB (imgbb.com) handling:
  // If user pasted a direct link: https://i.ibb.co/xyz/name.jpg or https://i.ibb.co.com/...
  // Ensure it's clean and https
  if (url.includes('i.ibb.co') || url.includes('i.ibb.co.com')) {
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }
    return url;
  }

  // 2. Google Drive image link conversion
  // Matches: https://drive.google.com/file/d/FILE_ID/view?usp=sharing or id=FILE_ID
  const gDriveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|drive\.google\.com\/uc\?id=)([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    const fileId = gDriveMatch[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // 3. Dropbox conversion
  if (url.includes('dropbox.com')) {
    url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    url = url.replace('?dl=0', '');
    return url;
  }

  // 4. Imgur page to direct image
  if (url.includes('imgur.com') && !url.includes('i.imgur.com') && !url.endsWith('.jpg') && !url.endsWith('.png') && !url.endsWith('.webp')) {
    const imgurId = url.split('/').pop();
    if (imgurId) {
      return `https://i.imgur.com/${imgurId}.jpg`;
    }
  }

  return url;
}

/**
 * Detects and formats video URLs (YouTube, Google Drive, Direct MP4, iframes)
 */
export function getCleanVideoSource(rawUrl: string): { url: string; type: 'mp4' | 'youtube' | 'iframe' } {
  if (!rawUrl) return { url: '', type: 'mp4' };

  const trimmed = rawUrl.trim();

  // If user pasted an iframe tag
  if (trimmed.startsWith('<iframe') || trimmed.includes('<iframe')) {
    return { url: trimmed, type: 'iframe' };
  }

  // Google Drive video link
  const gDriveMatch = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    const fileId = gDriveMatch[1];
    return {
      url: `https://drive.google.com/file/d/${fileId}/preview`,
      type: 'iframe'
    };
  }

  // YouTube Links (standard, shorts, youtu.be, embed)
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    return {
      url: trimmed,
      type: 'youtube'
    };
  }

  // Standard video extensions or HLS stream
  if (
    trimmed.endsWith('.mp4') ||
    trimmed.endsWith('.webm') ||
    trimmed.endsWith('.m3u8') ||
    trimmed.includes('.mp4?') ||
    trimmed.includes('googlevideo.com') ||
    trimmed.includes('commondatastorage.googleapis.com')
  ) {
    return { url: trimmed, type: 'mp4' };
  }

  // Third party embeds (Dailymotion, Streamtape, Blogger video, Ok.ru, etc.)
  if (trimmed.includes('embed') || trimmed.includes('player') || trimmed.includes('streamtape') || trimmed.includes('dailymotion')) {
    return { url: trimmed, type: 'iframe' };
  }

  // Default to mp4
  return { url: trimmed, type: 'mp4' };
}
