"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminFinance } from "@/hooks/admin/useAdminFinance";
import type { CoursePurchase } from "@/types/Admin.types";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

const STORAGE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://localhost:8000/storage";

function assetUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${STORAGE_URL}/${path}`;
}
function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];
function avatarColor(name: string) {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}
function formatAmount(amount: string | number, currency: string) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency || "EUR",
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}
const STATUS_STYLES: Record<
  string,
  { label: string; text: string; badge: string }
> = {
  completed: {
    label: "Terminé",
    text: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-600",
  },
  pending: {
    label: "En attente",
    text: "text-amber-500",
    badge: "bg-amber-50 text-amber-600",
  },
  failed: {
    label: "Échoué",
    text: "text-red-500",
    badge: "bg-red-50 text-red-600",
  },
  refunded: {
    label: "Remboursé",
    text: "text-red-500",
    badge: "bg-red-50 text-red-600",
  },
};

function statusStyle(purchase: CoursePurchase) {
  const key = purchase.refunded_at ? "refunded" : purchase.status;
  return STATUS_STYLES[key] ?? STATUS_STYLES.pending;
}
function Avatar({
  name,
  picture,
  size = 40,
}: {
  name: string;
  picture?: string | null;
  size?: number;
}) {
  const url = assetUrl(picture);
  const [errored, setErrored] = useState(false);

  if (url && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        width={size}
        height={size}
        onError={() => setErrored(true)}
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-gray-100"
      />
    );
  }

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white ring-1 ring-gray-100 ${avatarColor(
        name,
      )}`}
    >
      {getInitials(name)}
    </div>
  );
}

const ExternalLinkIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-gray-300"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

function TransactionRow({ purchase }: { purchase: CoursePurchase }) {
  const style = statusStyle(purchase);
  const studentName = purchase.student?.name ?? "Utilisateur supprimé";
  const teacherName = purchase.teacher?.name ?? "Formateur inconnu";
  const courseTitle = purchase.course?.title ?? "Cours supprimé";
  const courseThumbnail = purchase.course?.thumbnail;

  return (
    <div className="flex items-center gap-3.5 py-3.5">
      {/* Avatar de l'élève (payeur) avec la miniature du cours en badge */}
      <div className="relative shrink-0">
        <Avatar name={studentName} picture={purchase.student?.profile_picture} />
        {courseThumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assetUrl(courseThumbnail) ?? undefined}
            alt={courseTitle}
            className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full object-cover ring-2 ring-white"
          />
        )}
      </div>

      {/* Infos */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold leading-tight text-gray-900">
          {courseTitle}
        </p>
        <div className="mt-0.5 flex items-center gap-1 truncate text-[13px] text-gray-500">
          <span className="truncate">{studentName}</span>
          <ArrowRightIcon />
          <span className="truncate">{teacherName}</span>
        </div>
      </div>

      {/* Montant + statut + date */}
      <div className="shrink-0 text-right">
        <p className={`text-[15px] font-semibold leading-tight ${style.text}`}>
          {formatAmount(purchase.amount_total, purchase.currency)}
        </p>
        <span
          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${style.badge}`}
        >
          {style.label}
        </span>
      </div>
    </div>
  );
}

export default function TransactionsCard() {
  const { purchases, isLoading, error, fetchPurchases } = useAdminFinance();
   const { token } = useAuth();

  useEffect(() => {
     if (token) {
      fetchPurchases({ per_page: 5 });
    }
  },[token]);

  const items: CoursePurchase[] = useMemo(() => purchases ?? [], [purchases]);

  return (
    <div className="w-full h-full rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold tracking-tight text-gray-900">
          Transactions récentes
        </h2>
      </div>

      {/* États */}
      {isLoading && (
        <div className="space-y-3 py-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3.5">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                <div className="h-2.5 w-1/3 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="h-3 w-14 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <p className="py-6 text-center text-[13px] text-red-500">{error}</p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="py-6 text-center text-[13px] text-gray-400">
          Aucune transaction pour le moment.
        </p>
      )}

      {/* Liste */}
      {!isLoading && !error && items.length > 0 && (
        <div className="space-y-0">
          {items.map((purchase: CoursePurchase, index: number) => (
            <div key={purchase.id}>
              <TransactionRow purchase={purchase} />
              {index < items.length - 1 && (
                <div className="border-t border-dashed border-gray-200" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Voir tout */}
      <Link href="/admin/transactions" className="block w-full">
        <button 
            className="relative w-full hover:cursor-pointer rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-[14px] font-medium text-gray-700 transition-all duration-200 ease-in-out hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white"
            aria-label="View all transactions"
        >
            <span className="flex items-center justify-center gap-2.5">
            <ExternalLinkIcon  />
            <span>Voir tout</span>
            </span>
        </button>
        </Link>
    </div>
  );
}