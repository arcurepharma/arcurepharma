"use client";

import { useEffect } from "react";

const REELS = [
  {
    handle: "Arcure Pharma",
    permalink:
      "https://www.instagram.com/reel/DWjX_KhCGOk/?utm_source=ig_embed&utm_campaign=loading",
  },
  {
    handle: "Aiman Rana",
    permalink:
      "https://www.instagram.com/reel/DV6eTabAj6t/?utm_source=ig_embed&utm_campaign=loading",
  },
  {
    handle: "Ifra Najam",
    permalink:
      "https://www.instagram.com/reel/DWY3WhIjJi_/?utm_source=ig_embed&utm_campaign=loading",
  },
];

const IG_PATH =
  "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z";

declare global {
  interface Window {
    instgrm?: {
      Embeds: { process: () => void };
    };
  }
}

function embedHtml(permalink: string) {
  return `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${permalink}" data-instgrm-version="14" style=" margin:1px auto; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"><a href="${permalink}" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank">View this post on Instagram</a></div></blockquote>`;
}

export default function InstagramReels() {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = () => window.instgrm?.Embeds.process();
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="social-proof" className="py-10 lg:py-28 bg-gradient-to-b from-teal-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-teal-600 text-white text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={IG_PATH} />
            </svg>
            Real Customers, Real Results
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
            What People Say About
            <span className="block sm:inline bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              {" "}
              Arcure Pharma
            </span>
          </h2>
          <p className="text-gray-500 mt-2 sm:mt-3 max-w-xl mx-auto text-sm sm:text-lg">
            Watch our customers share their genuine experiences with our
            products
          </p>
          <div className="section-divider mt-3 sm:mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {REELS.map((reel, i) => (
            <div key={i}>
              <div
                className="rounded-2xl overflow-hidden bg-white shadow-lg shadow-teal-600/5 ring-1 ring-gray-100"
                dangerouslySetInnerHTML={{ __html: embedHtml(reel.permalink) }}
              />
              <div className="flex items-center justify-between mt-3 px-1">
                <a
                  href={reel.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-teal-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-500"
                  >
                    <path d={IG_PATH} />
                  </svg>
                  {reel.handle}
                </a>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                  Tap speaker to unmute
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Videos auto-play muted. Tap the speaker on a video to unmute it.
        </p>
      </div>
    </section>
  );
}