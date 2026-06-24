import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/components/ui/badge";
import { Cell, Row } from "./_shared";

const meta: Meta<typeof Badge> = {
  title: "Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Badge", variant: "default" },
  argTypes: {
    variant: { control: "select", options: ["default", "secondary", "destructive", "outline", "ghost", "link"] },
    asChild: { control: "boolean" },
    children: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <Row>
      {(["default", "secondary", "destructive", "outline", "ghost", "link"] as const).map((v) => (
        <Cell key={v} label={v}>
          <Badge variant={v}>Badge</Badge>
        </Cell>
      ))}
    </Row>
  ),
};
