"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/app/components/Icons";

type AlertProps = {
  message?: string;
  onClose?: () => void;
  autoHideMs?: number;
};

export default function Alert({
  message,
  onClose,
  autoHideMs,
}: AlertProps) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);

    if (autoHideMs && message) {
      const t = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, autoHideMs);

      return () => clearTimeout(t);
    }
  }, [message, autoHideMs, onClose]);

  if (!visible || !message) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">

      <div
        className="
          flex items-center gap-3
          rounded-xl
          bg-red-600 text-white
          px-4 py-3
          shadow-2xl
          animate-in fade-in slide-in-from-top-2
        "
      >
        <Icon
          name="faCircleExclamation"
          size={18}
          className="shrink-0"
        />

        <span className="flex-1 font-medium text-sm">
          {message}
        </span>

        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="opacity-80 hover:opacity-100 transition"
        >
          <Icon name="faXmark" size={14} />
        </button>
      </div>
    </div>
  );
}
