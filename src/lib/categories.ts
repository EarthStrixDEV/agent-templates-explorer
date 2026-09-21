export type Category = {
  id: string;
  label: string;
  color: string;
  description: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "consultant",
    label: "Consultant",
    color: "#f2994a",
    description:
      "ให้คำปรึกษาเชิงปฏิบัติในโดเมนหรือระบบเฉพาะทาง ตอบว่า \"ทำอย่างไรให้ถูกต้อง\" ระดับ operation",
  },
  {
    id: "business",
    label: "Business",
    color: "#5b8def",
    description:
      "ให้คำปรึกษาระดับองค์กรและกลยุทธ์ ตอบว่า \"ควรทำอะไร ทำไม และคุ้มไหม\" ข้าม function",
  },
  {
    id: "software-engineering",
    label: "Software Engineering",
    color: "#2ecc71",
    description: "ลงมือทำงานเขียนโค้ด แก้บั๊ก รีวิว และปรับปรุงระบบ",
  },
  {
    id: "creative",
    label: "Creative",
    color: "#eb5da0",
    description:
      "ผลิตงานสร้างสรรค์: เขียน เล่าเรื่อง บท แบรนด์ ภาพ social และคุมทิศทางงาน",
  },
  {
    id: "research",
    label: "Research",
    color: "#a78bfa",
    description:
      "ค้นคว้า ตรวจสอบข้อเท็จจริง สังเคราะห์ และเขียนผลการวิจัยอย่างมีหลักฐานและอ้างอิงได้",
  },
  {
    id: "life-style",
    label: "Life-style",
    color: "#f6c945",
    description:
      "ให้คำแนะนำเรื่องชีวิตส่วนตัว: การเงิน สุขภาพ นิสัย เวลา การเรียนรู้ การเดินทาง บ้าน ความสัมพันธ์",
  },
  {
    id: "productivity",
    label: "Productivity",
    color: "#4dd0e1",
    description: "ช่วยงานทั่วไป เช่น สรุปเอกสาร จัดการงาน ร่างข้อความ",
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
);

export function getCategory(id: string): Category | undefined {
  return CATEGORY_MAP[id];
}

/** Convert a hex color like "#f2994a" to an rgba() string with the given alpha. */
export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
