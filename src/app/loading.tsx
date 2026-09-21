export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-standard)] border-t-[var(--link)]"
        aria-label="Loading"
      />
    </div>
  );
}
