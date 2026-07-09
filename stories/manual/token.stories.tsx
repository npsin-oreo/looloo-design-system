import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Token } from "@/components/ui/token";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Token> = {
  title: "Display/Token",
  component: Token,
  parameters: { docs: { description: { component: getEntry("token")?.description } } },
  args: { label: "react", variant: "default", size: "md" },
  argTypes: {
    label: { control: "text" },
    variant: { control: "inline-radio", options: ["default", "secondary", "primary"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  render: (args) => <Token {...args} onRemove={() => {}} />,
};
export default meta;
type Story = StoryObj<typeof Token>;

export const Playground: Story = {};
export const Demo: Story = { name: "Demo", render: () => <>{getEntry("token")!.demo}</> };
