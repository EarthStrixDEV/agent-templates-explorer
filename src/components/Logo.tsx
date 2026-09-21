export function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="10" y1="10" x2="10" y2="2.5" stroke="#3a4556" strokeWidth="1.2" />
      <line x1="10" y1="10" x2="17.5" y2="10" stroke="#3a4556" strokeWidth="1.2" />
      <line x1="10" y1="10" x2="10" y2="17.5" stroke="#3a4556" strokeWidth="1.2" />
      <line x1="10" y1="10" x2="2.5" y2="10" stroke="#3a4556" strokeWidth="1.2" />
      <circle cx="10" cy="2.5" r="2.2" fill="#4dd0e1" />
      <circle cx="17.5" cy="10" r="2.2" fill="#2ecc71" />
      <circle cx="10" cy="17.5" r="2.2" fill="#eb5da0" />
      <circle cx="2.5" cy="10" r="2.2" fill="#f6c945" />
      <circle cx="10" cy="10" r="3.2" fill="#7aa2f7" />
    </svg>
  );
}
