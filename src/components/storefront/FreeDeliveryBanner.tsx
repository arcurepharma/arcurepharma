const MESSAGE =
  "🚚 FREE DELIVERY ON ALL DEALS — order any deal & get it delivered FREE across Pakistan!";

export default function FreeDeliveryBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-8 overflow-hidden bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 border-b border-amber-500/40 select-none">
      <div className="animate-marquee flex items-center h-full whitespace-nowrap">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="mx-6 shrink-0 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-950"
          >
            {MESSAGE}
          </span>
        ))}
      </div>
    </div>
  );
}
