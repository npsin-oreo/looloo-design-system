import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { getEntry } from "@/components/docs/registry";

type Args = { disabled: boolean };

const STATUSES = ["Todo", "In Progress", "Done", "Cancelled"];

function StatusSelect(props: React.ComponentProps<typeof NativeSelect>) {
  return (
    <NativeSelect aria-label="Status" defaultValue="todo" {...props}>
      {STATUSES.map((s) => (
        <NativeSelectOption key={s} value={s.toLowerCase().replace(" ", "-")}>{s}</NativeSelectOption>
      ))}
    </NativeSelect>
  );
}

const meta: Meta<Args> = {
  title: "Form & Input/Native Select",
  parameters: { docs: { description: { component: getEntry("native-select")?.description } } },
  args: { disabled: false },
  argTypes: { disabled: { control: "boolean" } },
  render: ({ disabled }) => <StatusSelect disabled={disabled} className="w-48" />,
};
export default meta;
type Story = StoryObj<Args>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Playground: Story = {};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "Closed-control states. Focus reproduces the focus-visible ring statically; disabled and error (`aria-invalid`) use real attributes." } },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Cell label="default"><StatusSelect className="w-44" /></Cell>
      <Cell label="focus"><StatusSelect className="w-44 [&_select]:border-ring [&_select]:ring-3 [&_select]:ring-ring/50" /></Cell>
      <Cell label="disabled"><StatusSelect className="w-44" disabled /></Cell>
      <Cell label="error"><StatusSelect className="w-44" aria-invalid /></Cell>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Cell label="sm"><StatusSelect size="sm" className="w-44" /></Cell>
      <Cell label="default"><StatusSelect size="default" className="w-44" /></Cell>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("native-select")!.demo}</> };
