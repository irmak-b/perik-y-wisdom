import fairies from "@/assets/fairies-group.png";

interface Props {
  className?: string;
  /** crop a single fairy from the group sprite (now 2-fairy transparent PNG) */
  variant?: "pink" | "mint";
}

// Crop windows in % for each fairy in fairies-group.png (transparent, 2 fairies)
const crops: Record<string, { x: number; y: number; w: number; h: number }> = {
  // bottom-left pink ballerina fairy
  pink: { x: 4, y: 30, w: 42, h: 68 },
  // top-right mint/teal fairy
  mint: { x: 68, y: 2, w: 30, h: 48 },
};

export const FairyMark = ({ className = "w-16 h-16", variant = "pink" }: Props) => {
  const c = crops[variant];
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${fairies})`,
        backgroundSize: `${(100 / c.w) * 100}% auto`,
        backgroundPosition: `${(c.x / Math.max(1, 100 - c.w)) * 100}% ${(c.y / Math.max(1, 100 - c.h)) * 100}%`,
        backgroundRepeat: "no-repeat",
      }}
      aria-hidden
    />
  );
};
