import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEntry } from "@/components/docs/registry";

type Args = { height: number; items: number };

const meta: Meta<Args> = {
  title: "Utility/Scroll Area",
  parameters: { docs: { description: { component: getEntry("scroll-area")?.description } } },
  args: { height: 160, items: 20 },
  argTypes: {
    height: { control: { type: "range", min: 80, max: 320, step: 8 } },
    items: { control: { type: "number", min: 1, max: 50 } },
  },
  render: ({ height, items }) => (
    <ScrollArea className="w-56 rounded-md border p-4" style={{ height }}>
      <div className="space-y-2">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="text-sm">Item {i + 1}</div>
        ))}
      </div>
    </ScrollArea>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Directions: Story = {
  name: "Vertical & horizontal",
  parameters: { docs: { description: { story: "A custom-styled scrollbar appears on overflow — vertically for long lists, horizontally for wide rows. The thumb uses `--scroll-area-thumb`." } } },
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground font-mono text-xs">vertical</span>
        <ScrollArea className="h-40 w-56 rounded-md border p-4">
          <div className="space-y-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="text-sm">Item {i + 1}</div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground font-mono text-xs">horizontal</span>
        <ScrollArea className="w-72 rounded-md border p-4">
          <div className="flex gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="grid size-24 shrink-0 place-items-center rounded-md bg-muted text-sm">{i + 1}</div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("scroll-area")!.demo}</> };
