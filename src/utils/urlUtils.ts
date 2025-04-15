/**
 * Validates a URL string
 * @param url The URL to validate
 * @returns boolean indicating if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    // Add protocol if missing
    const urlString = url.startsWith('http') ? url : `https://${url}`;
    const parsedUrl = new URL(urlString);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * Normalizes a URL by ensuring it has a proper protocol
 * @param url The URL to normalize
 * @returns The normalized URL with protocol
 */
export function normalizeUrl(url: string): string {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
}

/**
 * Extracts a meta image from a URL (for preview)
 * In a real application, this would make an HTTP request and extract meta tags
 * For this simple example, we're returning a placeholder
 * @param url The URL to get image for
 * @returns The image URL (or null if not available)
 */
export async function extractUrlMetadata(url: string): Promise<{ title: string | null, description: string | null, image: string | null }> {
  // In a real app, we would fetch the URL and parse meta tags
  // For this example, we'll just return placeholder data
  return {
    title: new URL(normalizeUrl(url)).hostname,
    description: null,
    image: 'https://dummyimage.com/200x200/efefef/999999&text=No+Image'
  };
}

/**
 * Generates a human-readable slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove non-word characters
    .replace(/\-\-+/g, '-'); // Replace multiple hyphens with a single hyphen
}