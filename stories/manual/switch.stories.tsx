import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Switch> = {
  title: "Form & Input/Switch",
  component: Switch,
  parameters: { docs: { description: { component: getEntry("switch")?.description } } },
  args: { defaultChecked: false, disabled: false },
  argTypes: {
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    size: { control: "inline-radio", options: ["sm", "default"] },
  },
  render: (args) => <Switch aria-label="Toggle setting" {...args} />,
};
export default meta;
type Story = StoryObj<typeof Switch>;

// Labeled cell for the state/size galleries.
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
    docs: { description: { story: "Off/on are the two checked states; focus reproduces the focus-visible ring statically; disabled (both checked positions) uses the real attribute; error uses `aria-invalid`." } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Cell label="off"><Switch aria-label="off" /></Cell>
      <Cell label="on"><Switch aria-label="on" defaultChecked /></Cell>
      <Cell label="focus"><Switch aria-label="focus" defaultChecked className="border-ring ring-3 ring-ring/50" /></Cell>
      <Cell label="disabled off"><Switch aria-label="disabled off" disabled /></Cell>
      <Cell label="disabled on"><Switch aria-label="disabled on" disabled defaultChecked /></Cell>
      <Cell label="error"><Switch aria-label="error" aria-invalid /></Cell>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Cell label="sm"><Switch size="sm" aria-label="small" defaultChecked /></Cell>
      <Cell label="default"><Switch size="default" aria-label="default" defaultChecked /></Cell>
    </div>
  ),
};

export const WithLabel: Story = {
  name: "With label",
  parameters: { docs: { description: { story: "Pair with a `Label` (`htmlFor` ↔ `id`) so the whole text is a click target and the control is announced." } } },
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane" />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  ),
};

export const Demo: Story = { name: "Demo (states)", render: () => <>{getEntry("switch")!.demo}</> };
