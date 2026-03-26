"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "error";
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: "success" | "error") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const bgColor =
    toast.type === "success"
      ? "bg-green-600"
      : "bg-red-600";

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[250px] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="text-sm">
        {toast.type === "success" ? "✓" : "✗"}
      </span>
      <p className="text-sm flex-1">{toast.text}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-white/70 hover:text-white text-lg leading-none cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}
