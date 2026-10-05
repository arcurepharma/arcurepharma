/**
 * Direct client-side video upload to ImageKit CDN
 * Bypasses Vercel's 4.5MB serverless payload limit so videos of any size upload smoothly.
 */
export async function uploadVideoFile(
  file: File,
  folder: string = "arcurepharma/reels",
  onProgress?: (percent: number) => void
): Promise<{ url: string; source: string }> {
  // 1. Try ImageKit Direct Client Upload first
  try {
    const authRes = await fetch("/api/upload/auth");
    if (authRes.ok) {
      const auth = await authRes.json();
      if (auth.signature && auth.token && auth.publicKey) {
        if (onProgress) onProgress(10);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        formData.append("publicKey", auth.publicKey);
        formData.append("signature", auth.signature);
        formData.append("expire", String(auth.expire));
        formData.append("token", auth.token);
        formData.append("folder", folder);

        const uploadResult = await new Promise<{ url: string }>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
              // Map upload progress from 10% to 95%
              const percent = Math.round((event.loaded / event.total) * 85) + 10;
              onProgress(Math.min(95, percent));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                if (data.url) {
                  resolve(data);
                } else {
                  reject(new Error("ImageKit response missing URL"));
                }
              } catch (e) {
                reject(e);
              }
            } else {
              reject(new Error(`ImageKit error (${xhr.status}): ${xhr.responseText}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during direct upload"));
          xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
          xhr.send(formData);
        });

        if (onProgress) onProgress(100);
        return { url: uploadResult.url, source: "imagekit" };
      }
    }
  } catch (err) {
    console.warn("Direct ImageKit client upload failed, attempting /api/upload fallback:", err);
  }

  // 2. Server API fallback (for smaller files or when direct upload unavailable)
  if (onProgress) onProgress(40);
  const serverFormData = new FormData();
  serverFormData.append("file", file);
  serverFormData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: serverFormData,
  });

  const data = await res.json();
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Failed to upload video");
  }

  if (onProgress) onProgress(100);
  return { url: data.url, source: data.source || "server" };
}
