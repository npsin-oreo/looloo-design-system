import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "@/components/ui/skeleton";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Skeleton> = {
  title: "Display/Skeleton",
  component: Skeleton,
  parameters: { docs: { description: { component: getEntry("skeleton")?.description } } },
  args: { className: "h-4 w-48 rounded-md" },
  argTypes: {
    className: { control: "text", description: "Tailwind classes set the shape (h-* w-* rounded-*)" },
  },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Playground: Story = {};

export const Shapes: Story = {
  name: "Shapes",
  parameters: { docs: { description: { story: "Shape comes from the utility classes — `rounded-full` for avatars, `h-*/w-*` for lines and blocks." } } },
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <Cell label="circle"><Skeleton className="size-12 rounded-full" /></Cell>
      <Cell label="line"><Skeleton className="h-4 w-48" /></Cell>
      <Cell label="block"><Skeleton className="h-24 w-40 rounded-lg" /></Cell>
    </div>
  ),
};

export const InLayout: Story = {
  name: "In layout (card placeholder)",
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Skeleton className="h-28 w-full rounded-lg" />
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  ),
};

export const Demo: Story = { name: "Demo (card placeholder)", render: () => <>{getEntry("skeleton")!.demo}</> };
