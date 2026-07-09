import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { ArrowUpDown } from "@/icons/icon-registry";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
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

function DataTableStory({ rowCount, defaultDesc }: Args) {
  const data = React.useMemo(() => payments.slice(0, rowCount), [rowCount]);
  return (
    <DataTable
      columns={columns}
      data={data}
      defaultSorting={[{ id: "amount", desc: defaultDesc }]}
      className="max-w-lg"
    />
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
  render: (args) => <DataTableStory {...args} />,
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Sortable: Story = {
  name: "Sortable (TanStack)",
  parameters: {
    docs: { description: { story: "Powered by `@tanstack/react-table` — click the **Amount** header to toggle ascending/descending. The header button drives `column.toggleSorting`; rows come from `getSortedRowModel`." } },
  },
  render: () => <DataTableStory rowCount={6} defaultDesc />,
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("data-table")!.demo}</> };
