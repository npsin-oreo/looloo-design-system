import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Progress } from "@/components/ui/progress";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Progress> = {
  title: "Display/Progress",
  component: Progress,
  parameters: { docs: { description: { component: getEntry("progress")?.description } } },
  args: { value: 60 },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  render: (args) => (
    <div className="w-64">
      <Progress {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof Progress>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-64 flex-col gap-2">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}

export const Playground: Story = {};

export const Values: Story = {
  name: "Values",
  parameters: { docs: { description: { story: "The indicator width tweens to `value` (0–100). The track is `--progress-track`, the fill `--progress-indicator`." } } },
  render: () => (
    <div className="flex flex-col gap-5">
      {[0, 25, 50, 75, 100].map((v) => (
        <Cell key={v} label={`${v}%`}>
          <Progress value={v} aria-label={`${v} percent`} />
        </Cell>
      ))}
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("progress")!.demo}</> };
