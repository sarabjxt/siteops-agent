"use client"

import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { InventoryRow } from "@/types/siteops"
import { Package } from "lucide-react"

interface InventoryTableProps {
  items: InventoryRow[]
  isLoading: boolean
}

export function InventoryTable({ items, isLoading }: InventoryTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-medium">
            <Package className="size-4" />
            <span>Inventory Log</span>
          </div>
          <Badge variant="secondary">
            {items.length} {items.length === 1 ? "item" : "items"}
          </Badge>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl bg-muted/50 dark:bg-card">
        {isLoading ? (
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Spinner />
              </EmptyMedia>
              <EmptyTitle>Loading...</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : items.length === 0 ? (
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Package />
              </EmptyMedia>
              <EmptyTitle>No inventory recorded</EmptyTitle>
              <EmptyDescription>
                Try clicking a sample prompt or send a material arrival message.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.item}</TableCell>
                  <TableCell className="text-right font-mono">
                    {row.quantity}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.unit}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.supplier ? row.supplier : "—"}
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
