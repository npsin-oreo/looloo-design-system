import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "@/components/ui/separator";

const meta: Meta<typeof Separator> = {
  title: "Display/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: { orientation: { control: "inline-radio", options: ["horizontal", "vertical"] } },
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-72">
      <div className="text-sm font-medium">Radix Primitives</div>
      <p className="text-muted-foreground text-sm">An open-source UI component library.</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
      </div>
    </div>
  ),
};
