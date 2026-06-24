import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Input> = {
  title: "Form & Input/Input",
  component: Input,
  tags: ["autodocs"],
  args: { placeholder: "Email", type: "text", disabled: false },
  argTypes: {
    type: { control: "select", options: ["text", "email", "password", "number", "search", "tel", "url"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {};

export const Disabled: Story = { args: { disabled: true, value: "Can't touch this" } };

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" {...args} />
    </div>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="email-invalid">Email</Label>
      <Input id="email-invalid" aria-invalid {...args} />
      <span className="text-destructive text-xs">Enter a valid email address.</span>
    </div>
  ),
};
