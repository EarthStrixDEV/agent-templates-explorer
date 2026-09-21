import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-[24px] font-extrabold text-[var(--primary-text)]">ไม่พบ Agent นี้</h1>
      <p className="text-[13px] text-[var(--secondary-text)]">
        อาจย้ายไปหมวดอื่น หรือ id ไม่ถูกต้อง
      </p>
      <Link
        href="/"
        className="mt-2 rounded-[9px] border border-[var(--border-standard)] bg-[var(--surface)] px-4 py-2 text-[12.5px] text-[var(--primary-text)] transition-colors hover:bg-[var(--active-segment)]"
      >
        กลับหน้าแรก
      </Link>
    </div>
  );
}
