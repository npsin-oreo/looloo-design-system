import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { getEntry } from "@/components/docs/registry";

type Args = { side: "top" | "right" | "bottom" | "left"; text: string };

const meta: Meta<Args> = {
  title: "Overlay/Tooltip",
  parameters: { docs: { description: { component: getEntry("tooltip")?.description } } },
  args: { side: "top", text: "Add to library" },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
    text: { control: "text" },
  },
  render: ({ side, text }) => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent side={side}>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Sides: Story = {
  name: "Sides",
  parameters: { docs: { description: { story: "The tooltip points to its trigger from any side. It uses the inverted surface (`--tooltip-bg` / `--tooltip-fg`) with a matching arrow." } } },
  render: () => (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-16 p-12">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side} defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="outline">{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("tooltip")!.demo}</> };
