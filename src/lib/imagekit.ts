import ImageKit from "imagekit";

export const isImageKitConfigured = Boolean(
  process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
);

let _imagekit: ImageKit | null = null;

export function getImagekit(): ImageKit {
  if (!isImageKitConfigured) {
    throw new Error(
      "ImageKit is not configured. Add IMAGEKIT keys to .env to enable image uploads."
    );
  }
  if (!_imagekit) {
    _imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });
  }
  return _imagekit;
}