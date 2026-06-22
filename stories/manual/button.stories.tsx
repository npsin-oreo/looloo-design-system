import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Button> = {
  title: "Form & Input/Button",
  component: Button,
  parameters: { docs: { description: { component: getEntry("button")?.description } } },
  args: { children: "Button", variant: "default", size: "default", disabled: false, loading: false },
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "secondary", "ghost", "destructive", "link"] },
    size: { control: "select", options: ["xs", "sm", "default", "lg", "xl", "icon"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean", description: "Spinner + aria-busy, blocks interaction" },
    children: { control: "text" },
    asChild: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

// Labeled cell for the variant/state galleries.
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
      {(["default", "outline", "secondary", "ghost", "destructive", "link"] as const).map((v) => (
        <Cell key={v} label={v}>
          <Button variant={v}>Button</Button>
        </Cell>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      {(["xs", "sm", "default", "lg", "xl"] as const).map((s) => (
        <Cell key={s} label={s}>
          <Button size={s}>Button</Button>
        </Cell>
      ))}
    </div>
  ),
};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "All eight interaction states. Hover/Focus/Active reproduce the component's own pseudo-class utilities so they render statically; Disabled/Loading/Error use real attributes." } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Cell label="default"><Button>Button</Button></Cell>
      <Cell label="hover"><Button className="bg-primary/80!">Button</Button></Cell>
      <Cell label="focus"><Button className="border-ring ring-ring/50 ring-3">Button</Button></Cell>
      <Cell label="active"><Button className="translate-y-px">Button</Button></Cell>
      <Cell label="disabled"><Button disabled>Button</Button></Cell>
      <Cell label="loading"><Button loading>Saving</Button></Cell>
      <Cell label="error"><Button variant="outline" aria-invalid>Button</Button></Cell>
    </div>
  ),
};

export const Loading: Story = {
  name: "Loading",
  args: { loading: true, children: "Saving…" },
  parameters: { docs: { description: { story: "`loading` shows a spinner, sets `aria-busy`, and blocks interaction." } } },
};

export const Disabled: Story = { name: "Disabled", args: { disabled: true } };

export const Demo: Story = { name: "Demo (all variants)", render: () => <>{getEntry("button")!.demo}</> };
