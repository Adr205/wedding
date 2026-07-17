"use client";

import { useEffect, useRef, useState } from "react";

type RSVPFormProps = {
  slug: string;
  ctaClassName: string;
  headingFont?: string;
};

type State = "idle" | "loading" | "success" | "declined" | "error";

type Prefill = {
  guest_name: string;
  max_plus_ones: number;
  confirmation_status: "pending" | "confirmed" | "declined";
  table_name: string | null;
};

export function RSVPForm({ slug, ctaClassName, headingFont }: RSVPFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plusOnes, setPlusOnes] = useState(0);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  // Personalized invite state
  const tokenRef = useRef<string | null>(null);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [maxPlusOnes, setMaxPlusOnes] = useState(10);
  const [nameLocked, setNameLocked] = useState(false);
  const [tableName, setTableName] = useState<string | null>(null);

  const fontStyle = headingFont ? { fontFamily: `'${headingFont}', Georgia, serif` } : undefined;

  // Read personalized token from the URL and prefill the guest's data.
  useEffect(() => {
    const g = new URLSearchParams(window.location.search).get("g");
    if (!g) return;
    tokenRef.current = g;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/public/invitations/${slug}/guest?token=${encodeURIComponent(g)}`);
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { ok: boolean; guest?: Prefill };
        if (cancelled || !data.ok || !data.guest) return;
        setName(data.guest.guest_name);
        setNameLocked(true);
        setMaxPlusOnes(data.guest.max_plus_ones);
        setTableName(data.guest.table_name);
        setIsPersonalized(true);
        if (data.guest.confirmation_status === "confirmed") setState("success");
        if (data.guest.confirmation_status === "declined") setState("declined");
      } catch {
        // Non-personalized fallback: form stays open.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function submit(attending: boolean) {
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/public/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          token: tokenRef.current ?? undefined,
          name,
          phone: phone || null,
          plus_ones: attending ? plusOnes : 0,
          attending,
          website,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setErrorMsg(data.message ?? "Error al confirmar");
        setState("error");
        return;
      }

      setState(attending ? "success" : "declined");
    } catch {
      setErrorMsg("No se pudo enviar tu respuesta. Intenta de nuevo.");
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
        {tableName ? (
          <p className="mt-3 inline-block rounded-full border border-current px-4 py-1.5 text-sm opacity-80">
            Tu mesa: <strong>{tableName}</strong>
          </p>
        ) : null}
      </div>
    );
  }

  if (state === "declined") {
    return (
      <div className="text-center py-6 px-4">
        <p className="text-4xl mb-3">💌</p>
        <p className="text-xl font-semibold mb-1" style={fontStyle}>
          Gracias por avisar
        </p>
        <p className="text-sm opacity-60">Te vamos a extrañar, {name || "esperamos verte pronto"}.</p>
      </div>
    );
  }

  const plusOnesOptions = Math.min(maxPlusOnes, 10) + 1;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(true);
      }}
      className="w-full max-w-sm mx-auto space-y-3"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs opacity-50 uppercase tracking-widest">Tu nombre</label>
        <input
          type="text"
          required
          minLength={2}
          maxLength={100}
          readOnly={nameLocked}
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-white/50 ${nameLocked ? "opacity-80 cursor-default" : ""}`}
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

      {maxPlusOnes > 0 ? (
        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-50 uppercase tracking-widest">Acompañantes</label>
          <select
            value={plusOnes}
            onChange={(e) => setPlusOnes(Number(e.target.value))}
            className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {Array.from({ length: plusOnesOptions }, (_, i) => (
              <option key={i} value={i}>
                {i === 0 ? "Solo yo" : i === 1 ? "1 acompañante" : `${i} acompañantes`}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {/* Honeypot — visually hidden, ignored by humans */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        aria-hidden
        className="hidden"
      />

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

      {isPersonalized ? (
        <button
          type="button"
          disabled={state === "loading"}
          onClick={() => submit(false)}
          className="w-full rounded-full px-6 py-2 text-sm opacity-60 hover:opacity-90 transition-opacity disabled:opacity-40 underline"
        >
          No podré asistir
        </button>
      ) : null}
    </form>
  );
}
