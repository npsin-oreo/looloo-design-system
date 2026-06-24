import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cell, Row } from "./_shared";

const meta: Meta<typeof Switch> = {
  title: "Form & Input/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { disabled: false, "aria-label": "Airplane mode" },
  argTypes: { disabled: { control: "boolean" }, checked: { control: "boolean" } },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Row>
      <Cell label="off"><Switch aria-label="off" /></Cell>
      <Cell label="on"><Switch defaultChecked aria-label="on" /></Cell>
      <Cell label="disabled"><Switch disabled aria-label="disabled" /></Cell>
      <Cell label="disabled on"><Switch disabled defaultChecked aria-label="disabled on" /></Cell>
    </Row>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Label htmlFor="airplane" className="flex items-center gap-2">
      <Switch id="airplane" />
      Airplane mode
    </Label>
  ),
};
