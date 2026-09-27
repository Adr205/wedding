"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { EventRow } from "@/features/invitation/types";
import {
  mergeEnvelope,
  resolveEnvelope,
  type EnvelopeConfig,
  type ResolvedEnvelope,
} from "@/features/invitation/types/envelope";

type GateProps = {
  config?: EnvelopeConfig | null;
  event: EventRow;
  fallbackFontKey: string;
  children: ReactNode;
};

export function EnvelopeGate({ config, event, fallbackFontKey, children }: GateProps) {
  const envelope = mergeEnvelope(config);
  const [opened, setOpened] = useState(!envelope.enabled);

  useEffect(() => {
    if (opened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [opened]);

  if (!envelope.enabled) return <>{children}</>;

  const resolved = resolveEnvelope(envelope, event);

  return (
    <>
      {children}
      <AnimatePresence>
        {!opened ? (
          <EnvelopeCover
            envelope={resolved}
            fontKey={resolved.fontKey || fallbackFontKey}
            onOpen={() => setOpened(true)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

type CoverProps = {
  envelope: ResolvedEnvelope;
  fontKey: string;
  onOpen: () => void;
};

function EnvelopeCover({ envelope, fontKey, onOpen }: CoverProps) {
  const fontFamily = `'${fontKey}', Georgia, serif`;

  return (
    <motion.div
      className="fixed inset-0 z-[45] flex flex-col items-center justify-center overflow-y-auto px-6 py-16"
      style={{ backgroundColor: envelope.backgroundColor, color: envelope.textColor }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: "easeInOut" }}
    >
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <h1
          className="text-[2.6rem] sm:text-5xl font-normal leading-tight tracking-wide"
          style={{ fontFamily }}
        >
          {envelope.displayName}
        </h1>

        {envelope.dateLabel ? (
          <p className="mt-3 text-[0.7rem] tracking-[0.28em] uppercase opacity-55">
            {envelope.dateLabel}
          </p>
        ) : null}

        <button
          type="button"
          onClick={onOpen}
          aria-label="Abrir invitación"
          className="group relative mt-14 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-current/30 rounded-sm"
        >
          <div className="relative w-[280px] sm:w-[340px] transition-transform duration-300 group-hover:-translate-y-1">
            <PaperEnvelope
              color={envelope.envelopeColor}
              textureUrl={
                envelope.envelopeFill === "image" ? envelope.envelopeImageUrl : ""
              }
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/envelope/seal.png"
              alt=""
              className="pointer-events-none absolute left-1/2 top-[51%] z-20 h-14 w-14 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.22)] sm:h-16 sm:w-16"
            />
          </div>
        </button>

        {envelope.hint ? (
          <p className="mt-8 text-[0.58rem] tracking-[0.22em] uppercase opacity-40">
            {envelope.hint}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}

function PaperEnvelope({ color, textureUrl }: { color: string; textureUrl?: string }) {
  const flap = shadeHex(color, 14);
  const body = shadeHex(color, -4);
  const crease = shadeHex(color, -22);
  const highlight = shadeHex(color, 26);
  const useTexture = Boolean(textureUrl);

  return (
    <div className="relative aspect-[360/230] w-full drop-shadow-[0_16px_28px_rgba(30,25,20,0.18)]">
      <div
        className="absolute inset-0 rounded-[5px]"
        style={
          useTexture
            ? {
                backgroundImage: `url(${textureUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background: `linear-gradient(180deg, ${body} 0%, ${shadeHex(color, -12)} 100%)`,
              }
        }
      />
      <div
        className="absolute inset-x-0 top-0 h-[53%]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          ...(useTexture
            ? {
                backgroundImage: `url(${textureUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                filter: "brightness(1.06)",
              }
            : {
                background: `linear-gradient(160deg, ${highlight} 0%, ${flap} 55%, ${color} 100%)`,
              }),
        }}
      />
      <svg viewBox="0 0 360 230" className="absolute inset-0 h-full w-full" aria-hidden>
        <path
          d="M3 3 L180 122 L357 3"
          fill="none"
          stroke={useTexture ? "rgba(40,30,20,0.28)" : crease}
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

function shadeHex(hex: string, amount: number): string {
  const raw = hex.replace("#", "");
  if (raw.length !== 6) return hex;
  const clamp = (n: number) => Math.max(0, Math.min(255, n));
  const to = (start: number) =>
    clamp(parseInt(raw.slice(start, start + 2), 16) + amount)
      .toString(16)
      .padStart(2, "0");
  return `#${to(0)}${to(2)}${to(4)}`;
}
