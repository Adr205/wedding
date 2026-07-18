"use client";

import { useState } from "react";

type Props = { slug: string; ctaClassName: string };

type State = "idle" | "loading" | "success" | "error";

export function GuestbookForm({ slug, ctaClassName }: Props) {
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/public/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, author_name: authorName, body, website }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setErrorMsg(data.message ?? "No se pudo enviar");
        setState("error");
        return;
      }
      setState("success");
    } catch {
      setErrorMsg("No se pudo enviar tu mensaje. Intenta de nuevo.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-4">
        <p className="text-3xl mb-2">💌</p>
        <p className="text-sm opacity-70">¡Gracias por tu mensaje! Aparecerá una vez que los novios lo revisen.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md mx-auto space-y-3">
      <input
        type="text"
        required
        minLength={2}
        maxLength={80}
        placeholder="Tu nombre"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-2.5 text-sm placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-white/50"
      />
      <textarea
        required
        minLength={1}
        maxLength={500}
        rows={3}
        placeholder="Escribe tus buenos deseos…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
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
      {state === "error" ? <p className="text-sm text-red-300 text-center">{errorMsg}</p> : null}
      <button
        type="submit"
        disabled={state === "loading"}
        className={`w-full rounded-full px-6 py-2.5 font-semibold text-sm transition-all disabled:opacity-60 ${ctaClassName}`}
      >
        {state === "loading" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
