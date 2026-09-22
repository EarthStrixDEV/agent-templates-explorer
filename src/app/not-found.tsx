import Link from "next/link";
import { TrueFocus } from "@/components/reactbits/TrueFocus";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 text-center">
      <TrueFocus
        sentence="Agent not found"
        borderColor="#7aa2f7"
        glowColor="rgba(122, 162, 247, 0.6)"
        animationDuration={0.4}
        pauseBetweenAnimations={1.5}
        className="text-[24px] font-extrabold text-[var(--primary-text)]"
      />
      <p className="text-[13px] text-[var(--secondary-text)]">
        It may have moved to another category, or the id is incorrect.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-[9px] border border-[var(--border-standard)] bg-[var(--surface)] px-4 py-2 text-[12.5px] text-[var(--primary-text)] transition-colors hover:bg-[var(--active-segment)]"
      >
        Back to explorer
      </Link>
    </div>
  );
}
