import { supabase } from "@/integrations/supabase/client";

// Cache for loaded images to avoid repeated storage calls
const imageCache = new Map<string, string>();

/**
 * Load an image from storage if it exists, otherwise return the fallback local image
 * @param word - The word identifier (e.g., "querer", "de", "visitar")
 * @param imageNumber - The image number (1-4)
 * @param fallbackImage - The local imported image to use as fallback
 * @returns The image URL (either from storage or local)
 */
export async function loadWordImage(
  word: string,
  imageNumber: number,
  fallbackImage: string
): Promise<string> {
  const fileName = `${word}-${imageNumber}.jpg`;
  const cacheKey = fileName;

  // Check cache first
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  try {
    // Check if image exists in storage
    const { data: files } = await supabase.storage
      .from('word-images')
      .list('', {
        search: fileName
      });

    if (files && files.length > 0) {
      // Image exists in storage, get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('word-images')
        .getPublicUrl(fileName);

      imageCache.set(cacheKey, publicUrl);
      return publicUrl;
    }
  } catch (error) {
    console.error(`Error loading image from storage for ${fileName}:`, error);
  }

  // Use fallback local image
  imageCache.set(cacheKey, fallbackImage);
  return fallbackImage;
}

/**
 * Load all 4 images for a word
 * @param word - The word identifier
 * @param fallbackImages - Array of 4 local imported images
 * @returns Promise with array of 4 image URLs
 */
export async function loadWordImages(
  word: string,
  fallbackImages: [string, string, string, string]
): Promise<[string, string, string, string]> {
  const [img1, img2, img3, img4] = await Promise.all([
    loadWordImage(word, 1, fallbackImages[0]),
    loadWordImage(word, 2, fallbackImages[1]),
    loadWordImage(word, 3, fallbackImages[2]),
    loadWordImage(word, 4, fallbackImages[3])
  ]);

  return [img1, img2, img3, img4];
}

/**
 * Clear the image cache (useful after regenerating images)
 */
export function clearImageCache() {
  imageCache.clear();
}
