import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "@/components/ui/separator";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Separator> = {
  title: "Data/Separator",
  component: Separator,
  parameters: { docs: { description: { component: getEntry("separator")?.description } } },
  args: { orientation: "horizontal", decorative: true },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    decorative: { control: "boolean" },
  },
  render: (args) =>
    args.orientation === "vertical" ? (
      <div className="flex h-12 items-center gap-4 text-sm">
        <span>Docs</span>
        <Separator {...args} />
        <span>Source</span>
      </div>
    ) : (
      <div className="w-64 space-y-4 text-sm">
        <span>Above</span>
        <Separator {...args} />
        <span>Below</span>
      </div>
    ),
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Playground: Story = {};

export const Orientations: Story = {
  name: "Orientations",
  parameters: { docs: { description: { story: "Horizontal divides stacked blocks; vertical divides inline items. `decorative={false}` exposes it as a semantic separator to AT." } } },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-64">
        <div className="space-y-1">
          <p className="text-sm font-medium">Radix Primitives</p>
          <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center gap-3 text-sm">
          <span>Blog</span>
          <Separator orientation="vertical" />
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Source</span>
        </div>
      </div>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("separator")!.demo}</> };
