import fairyPink from "@/assets/fairy-pink.png";
import fairyMint from "@/assets/fairy-mint.png";

interface Props {
  className?: string;
  variant?: "pink" | "mint";
}

export const FairyMark = ({ className = "w-16 h-16", variant = "pink" }: Props) => {
  const src = variant === "mint" ? fairyMint : fairyPink;
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={`${className} object-contain select-none pointer-events-none`}
      draggable={false}
    />
  );
};
