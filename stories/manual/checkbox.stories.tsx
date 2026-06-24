import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Cell, Row } from "./_shared";

const meta: Meta<typeof Checkbox> = {
  title: "Form & Input/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { disabled: false, "aria-label": "Accept terms" },
  argTypes: { disabled: { control: "boolean" }, checked: { control: "boolean" } },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Row>
      <Cell label="unchecked"><Checkbox aria-label="unchecked" /></Cell>
      <Cell label="checked"><Checkbox defaultChecked aria-label="checked" /></Cell>
      <Cell label="disabled"><Checkbox disabled aria-label="disabled" /></Cell>
      <Cell label="disabled checked"><Checkbox disabled defaultChecked aria-label="disabled checked" /></Cell>
    </Row>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Label htmlFor="newsletter" className="flex items-center gap-2">
      <Checkbox id="newsletter" defaultChecked />
      Subscribe to the newsletter
    </Label>
  ),
};
