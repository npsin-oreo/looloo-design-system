import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { ArrowUpDown } from "lucide-react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEntry } from "@/components/docs/registry";

type Args = { rowCount: number; defaultDesc: boolean };
type Payment = { id: string; status: string; email: string; amount: number };

const payments: Payment[] = [
  { id: "1", status: "success", email: "ken99@example.com", amount: 316 },
  { id: "2", status: "pending", email: "abe45@example.com", amount: 242 },
  { id: "3", status: "processing", email: "monserrat@example.com", amount: 837 },
  { id: "4", status: "failed", email: "carmella@example.com", amount: 721 },
  { id: "5", status: "success", email: "jason@example.com", amount: 159 },
  { id: "6", status: "pending", email: "silas@example.com", amount: 480 },
];

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "success" ? "default" : "secondary"}>{row.original.status}</Badge>
    ),
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <button
        type="button"
        className="ml-auto flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount <ArrowUpDown className="size-3.5" />
      </button>
    ),
    cell: ({ row }) => <div className="text-right font-medium">${row.original.amount.toFixed(2)}</div>,
  },
];

function DataTable({ rowCount, defaultDesc }: Args) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "amount", desc: defaultDesc }]);
  const data = React.useMemo(() => payments.slice(0, rowCount), [rowCount]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className="w-full max-w-lg rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id} className={h.column.id === "amount" ? "text-right" : undefined}>
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const meta: Meta<Args> = {
  title: "Data/Data Table",
  parameters: { docs: { description: { component: getEntry("data-table")?.description } } },
  args: { rowCount: 4, defaultDesc: true },
  argTypes: {
    rowCount: { control: { type: "range", min: 1, max: 6, step: 1 }, description: "Number of rows" },
    defaultDesc: { control: "boolean", description: "Sort amount descending (click the header to toggle)" },
  },
  render: (args) => <DataTable {...args} />,
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Sortable: Story = {
  name: "Sortable (TanStack)",
  parameters: {
    docs: { description: { story: "Powered by `@tanstack/react-table` — click the **Amount** header to toggle ascending/descending. The header button drives `column.toggleSorting`; rows come from `getSortedRowModel`." } },
  },
  render: () => <DataTable rowCount={6} defaultDesc />,
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("data-table")!.demo}</> };
