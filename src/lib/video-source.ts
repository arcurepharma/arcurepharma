export type VideoSource = "youtube" | "vimeo" | "facebook" | "file";

export interface VideoSourceInfo {
  source: VideoSource;
  /** Embed URL for iframe players, empty for direct files. */
  embedUrl: string;
  /** Direct playback URL for <video>, empty for iframe sources. */
  fileUrl: string;
  /** Best available poster image, empty when unknown. */
  thumbnailUrl: string;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function youtubeId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return id || null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    const v = url.searchParams.get("v");
    if (v) return v;

    const match = url.pathname.match(
      /^\/(embed|shorts|live|v)\/([A-Za-z0-9_-]{6,})/
    );
    if (match) return match[2];
  }

  return null;
}

function vimeoId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;

  const match = url.pathname.match(/\/(?:video\/)?(\d{6,})/);
  return match ? match[1] : null;
}

function isFacebookVideo(url: URL): boolean {
  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  if (host !== "facebook.com" && host !== "fb.com" && host !== "fb.watch") return false;
  return /\/videos\/|\/watch\/?$|\/reel\//.test(url.pathname) || url.searchParams.has("v");
}

export function getYouTubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Works out how a video URL should be played. Accepts YouTube, Vimeo and
 * Facebook links as well as direct video files (uploaded to ImageKit or any
 * other host), so the admin can paste a link or upload a file interchangeably.
 */
export function resolveVideoSource(
  rawUrl: string,
  customThumbnail?: string | null
): VideoSourceInfo {
  const value = (rawUrl || "").trim();
  const custom = (customThumbnail || "").trim();
  const empty: VideoSourceInfo = {
    source: "file",
    embedUrl: "",
    fileUrl: value,
    thumbnailUrl: custom,
  };

  if (!value || !isValidUrl(value)) return empty;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return empty;
  }

  const ytId = youtubeId(url);
  if (ytId) {
    return {
      source: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      fileUrl: "",
      thumbnailUrl: custom || getYouTubeThumbnail(ytId),
    };
  }

  const vimeoIdMatch = vimeoId(url);
  if (vimeoIdMatch) {
    return {
      source: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoIdMatch}?autoplay=1`,
      fileUrl: "",
      thumbnailUrl: custom,
    };
  }

  if (isFacebookVideo(url)) {
    return {
      source: "facebook",
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        value
      )}&autoplay=1&show_text=0`,
      fileUrl: "",
      thumbnailUrl: custom,
    };
  }

  return empty;
}

export function isPlayableVideoUrl(value: string): boolean {
  return isValidUrl((value || "").trim());
}
