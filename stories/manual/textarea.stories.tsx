import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Textarea> = {
  title: "Form & Input/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: { placeholder: "Type your message here.", disabled: false },
  argTypes: { disabled: { control: "boolean" }, placeholder: { control: "text" } },
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Playground: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="msg">Your message</Label>
      <Textarea id="msg" {...args} />
    </div>
  ),
};
