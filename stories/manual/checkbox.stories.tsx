import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Checkbox> = {
  title: "Form & Input/Checkbox",
  component: Checkbox,
  parameters: { docs: { description: { component: getEntry("checkbox")?.description } } },
  args: { defaultChecked: false, disabled: false },
  argTypes: {
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: (args) => <Checkbox aria-label="Accept" {...args} />,
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

// Labeled cell for the state gallery.
function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Playground: Story = {};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "Unchecked/checked are the two values; focus reproduces the focus-visible ring statically; disabled (both values) and error (`aria-invalid`) use real attributes." } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Cell label="unchecked"><Checkbox aria-label="unchecked" /></Cell>
      <Cell label="checked"><Checkbox aria-label="checked" defaultChecked /></Cell>
      <Cell label="focus"><Checkbox aria-label="focus" defaultChecked className="border-ring ring-3 ring-ring/50" /></Cell>
      <Cell label="disabled"><Checkbox aria-label="disabled" disabled /></Cell>
      <Cell label="disabled checked"><Checkbox aria-label="disabled checked" disabled defaultChecked /></Cell>
      <Cell label="error"><Checkbox aria-label="error" aria-invalid /></Cell>
    </div>
  ),
};

export const WithLabel: Story = {
  name: "With label",
  parameters: { docs: { description: { story: "Pair with a `Label` (`htmlFor` ↔ `id`) so the text is part of the hit target." } } },
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" defaultChecked />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Demo: Story = { name: "Demo (states)", render: () => <>{getEntry("checkbox")!.demo}</> };
