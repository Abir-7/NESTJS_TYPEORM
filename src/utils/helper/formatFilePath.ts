import { sep } from 'path';

/**
 * Converts a local file path like:
 *   "uploads\\image\\file.jpg"
 * to a URL path like:
 *   "/image/file.jpg"
 */
export function formatFilePath(filePath: string): string {
  if (!filePath) return '';

  // Normalize slashes for all OS
  const normalizedPath = filePath.split(sep).join('/');

  // Remove leading 'uploads/' if present
  const relativePath = normalizedPath.replace(/^uploads\//, '');

  // Return URL-friendly path (prefix with '/')
  return '/' + relativePath;
}
