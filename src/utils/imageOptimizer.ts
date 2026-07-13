/**
 * Helper utility to dynamically optimize Unsplash and Cloudinary image URLs
 * by appending modern lightweight formats (WebP), responsive widths, and quality adjustments.
 * This dramatically reduces network payload size (by up to 95%) and improves LCP/FCP.
 */
export function optimizeImage(url: string | null | undefined, width?: number): string {
  if (!url) return '';
  
  // 1. Unsplash Optimization
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fm', 'webp');
      
      const currentWidth = urlObj.searchParams.get('w');
      if (width) {
        urlObj.searchParams.set('w', width.toString());
      } else if (!currentWidth) {
        urlObj.searchParams.set('w', '800'); // reasonable fallback max-width
      }
      
      const currentQuality = urlObj.searchParams.get('q');
      if (!currentQuality || parseInt(currentQuality) > 70) {
        urlObj.searchParams.set('q', '70'); // optimized but visually pristine quality
      }
      
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }

  // 2. Cloudinary Optimization
  if (url.includes('res.cloudinary.com')) {
    // If it already has formatting optimization instructions, skip double injection
    if (url.includes('/f_auto') || url.includes('/q_auto')) {
      return url;
    }
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const prefix = url.substring(0, uploadIndex + 8); // includes '/upload/'
      const suffix = url.substring(uploadIndex + 8);
      
      let transform = 'f_auto,q_auto';
      if (width) {
        transform += `,w_${width},c_limit`; // restrict maximum resolution bounds
      }
      return `${prefix}${transform}/${suffix}`;
    }
  }

  return url;
}
