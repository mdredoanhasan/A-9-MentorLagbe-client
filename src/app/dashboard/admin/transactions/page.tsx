"use client";

import { useApi } from "@/app/lib/use-api";
import { PageHeader, SimpleTable } from "../../ui";
import { Payment } from "@/components/type";


export default function Transactions() {
  const { data, loading } = useApi<Payment[]>("/api/admin/payments");

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" subtitle="Stripe subscription payments." />
      <SimpleTable<Payment>
        rows={data}
        loading={loading}
        empty="No payments yet."
        columns={[
          { header: "User", cell: (payment) => <span className="font-medium">{payment.userName}</span> },
          { header: "Email", cell: (payment) => payment.email },
          { header: "Role", cell: (payment) => <span className="capitalize">{payment.role}</span> },
          { header: "Plan", cell: (payment) => payment.plan },
          { header: "Amount", cell: (payment) => `$${payment.amount}` },
          { header: "Transaction ID", cell: (payment) => <code className="text-xs">{payment.transactionId}</code> },
          { header: "Date", cell: (payment) => new Date(payment.paidAt).toLocaleDateString() },
        ]}
      />
    </div>
  );
}