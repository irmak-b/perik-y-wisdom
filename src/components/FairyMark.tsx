import fairies from "@/assets/fairies-group.png";

interface Props {
  className?: string;
  /** crop a single fairy from the group sprite */
  variant?: "pink" | "yellow" | "green" | "mint";
}

// Approximate crop windows in % for each fairy in fairies-group.png
const crops: Record<string, { x: number; y: number; w: number; h: number }> = {
  pink: { x: 0, y: 12, w: 22, h: 50 },
  yellow: { x: 22, y: 0, w: 26, h: 50 },
  green: { x: 38, y: 18, w: 28, h: 55 },
  mint: { x: 70, y: 8, w: 30, h: 55 },
};

export const FairyMark = ({ className = "w-16 h-16", variant = "pink" }: Props) => {
  const c = crops[variant];
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${fairies})`,
        backgroundSize: `${(100 / c.w) * 100}% auto`,
        backgroundPosition: `${(c.x / (100 - c.w)) * 100}% ${(c.y / (100 - c.h)) * 100}%`,
        backgroundRepeat: "no-repeat",
      }}
      aria-hidden
    />
  );
};
