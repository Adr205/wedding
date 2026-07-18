"use client";

import { useRef, useState, type ChangeEvent } from "react";

type Props = { slug: string; ctaClassName: string };

type State = "idle" | "loading" | "success" | "error";

export function GuestGalleryUploader({ slug, ctaClassName }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploaderName, setUploaderName] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);

  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setState("loading");
    setErrorMsg("");
    let ok = 0;
    for (const file of files) {
      try {
        const form = new FormData();
        form.append("slug", slug);
        form.append("uploader_name", uploaderName);
        form.append("website", website);
        form.append("file", file);
        const res = await fetch("/api/public/uploads", { method: "POST", body: form });
        if (res.ok) ok += 1;
        else {
          const data = (await res.json()) as { message?: string };
          setErrorMsg(data.message ?? "No se pudo subir una imagen");
        }
      } catch {
        setErrorMsg("Error al subir. Intenta de nuevo.");
      }
    }

    if (inputRef.current) inputRef.current.value = "";
    setUploadedCount((c) => c + ok);
    setState(ok > 0 ? "success" : "error");
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-3 text-center">
      <input
        type="text"
        maxLength={80}
        placeholder="Tu nombre (opcional)"
        value={uploaderName}
        onChange={(e) => setUploaderName(e.target.value)}
        className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-2.5 text-sm placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-white/50"
      />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={state === "loading"}
        className={`w-full rounded-full px-6 py-2.5 font-semibold text-sm transition-all disabled:opacity-60 ${ctaClassName}`}
      >
        {state === "loading" ? "Subiendo…" : "Elegir fotos 📷"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFileChange}
      />
      {state === "success" ? (
        <p className="text-sm opacity-70">
          ¡Gracias! {uploadedCount > 1 ? `${uploadedCount} fotos subidas` : "Foto subida"}. Aparecerán una vez revisadas.
        </p>
      ) : null}
      {state === "error" && errorMsg ? <p className="text-sm text-red-300">{errorMsg}</p> : null}
    </div>
  );
}
