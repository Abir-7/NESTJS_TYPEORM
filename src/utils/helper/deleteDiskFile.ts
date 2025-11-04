/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { join } from 'path';
import { promises as fs } from 'fs';

/**
 * Deletes a file from disk given a relative or absolute path.
 * @param filePath Relative path from project root or absolute path
 * @returns true if deleted, false if file not found
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    // Normalize Windows backslashes
    const normalizedPath = filePath.replace(/\\/g, '/');
    // Resolve absolute path relative to project root
    const absolutePath = join(process.cwd(), 'uploads', normalizedPath);

    await fs.unlink(absolutePath);
    return true; // success
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      // file does not exist
      return false;
    }
    throw err; // re-throw other errors
  }
}
