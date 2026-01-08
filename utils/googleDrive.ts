/**
 * Convert Google Drive sharing link to direct image link
 * 
 * @param driveLink - Google Drive sharing link (file or folder)
 * @returns Direct image link that can be used in Next.js Image component
 * 
 * @example
 * // File link:
 * convertDriveLink('https://drive.google.com/file/d/1ABC123xyz456/view?usp=sharing')
 * // Returns: 'https://drive.google.com/uc?export=view&id=1ABC123xyz456'
 * 
 * @example
 * // Folder link (will need file ID separately):
 * convertDriveLink('https://drive.google.com/drive/folders/1aNPqHNie5pyk8km3bgC3lU83XuODZZkt')
 * // Returns: null (folder links need individual file IDs)
 */
export function convertDriveLink(driveLink: string): string | null {
  // Extract file ID from Google Drive link
  const fileIdMatch = driveLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
  
  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  return null;
}

/**
 * Get direct image link from Google Drive file ID
 * 
 * @param fileId - Google Drive file ID
 * @returns Direct image link
 */
export function getDriveImageLink(fileId: string): string {
  // Using direct view link - works better without Next.js optimization
  // Make sure file permission is set to "Anyone with the link can view"
  // Format 1: Direct view (most reliable)
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
  
  // Alternative formats (uncomment if above doesn't work):
  // Format 2: Thumbnail with size
  // return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  // Format 3: Using lh3.googleusercontent.com
  // return `https://lh3.googleusercontent.com/d/${fileId}`;
}
/**
 * Alternative: Use Google Drive thumbnail API (smaller size, faster)
 * 
 * @param fileId - Google Drive file ID
 * @param size - Image size: 'small', 'medium', 'large', or 'xlarge'
 * @returns Thumbnail link
 */
export function getDriveThumbnailLink(
  fileId: string,
  size: 'small' | 'medium' | 'large' | 'xlarge' = 'large'
): string {
  const sizeMap = {
    small: 's220',
    medium: 's320',
    large: 's800',
    xlarge: 's1200',
  };
  
  return `https://lh3.googleusercontent.com/d/${fileId}=${sizeMap[size]}`;
}

