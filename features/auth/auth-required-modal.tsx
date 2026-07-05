"use client";

import Link from "next/link";

export function AuthRequiredModal({
  message = "Para realizar esta acción debes entrar con tu cuenta o crear una nueva.",
  onClose,
  open,
}: {
  message?: string;
  onClose: () => void;
  open: boolean;
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[#1F3D2B]/52 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-required-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#1F3D2B14] bg-[#FAF7F0] p-6 shadow-[0_24px_70px_rgba(31,61,43,0.26)]">
        <h2 id="auth-required-title" className="text-2xl font-black text-[#1F3D2B]">
          Necesitas iniciar sesión
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/70">{message}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#3A7D44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2f6738]"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-[#1F3D2B24] bg-white/88 px-5 py-2.5 text-sm font-bold text-[#1F3D2B] hover:bg-white"
          >
            Crear cuenta
          </Link>
        </div>
        <button
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-full px-4 text-sm font-bold text-[#1F3D2B]/70 hover:bg-[#1F3D2B0d]"
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
