import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { getEntry } from "@/components/docs/registry";

type Args = { side: "top" | "right" | "bottom" | "left" };

const meta: Meta<Args> = {
  title: "Overlay/Hover Card",
  parameters: { docs: { description: { component: getEntry("hover-card")?.description } } },
  args: { side: "bottom" },
  argTypes: { side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] } },
  render: ({ side }) => (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent side={side} className="w-72 text-sm">
        <p className="font-semibold">@nextjs</p>
        <p className="text-muted-foreground">The React Framework — created and maintained by @vercel.</p>
      </HoverCardContent>
    </HoverCard>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Demo: Story = { name: "Demo", render: () => <>{getEntry("hover-card")!.demo}</> };
