import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const meta: Meta<typeof Label> = {
  title: "Form & Input/Label",
  component: Label,
  tags: ["autodocs"],
  args: { children: "Accept terms and conditions" },
  argTypes: { children: { control: "text" } },
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Playground: Story = {};

export const WithControl: Story = {
  render: () => (
    <Label htmlFor="terms" className="flex items-center gap-2">
      <Checkbox id="terms" />
      Accept terms and conditions
    </Label>
  ),
};
