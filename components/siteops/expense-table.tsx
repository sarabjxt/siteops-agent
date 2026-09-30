"use client"

import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ExpenseRow } from "@/types/siteops"
import { Receipt } from "lucide-react"

interface ExpenseTableProps {
  items: ExpenseRow[]
}

export function ExpenseTable({ items }: ExpenseTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-medium">
            <Receipt className="size-4" />
            <span>Site Expenses</span>
          </div>
          <Badge variant="secondary">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </Badge>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl bg-muted/50 dark:bg-card">
        {items.length === 0 ? (
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Receipt />
              </EmptyMedia>
              <EmptyTitle>No expenses recorded</EmptyTitle>
              <EmptyDescription>
                Try clicking a sample prompt with payment details or submit a
                cost memo.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Paid To</TableHead>
                <TableHead>Mode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium capitalize">
                    {row.category}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    ₹{row.amount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.paidTo ? row.paidTo : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">
                      {row.paymentMode ? row.paymentMode : "cash"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
