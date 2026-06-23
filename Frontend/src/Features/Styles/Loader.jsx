import { useState, useEffect } from "react";
import "./Loader.css";

// ─── Sparkle positions (scattered across the scene) ─────────────────────────
const SPARKLE_COUNT = 10;

// ─── Music notes that float upward around Krishna ───────────────────────────
const NOTES = ["♩", "♪", "♫", "♬"];

// ─── Flute finger holes ──────────────────────────────────────────────────────
const FLUTE_HOLES = 7;

// ─── Feather strands for peacock crown ──────────────────────────────────────
const FEATHER_COUNT = 7;

// ─── Necklace beads ─────────────────────────────────────────────────────────
const BEAD_COUNT = 5;

// ════════════════════════════════════════════════════════════════════════════
//  KrishnaLoader — Main Component
//
//  Props:
//    onComplete  {function}  — called when the full animation story ends
//    duration    {number}    — ms before onComplete fires (default 5800)
//
//  Animation Storyline:
//    0.2s  → Krishna figure rises from below (floating)
//    1.1s  → Flute appears (golden bar scales in)
//    1.4s  → Leaves start flying in from left & right toward the flute
//    2.5s  → "Krishna Fashion" brand name revealed (clip-path wipe)
//    3.5s  → Tagline "Premium Clothing" fades up
//    3.8s  → Loading dots appear and bounce
// ════════════════════════════════════════════════════════════════════════════
export default function KrishnaLoader({ onComplete, duration = 5800 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (typeof onComplete === "function") onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  if (!visible) return null;

  return (
    <div className="kf-overlay" role="status" aria-label="Loading Krishna Fashion">
      <div className="kf-scene">

        {/* ── Ambient Background Glows ───────────────────────── */}
        <div className="kf-glow kf-glow-teal" />
        <div className="kf-glow kf-glow-gold" />
        <div className="kf-glow kf-glow-blue" />

        {/* ── Sparkle Decorations (scattered gold/teal dots) ─── */}
        {Array.from({ length: SPARKLE_COUNT }, (_, i) => (
          <div key={i} className={`kf-sparkle kf-sparkle-${i + 1}`} />
        ))}

        {/* ── Floating Music Notes (emitted near flute) ────────── */}
        {NOTES.map((note, i) => (
          <span key={i} className={`kf-note kf-note-${i + 1}`}>{note}</span>
        ))}

        {/* ══════════════════════════════════════════════════════
            STAGE 1 — KRISHNA FIGURE ENTERS
            Outer div: entrance (rise from below)
            Inner div: continuous float after entry
        ══════════════════════════════════════════════════════ */}
        <div className="kf-krishna-enter">
          <div className="kf-krishna-float">

            {/* Divine halo glow ring */}
            <div className="kf-halo" />

            {/* ── PEACOCK FEATHER CROWN ── */}
            <div className="kf-crown">
              <div className="kf-crown-stem" />

              {/* Fan-shaped feather strands */}
              {Array.from({ length: FEATHER_COUNT }, (_, i) => (
                <div key={i} className={`kf-feather kf-feather-${i}`} />
              ))}

              {/* Peacock eye at feather tip */}
              <div className="kf-peacock-eye" />
            </div>

            {/* ── HEAD ── */}
            <div className="kf-head">
              {/* Tilak (divine forehead mark) */}
              <div className="kf-tilak" />
              {/* Eyes */}
              <div className="kf-eyes">
                <div className="kf-eye" />
                <div className="kf-eye" />
              </div>
            </div>

            {/* ── NECKLACE ── */}
            <div className="kf-necklace">
              {Array.from({ length: BEAD_COUNT }, (_, i) => (
                <div key={i} className="kf-bead" />
              ))}
            </div>

            {/* ── BODY / DHOTI ── */}
            <div className="kf-body">
              <div className="kf-arm kf-arm-l" />
              <div className="kf-arm kf-arm-r" />
              <div className="kf-dhoti" />
            </div>

            {/* ── LEGS (with golden anklets via CSS ::after) ── */}
            <div className="kf-legs">
              <div className="kf-leg kf-leg-l" />
              <div className="kf-leg kf-leg-r" />
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            STAGE 2 — FLUTE APPEARS
            Scales in from center after Krishna arrives.
            The flute is wider than the body, crossing both arms.
        ══════════════════════════════════════════════════════ */}
        <div className="kf-flute-wrap">
          <div className="kf-flute">
            {Array.from({ length: FLUTE_HOLES }, (_, i) => (
              <div key={i} className="kf-flute-hole" />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            STAGE 3 — LEAVES FLY IN FROM BOTH SIDES
            Left leaves approach from left → settle near left flute end.
            Right leaves approach from right → settle near right flute end.
        ══════════════════════════════════════════════════════ */}

        {/* Left side leaves */}
        <div className="kf-leaf kf-leaf-l1" />
        <div className="kf-leaf kf-leaf-l2" />
        <div className="kf-leaf kf-leaf-l3" />
        <div className="kf-leaf kf-leaf-l4" />

        {/* Right side leaves */}
        <div className="kf-leaf kf-leaf-r1" />
        <div className="kf-leaf kf-leaf-r2" />
        <div className="kf-leaf kf-leaf-r3" />
        <div className="kf-leaf kf-leaf-r4" />

        {/* ══════════════════════════════════════════════════════
            STAGE 4 — "KRISHNA FASHION" TEXT APPEARS
            Written beyond (below) the flute as the main brand reveal.
            Text wipes in left-to-right using clip-path animation.
        ══════════════════════════════════════════════════════ */}
        <div className="kf-brand-wrap">
          <div className="kf-brand-name-row">
            <span className="kf-brand-name">Krishna Fashion</span>
          </div>
          <div className="kf-tagline-row">
            <span className="kf-tagline">✦ &nbsp; Premium Clothing &nbsp; ✦</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            STAGE 5 — LOADING DOTS (bounce animation)
        ══════════════════════════════════════════════════════ */}
        <div className="kf-dots" aria-hidden="true">
          <span className="kf-dot" />
          <span className="kf-dot" />
          <span className="kf-dot" />
        </div>

      </div>
    </div>
  );
}
