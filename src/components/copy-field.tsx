"use client";

import { useState } from "react";
import { Check, Clipboard, Eye, EyeOff } from "lucide-react";

type CopyFieldProps = {
  label: string;
  value: string;
  secret?: boolean;
  onCopied: (message: string, isError?: boolean) => void;
};

async function copyWithFallback(value: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) throw new Error("Trình duyệt không hỗ trợ sao chép tự động.");
}

export function CopyField({ label, value, secret = false, onCopied }: CopyFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyWithFallback(value);
      setCopied(true);
      onCopied("Đã sao chép!");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      onCopied("Không thể sao chép. Hãy nhấn giữ để chọn thủ công.", true);
    }
  };

  return (
    <div className="copy-field">
      <div className="copy-field__heading">
        <label htmlFor={`field-${label}`}>{label}</label>
        {secret ? (
          <button
            className="icon-button"
            type="button"
            onClick={() => setRevealed((current) => !current)}
            aria-label={revealed ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            aria-pressed={revealed}
          >
            {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : null}
      </div>

      <div className="copy-field__control">
        <input
          id={`field-${label}`}
          type={secret && !revealed ? "password" : "text"}
          value={value}
          readOnly
          autoComplete="off"
          onFocus={(event) => event.currentTarget.select()}
          aria-describedby={`field-${label}-note`}
        />
        <button
          className="copy-button"
          type="button"
          onClick={handleCopy}
          aria-label={copied ? `Đã sao chép ${label}` : `Sao chép ${label}`}
        >
          {copied ? <Check size={18} /> : <Clipboard size={18} />}
          <span>{copied ? "Đã chép" : "Sao chép"}</span>
        </button>
      </div>
      <p className="sr-only" id={`field-${label}-note`}>
        Nhấn vào ô để chọn toàn bộ nội dung hoặc dùng nút Sao chép.
      </p>
    </div>
  );
}
