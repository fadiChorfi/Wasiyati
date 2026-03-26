"use client";

type ActionButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
  count?: number;
  icon?: React.ReactNode;
};

export default function ActionButton({
  label,
  variant = "primary",
  className = "",
  icon,
}: ActionButtonProps) {
  const base =
    "flex-row-reverse bg-[radial-gradient(circle_at_30%_20%,#19714f,transparent_55%),linear-gradient(160deg,#0a3f2f_0%,#06281e_70%)] bg-[length:200%_200%] hover:bg-[position:100%_100%] items-center gap-4 rounded-full px-2 py-2 text-sm font-semibold transition-all duration-500 cursor-pointer active:scale-95";
  const styles =
    variant === "primary"
      ? "bg-accent-foreground text-[var(--accent-foreground)] hover:brightness-95"
      : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--background)]";

  return (
    <button className={`group ${base} ${styles} ${className}`} type="button">
      <span className="pr-2.5 font-bold">{label}</span>
      <span className="relative flex bg-white h-12 w-12 items-center justify-center rounded-full text-accent-foreground text-4xl overflow-hidden">
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
