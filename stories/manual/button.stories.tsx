import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cell, Row } from "./_shared";

const meta: Meta<typeof Button> = {
  title: "Form & Input/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button", variant: "default", size: "default", disabled: false },
  argTypes: {
    variant: { control: "select", options: ["default", "secondary", "destructive", "outline", "ghost", "link"] },
    size: { control: "select", options: ["xs", "sm", "default", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"] },
    disabled: { control: "boolean" },
    asChild: { control: "boolean" },
    children: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <Row>
      {(["default", "secondary", "destructive", "outline", "ghost", "link"] as const).map((v) => (
        <Cell key={v} label={v}>
          <Button variant={v}>Button</Button>
        </Cell>
      ))}
    </Row>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Row>
      {(["xs", "sm", "default", "lg"] as const).map((s) => (
        <Cell key={s} label={s}>
          <Button size={s}>Button</Button>
        </Cell>
      ))}
    </Row>
  ),
};

export const States: Story = {
  parameters: {
    docs: { description: { story: "Hover/Focus/Active reproduce the component's own pseudo-class utilities so they render statically; Disabled uses the real attribute." } },
  },
  render: () => (
    <Row>
      <Cell label="default"><Button>Button</Button></Cell>
      <Cell label="hover"><Button className="bg-primary/90!">Button</Button></Cell>
      <Cell label="focus"><Button className="border-ring ring-ring/50 ring-[3px]">Button</Button></Cell>
      <Cell label="active"><Button className="translate-y-px">Button</Button></Cell>
      <Cell label="disabled"><Button disabled>Button</Button></Cell>
    </Row>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Button>
      Continue <ArrowRight />
    </Button>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
