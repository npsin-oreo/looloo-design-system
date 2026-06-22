import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext, PaginationEllipsis,
} from "@/components/ui/pagination";
import { getEntry } from "@/components/docs/registry";

type Args = { pages: number; current: number };

const meta: Meta<Args> = {
  title: "Navigation/Pagination",
  parameters: { docs: { description: { component: getEntry("pagination")?.description } } },
  args: { pages: 3, current: 2 },
  argTypes: {
    pages: { control: { type: "number", min: 1, max: 8 } },
    current: { control: { type: "number", min: 1, max: 8 } },
  },
  render: ({ pages, current }) => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {Array.from({ length: pages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink href="#" isActive={i + 1 === current}>{i + 1}</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
export default meta;
type Story = StoryObj<Args>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Playground: Story = {};

export const States: Story = {
  name: "Link states",
  parameters: { docs: { description: { story: "The current page renders as a `Button` outline (`aria-current=\"page\"`); the rest are ghost links." } } },
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <Cell label="inactive">
        <Pagination><PaginationContent><PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem></PaginationContent></Pagination>
      </Cell>
      <Cell label="active (current)">
        <Pagination><PaginationContent><PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem></PaginationContent></Pagination>
      </Cell>
      <Cell label="ellipsis">
        <Pagination><PaginationContent><PaginationItem><PaginationEllipsis /></PaginationItem></PaginationContent></Pagination>
      </Cell>
    </div>
  ),
};

export const Compact: Story = {
  name: "Compact (prev / next only)",
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("pagination")!.demo}</> };
