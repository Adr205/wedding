"use client";

import { useState } from "react";

type RSVPFormProps = {
  slug: string;
  ctaClassName: string;
  headingFont?: string;
};

type State = "idle" | "loading" | "success" | "error";

export function RSVPForm({ slug, ctaClassName, headingFont }: RSVPFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plusOnes, setPlusOnes] = useState(0);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const fontStyle = headingFont ? { fontFamily: `'${headingFont}', Georgia, serif` } : undefined;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/public/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, phone: phone || null, plus_ones: plusOnes }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setErrorMsg(data.message ?? "Error al confirmar");
        setState("error");
        return;
      }

      setState("success");
    } catch {
      setErrorMsg("No se pudo enviar tu confirmación. Intenta de nuevo.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-6 px-4">
        <p className="text-4xl mb-3">🎉</p>
        <p className="text-xl font-semibold mb-1" style={fontStyle}>
          ¡Confirmado!
        </p>
        <p className="text-sm opacity-60">Gracias {name}, te esperamos con mucho gusto.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm mx-auto space-y-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs opacity-50 uppercase tracking-widest">Tu nombre</label>
        <input
          type="text"
          required
          minLength={2}
          maxLength={100}
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs opacity-50 uppercase tracking-widest">Teléfono (opcional)</label>
        <input
          type="tel"
          maxLength={20}
          placeholder="+52 000 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs opacity-50 uppercase tracking-widest">Acompañantes</label>
        <select
          value={plusOnes}
          onChange={(e) => setPlusOnes(Number(e.target.value))}
          className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i} value={i}>
              {i === 0 ? "Solo yo" : i === 1 ? "1 acompañante" : `${i} acompañantes`}
            </option>
          ))}
        </select>
      </div>

      {state === "error" ? (
        <p className="text-sm text-red-300 text-center">{errorMsg}</p>
      ) : null}

      <button
        type="submit"
        disabled={state === "loading"}
        className={`w-full rounded-full px-6 py-3 font-semibold text-sm transition-all disabled:opacity-60 ${ctaClassName}`}
      >
        {state === "loading" ? "Enviando…" : "Confirmar asistencia"}
      </button>
    </form>
  );
}
