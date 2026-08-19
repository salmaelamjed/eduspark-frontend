"use client";

/**
 * DashboardSkeleton
 *
 * Skeleton de chargement pour le dashboard admin.
 * Reproduit la structure du screenshot : 4 cards stats "pleines"
 * (blocs unis, pas de sous-détail interne) + un grand bloc de contenu
 * en dessous (table / chart / liste à venir).
 *
 * - Grille responsive : 4 colonnes → 2 (tablette) → 1 (mobile)
 * - Shimmer doux, dégradé large, basse amplitude
 * - Stagger entre les cards pour un effet premium
 * - Pulse très léger superposé au shimmer
 * - Header skeleton (titre + boutons)
 *
 * Autonome : aucune config Tailwind requise, CSS injecté via <style>
 * avec classes préfixées `skl-`.
 */

const CARD_COUNT = 4;

export default function DashboardSkeleton() {
  return (
    <div className="skl-wrapper">
      <style>{skeletonStyles}</style>

      {/* Header skeleton */}
      {/* <div className="skl-header">
        <div className="skl-header-text">
          <div className="skl-shimmer skl-title" />
          <div className="skl-shimmer skl-subtitle" />
        </div>
        <div className="skl-header-actions">
          <div className="skl-shimmer skl-btn skl-btn-ghost" />
          <div className="skl-shimmer skl-btn skl-btn-solid" />
        </div>
      </div> */}

      {/* Stat cards grid — blocs pleins, comme sur le screenshot */}
      <div className="skl-grid">
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <div
            key={i}
            className="skl-card skl-shimmer"
            style={{ animationDelay: `${i * 110}ms` }}
          />
        ))}
      </div>

      {/* Grand bloc de contenu (table / chart / liste) */}
      <div
        className="skl-content-block skl-shimmer"
        style={{ animationDelay: `${CARD_COUNT * 110}ms` }}
      />
    </div>
  );
}

const skeletonStyles = `
.skl-wrapper {
  --skl-border: rgba(15, 23, 42, 0.06);
  --skl-base: #f4f5f7;
  --skl-shine: #fbfbfc;
  --skl-radius: 16px;
  width: 100%;
}

/* ---------- Header ---------- */

.skl-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.skl-header-text {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skl-title {
  width: 220px;
  height: 22px;
  border-radius: 8px;
}

.skl-subtitle {
  width: 300px;
  height: 14px;
  border-radius: 6px;
  animation-delay: 80ms;
}

.skl-header-actions {
  display: flex;
  gap: 10px;
}

.skl-btn {
  height: 38px;
  border-radius: 10px;
}

.skl-btn-ghost {
  width: 110px;
  animation-delay: 60ms;
}

.skl-btn-solid {
  width: 130px;
  animation-delay: 140ms;
}

/* ---------- Grid ---------- */

.skl-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 1024px) {
  .skl-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .skl-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

/* ---------- Card (bloc plein) ---------- */

.skl-card {
  height: 220px;
  border-radius: var(--skl-radius);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03), 0 8px 24px rgba(15, 23, 42, 0.04);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  animation: skl-card-pulse 2.6s ease-in-out infinite;
  will-change: transform, box-shadow;
}

.skl-card:hover {
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.05), 0 14px 32px rgba(15, 23, 42, 0.07);
  transform: translateY(-2px);
}

/* ---------- Grand bloc de contenu ---------- */

.skl-content-block {
  height: 360px;
  border-radius: var(--skl-radius);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03), 0 8px 24px rgba(15, 23, 42, 0.04);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  animation: skl-card-pulse 2.6s ease-in-out infinite;
  will-change: transform, box-shadow;
}

.skl-content-block:hover {
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.05), 0 14px 32px rgba(15, 23, 42, 0.07);
  transform: translateY(-2px);
}

/* ---------- Shimmer (élégant, basse amplitude) ---------- */

.skl-shimmer {
  position: relative;
  overflow: hidden;
  background: var(--skl-base);
  isolation: isolate;
}

.skl-shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    100deg,
    transparent 20%,
    var(--skl-shine) 42%,
    var(--skl-shine) 58%,
    transparent 80%
  );
  animation: skl-shimmer-sweep 2.4s ease-in-out infinite;
}

@keyframes skl-shimmer-sweep {
  0% {
    transform: translateX(-120%);
  }
  55%,
  100% {
    transform: translateX(120%);
  }
}

/* ---------- Pulse très subtil ---------- */

@keyframes skl-card-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.92;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skl-shimmer::after,
  .skl-card,
  .skl-content-block {
    animation: none !important;
  }
}
`;