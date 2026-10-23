export const IMAGE_REVIEW_SLOT_COUNT = 12;
export const IMAGE_REVIEW_SETTING_KEY = "customer_result_images";

export const DEFAULT_IMAGE_REVIEW_IMAGES = [
  "/jenpharm/result-huma.jpg",
  "/jenpharm/result-mubeen.jpg",
  "/jenpharm/result-shahid.jpg",
  "/jenpharm/result-zoha.jpg",
  "/jenpharm/result-huma.jpg",
  "/jenpharm/result-mubeen.jpg",
  "/jenpharm/result-shahid.jpg",
  "/jenpharm/result-zoha.jpg",
  "/jenpharm/result-huma.jpg",
  "/jenpharm/result-mubeen.jpg",
  "/jenpharm/result-shahid.jpg",
  "/jenpharm/result-zoha.jpg",
];

export function createEmptyImageReviewImages() {
  return Array<string>(IMAGE_REVIEW_SLOT_COUNT).fill("");
}

export function isImageReviewUrl(value: string) {
  const imageUrl = value.trim();

  if (imageUrl.length > 2048) return false;
  if (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) return true;

  try {
    const parsedUrl = new URL(imageUrl);
    return (
      (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") &&
      !parsedUrl.username &&
      !parsedUrl.password
    );
  } catch {
    return false;
  }
}

export function normalizeImageReviewImages(value: unknown) {
  const source = Array.isArray(value) ? value : [];

  return Array.from({ length: IMAGE_REVIEW_SLOT_COUNT }, (_, index) => {
    const imageUrl =
      typeof source[index] === "string" ? source[index].trim() : "";
    return isImageReviewUrl(imageUrl) ? imageUrl : "";
  });
}

export function parseImageReviewImages(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return [...DEFAULT_IMAGE_REVIEW_IMAGES];
  }

  try {
    return normalizeImageReviewImages(JSON.parse(value));
  } catch {
    return [...DEFAULT_IMAGE_REVIEW_IMAGES];
  }
}
