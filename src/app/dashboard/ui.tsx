import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useApi } from "@/app/lib/use-api";

export const heading = "font-[family-name:var(--font-fraunces)] font-bold text-[#101535]";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className={`${heading} text-3xl`}>{title}</h1>
      {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
    </div>
  );
}

/* ---------- Status badge ---------- */
const badgeStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  approved: "bg-emerald-100 text-emerald-700",
  active: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  closed: "bg-gray-200 text-gray-600",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={`capitalize ${badgeStyles[status] ?? ""}`}>{status}</Badge>;
}

/* ---------- Stat card ---------- */
export type StatCardProps = { icon: LucideIcon; label: string; value: string | number; note: string };
export type OverviewAction = { icon: LucideIcon; label: string; href: string };

export function StatCard({ icon: Icon, label, value, note }: StatCardProps) {
  return (
    <Card className="border-gray-200 shadow-none">
      <CardContent className="p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e6eafc] text-[#1e2a78]">
          <Icon size={18} />
        </span>
        <p className={`${heading} mt-4 text-4xl`}>{value}</p>
        <p className="mt-1 text-sm font-medium text-[#101535]">{label}</p>
        <p className="text-sm text-slate-500">{note}</p>
      </CardContent>
    </Card>
  );
}

/* ---------- Overview page (used by all 3 roles) ---------- */
export function StatsOverview<TStats>({
  title, subtitle, endpoint, cards, actions,
}: {
  title: string;
  subtitle: string;
  endpoint: string;
  cards: (statistics: TStats) => StatCardProps[];
  actions: OverviewAction[];
}) {
  const { data, loading, error } = useApi<TStats>(endpoint);

  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle={subtitle} />
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, skeletonIndex) => (
              <div key={skeletonIndex} className="h-40 animate-pulse rounded-xl bg-gray-200" />
            ))
          : data &&
            cards(data).map((statCard) => (
              <StatCard key={statCard.label} {...statCard} />
            ))}
      </div>
      <section className="space-y-3">
        <h2 className={`${heading} text-xl`}>Quick actions</h2>
        <div className="flex flex-wrap gap-3">
            {actions.map(({ icon: Icon, label, href }) => (
              <Button
                key={label}
                nativeButton={false}
                render={<Link href={href} />}
                variant="outline"
                className="gap-2 border-[#e3e5f5] text-[#1e2a78] hover:bg-[#e6eafc]"
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Button>
            ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- Simple table ---------- */
export type Column<TRecord> = {
  header: string;
  cell: (record: TRecord) => ReactNode;
};

export function SimpleTable<TRecord extends { _id: string }>({
  columns, rows, loading, empty = "Nothing here yet.",
}: {
  columns: Column<TRecord>[];
  rows: TRecord[] | null;
  loading: boolean;
  empty?: string;
}) {
  const tableRows = rows ?? [];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.header}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading || tableRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center text-slate-500">
                {loading ? "Loading…" : empty}
              </TableCell>
            </TableRow>
          ) : (
            tableRows.map((record) => (
              <TableRow key={record._id}>
                {columns.map((column) => (
                  <TableCell key={column.header}>
                    {column.cell(record)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}