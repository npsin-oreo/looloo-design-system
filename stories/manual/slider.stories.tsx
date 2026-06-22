import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Slider } from "@/components/ui/slider";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Slider> = {
  title: "Form & Input/Slider",
  component: Slider,
  parameters: { docs: { description: { component: getEntry("slider")?.description } } },
  args: { defaultValue: [50], min: 0, max: 100, step: 1, disabled: false },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <div className="w-64">
      <Slider aria-label="Value" {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof Slider>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-64 flex-col gap-2">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}

export const Playground: Story = {};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "Single value, a two-thumb range, focus (static ring on the thumb), and disabled." } },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Cell label="value = 50"><Slider defaultValue={[50]} aria-label="single value" /></Cell>
      <Cell label="range = [25, 75]"><Slider defaultValue={[25, 75]} aria-label="range" /></Cell>
      <Cell label="focus">
        <Slider defaultValue={[50]} aria-label="focus" className="[&_[data-slot=slider-thumb]]:ring-3" />
      </Cell>
      <Cell label="disabled"><Slider defaultValue={[40]} disabled aria-label="disabled" /></Cell>
    </div>
  ),
};

export const Vertical: Story = {
  name: "Vertical",
  render: () => (
    <div className="h-48">
      <Slider defaultValue={[60]} orientation="vertical" aria-label="vertical" />
    </div>
  ),
};

export const Steps: Story = {
  name: "Steps",
  parameters: { docs: { description: { story: "`step` snaps the thumb to discrete increments." } } },
  render: () => (
    <Cell label="step = 10">
      <Slider defaultValue={[40]} step={10} aria-label="stepped" />
    </Cell>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("slider")!.demo}</> };
