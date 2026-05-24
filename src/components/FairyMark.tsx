import fairyPink from "@/assets/fairy-pink.png";
import fairyMint from "@/assets/fairy-mint.png";
import fairyLavender from "@/assets/fairy-lavender.png";
import fairyMother from "@/assets/fairy-mother.png";

interface Props {
  className?: string;
  variant?: "pink" | "mint" | "lavender" | "mother";
}

const sources = {
  pink: fairyPink,
  mint: fairyMint,
  lavender: fairyLavender,
  mother: fairyMother,
};

export const FairyMark = ({ className = "w-16 h-16", variant = "pink" }: Props) => {
  return (
    <img
      src={sources[variant]}
      alt=""
      aria-hidden
      className={`${className} object-contain select-none pointer-events-none`}
      draggable={false}
    />
  );
};
