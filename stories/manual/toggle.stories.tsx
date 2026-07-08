import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toggle } from "@/components/ui/toggle";
import { Bold } from "@/icons/icon-registry";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Toggle> = {
  title: "Form & Input/Toggle",
  component: Toggle,
  parameters: { docs: { description: { component: getEntry("toggle")?.description } } },
  args: { variant: "default", size: "default", disabled: false, defaultPressed: false },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
    defaultPressed: { control: "boolean" },
  },
  render: (args) => (
    <Toggle aria-label="Toggle bold" {...args}>
      <Bold />
    </Toggle>
  ),
};
export default meta;
type Story = StoryObj<typeof Toggle>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Playground: Story = {};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Cell label="default"><Toggle aria-label="Bold"><Bold /></Toggle></Cell>
      <Cell label="outline"><Toggle variant="outline" aria-label="Bold"><Bold /></Toggle></Cell>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["sm", "default", "lg"] as const).map((s) => (
        <Cell key={s} label={s}>
          <Toggle size={s} aria-label={`Bold ${s}`}><Bold /></Toggle>
        </Cell>
      ))}
    </div>
  ),
};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "Off/on are the two pressed states; focus reproduces the focus-visible ring statically; disabled uses the real attribute." } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Cell label="off"><Toggle aria-label="off"><Bold /></Toggle></Cell>
      <Cell label="on"><Toggle defaultPressed aria-label="on"><Bold /></Toggle></Cell>
      <Cell label="focus"><Toggle defaultPressed aria-label="focus" className="border-ring ring-[3px] ring-ring/50"><Bold /></Toggle></Cell>
      <Cell label="disabled"><Toggle disabled aria-label="disabled"><Bold /></Toggle></Cell>
      <Cell label="disabled on"><Toggle disabled defaultPressed aria-label="disabled on"><Bold /></Toggle></Cell>
    </div>
  ),
};

export const Demo: Story = { name: "Demo (variants)", render: () => <>{getEntry("toggle")!.demo}</> };
