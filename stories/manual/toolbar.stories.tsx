import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "@/components/ui/toolbar";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Toolbar> = {
  title: "Navigation/Toolbar",
  component: Toolbar,
  parameters: { docs: { description: { component: getEntry("toolbar")?.description } } },
  render: () => (
    <Toolbar>
      <ToolbarToggleGroup type="multiple" aria-label="Text formatting">
        <ToolbarToggleItem value="bold" aria-label="Bold" className="font-bold">B</ToolbarToggleItem>
        <ToolbarToggleItem value="italic" aria-label="Italic" className="italic">I</ToolbarToggleItem>
        <ToolbarToggleItem value="underline" aria-label="Underline" className="underline">U</ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton>Share</ToolbarButton>
    </Toolbar>
  ),
};
export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Playground: Story = {};
export const Demo: Story = { name: "Demo", render: () => <>{getEntry("toolbar")!.demo}</> };
