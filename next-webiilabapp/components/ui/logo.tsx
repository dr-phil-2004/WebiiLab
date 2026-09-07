import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  /** "mark" renders the glyph alone, "badge" wraps it in a rounded tile. */
  variant?: "mark" | "badge";
  withWordmark?: boolean;
  wordmark?: string;
};

/**
 * Organic, minimalist & aesthetic fluid "W" logo mark with glowing lavender-blue gradients,
 * blurred ambient glow effects, and modern AI futuristic identity.
 */
function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  const filterId = "w-glow-filter";
  const gradLavenderBlueId = "lavender-to-blue-grad";
  const gradVioletCyanId = "violet-to-cyan-grad";
  const auraGradId = "aura-glow-grad";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="WebiiLab W Logo"
      className={cn("overflow-visible select-none", className)}
    >
      <defs>
        {/* Glowing Blur Filter (inspired by modern aesthetic UI icons) */}
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft Lavender (#D8B4FE) to Vibrant Electric Blue (#38BDF8) Gradient */}
        <linearGradient id={gradLavenderBlueId} x1="15" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9D5FF" />   {/* Light Lavender */}
          <stop offset="30%" stopColor="#C084FC" />  {/* Vivid Lavender Violet */}
          <stop offset="65%" stopColor="#818CF8" />  {/* Soft Indigo Blue */}
          <stop offset="100%" stopColor="#38BDF8" /> {/* Futuristic Cyan Blue */}
        </linearGradient>

        {/* Deep Neon Purple to Bright Sky Blue Accent Gradient */}
        <linearGradient id={gradVioletCyanId} x1="85" y1="20" x2="15" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Radial Soft Ambient Aura Blur Gradient for Dark Backgrounds */}
        <radialGradient id={auraGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#6366F1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background blur glow for dark mode aesthetic */}
      <circle cx="50" cy="50" r="40" fill={`url(#${auraGradId})`} className="animate-pulse" style={{ animationDuration: '4s' }} />

      {/* Soft Blurred Glow Underlayer */}
      <g filter={`url(#${filterId})`} opacity="0.85">
        <path
          d="M 20 30 C 20 30, 27 64, 36 73 C 42 79, 46 72, 50 45 C 54 72, 58 79, 64 73 C 73 64, 80 30, 80 30"
          stroke={`url(#${gradLavenderBlueId})`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Main Crisp Organic Fluid "W" Path */}
      <path
        d="M 20 30 C 20 30, 27 64, 36 73 C 42 79, 46 72, 50 45 C 54 72, 58 79, 64 73 C 73 64, 80 30, 80 30"
        stroke={`url(#${gradLavenderBlueId})`}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Secondary Organic Accent Ribbon (overlapping inner flow for 3D depth) */}
      <path
        d="M 25 35 C 27 45, 33 60, 37 67 C 41 73, 45 68, 49 48 C 51 48, 55 68, 59 73 C 63 67, 69 45, 75 35"
        stroke={`url(#${gradVioletCyanId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Futuristic Glowing AI Node Sparks */}
      <circle cx="50" cy="45" r="3.5" fill="#F3E8FF" filter={`url(#${filterId})`} />
      <circle cx="20" cy="30" r="2.5" fill="#E9D5FF" />
      <circle cx="80" cy="30" r="2.5" fill="#7DD3FC" />
    </svg>
  );
}

export function Logo({
  className,
  size = 40,
  variant = "mark",
  withWordmark = false,
  wordmark = "WebiiLab",
}: LogoProps) {
  const mark =
    variant === "badge" ? (
      <span
        className="inline-flex items-center justify-center rounded-2xl bg-zinc-950/90 border border-white/10 shadow-xl backdrop-blur-md"
        style={{ width: size, height: size }}
      >
        <LogoMark size={Math.round(size * 0.75)} />
      </span>
    ) : (
      <LogoMark size={size} />
    );

  if (!withWordmark) {
    return <span className={cn("inline-flex items-center justify-center", className)}>{mark}</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-3 select-none", className)}>
      {mark}
      <span
        className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-100 to-blue-200"
        style={{ fontSize: Math.round(size * 0.55) }}
      >
        {wordmark}
      </span>
    </span>
  );
}

export default Logo;
