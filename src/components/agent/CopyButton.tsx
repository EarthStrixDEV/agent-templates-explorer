"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  text: string;
  label: string;
  toastMessage: string;
  variant?: "default" | "ghost";
  className?: string;
  style?: React.CSSProperties;
};

export function CopyButton({
  text,
  label,
  toastMessage,
  variant = "ghost",
  className,
  style,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(toastMessage);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("คัดลอกไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={handleCopy}
      className={cn("gap-1.5 text-[12.5px]", className)}
      style={style}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {label}
    </Button>
  );
}
