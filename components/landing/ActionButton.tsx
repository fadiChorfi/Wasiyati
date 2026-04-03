"use client";

type ActionButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
  count?: number;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export default function ActionButton({
  label,
  variant = "primary",
  className = "",
  icon,
  onClick,
}: ActionButtonProps) {
  const base =
    "flex-row-reverse bg-[length:200%_200%] hover:bg-[position:100%_100%] items-center gap-4 rounded-full px-2 py-2 text-sm font-semibold transition-all duration-500 cursor-pointer active:scale-95";

  const isPrimary = variant === "primary";

  const containerStyles = isPrimary
    ? "bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white border border-transparent"
    : "bg-white text-black border border-gray-200/60 shadow-sm";

  const iconStyles = isPrimary
    ? "bg-white text-[#06281e]"
    : "bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] text-white bg-[length:200%_200%] group-hover:bg-[position:100%_100%] transition-all duration-500";

  return (
    <button
      onClick={onClick}
      className={`group ${base} min-w-fit px-4 md:px-2 ${containerStyles} ${className}`}
      type="button"
    >
      <span className="pr-2.5 font-bold ">{label}</span>
      <span
        className={`relative flex h-12 w-12 items-center justify-center rounded-full text-4xl overflow-hidden ${iconStyles}`}
      >
        {/* Visible arrow that flies out top-left */}
        <span className="absolute transition-transform duration-150 ease-out group-hover:-translate-x-full group-hover:-translate-y-full">
          {icon}
        </span>

        {/* Hidden arrow that flies in from bottom-right */}
        <span className="absolute translate-x-full translate-y-full transition-transform duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0">
          {icon}
        </span>
      </span>
    </button>
  );
}
