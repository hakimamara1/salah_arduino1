import { Phone, MessageCircle, Inbox } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { OrderRow } from "@/types/order";

const WHATSAPP_BASE = "https://wa.me/";

function waLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Local 0XXXXXXXXX → 213XXXXXXXXX for WhatsApp.
  const intl = digits.startsWith("0") ? `213${digits.slice(1)}` : digits;
  return `${WHATSAPP_BASE}${intl}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersTable({ rows }: { rows: OrderRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-16 text-center">
        <Inbox className="size-10 text-muted-foreground/50" />
        <p className="mt-3 font-semibold text-ink">No orders found</p>
        <p className="text-sm text-muted-foreground">
          New orders will appear here as they come in.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Wilaya / Commune</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Variant</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-semibold text-ink">
                {order.full_name}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2" dir="ltr">
                  <a
                    href={`tel:${order.phone}`}
                    className="inline-flex items-center gap-1 font-medium text-brand hover:underline"
                  >
                    <Phone className="size-3.5" />
                    {order.phone}
                  </a>
                  <a
                    href={waLink(order.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open WhatsApp chat"
                    className="text-[#25d366] hover:opacity-80"
                  >
                    <MessageCircle className="size-4" />
                  </a>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <span className="font-medium text-ink">{order.wilaya}</span>
                {order.commune && (
                  <span className="block text-xs text-muted-foreground">
                    {order.commune}
                  </span>
                )}
                <span className="block truncate text-xs text-muted-foreground/80">
                  {order.address}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {order.delivery_type ? (
                  <Badge variant="secondary">
                    {order.delivery_type === "home" ? "Home" : "Stop Desk"}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap font-bold text-ink">
                {order.total != null ? `${order.total.toLocaleString("en-US")} DA` : "—"}
              </TableCell>
              <TableCell>
                <Badge variant="brand">{order.landing_variant}</Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDate(order.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
