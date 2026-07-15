import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { getEntry } from "@/components/docs/registry";

type SpinnerArgs = { size: number };

const meta: Meta<SpinnerArgs> = {
  title: "Display/Spinner",
  parameters: { docs: { description: { component: getEntry("spinner")?.description } } },
  args: { size: 24 },
  argTypes: {
    size: { control: { type: "range", min: 12, max: 64, step: 2 }, description: "Rendered size in px" },
  },
  render: ({ size }) => <Spinner style={{ width: size, height: size }} />,
};
export default meta;
type Story = StoryObj<SpinnerArgs>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Playground: Story = {};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-end gap-5">
      <Cell label="size-4"><Spinner /></Cell>
      <Cell label="size-6"><Spinner className="size-6" /></Cell>
      <Cell label="size-8"><Spinner className="size-8" /></Cell>
    </div>
  ),
};

export const Colors: Story = {
  name: "Colors (inherits text)",
  parameters: { docs: { description: { story: "The spinner draws in `currentColor`, so set `text-*` on it or a parent to recolor it." } } },
  render: () => (
    <div className="flex flex-wrap items-center gap-5">
      <Cell label="muted"><Spinner className="size-6 text-muted-foreground" /></Cell>
      <Cell label="primary"><Spinner className="size-6 text-primary" /></Cell>
      <Cell label="destructive"><Spinner className="size-6 text-destructive" /></Cell>
    </div>
  ),
};

export const Tones: Story = {
  name: "Tones (token-driven)",
  parameters: {
    docs: {
      description: {
        story:
          "The `tone` prop binds to a token instead of inheriting text colour: `primary` for a brand spinner on a neutral surface, `on-brand` for a spinner sitting on a filled primary button. `inherit` (default) still follows `currentColor` — see the Colors story.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-5">
      <Cell label='tone="inherit"'><Spinner className="size-6" /></Cell>
      <Cell label='tone="primary"'><Spinner tone="primary" className="size-6" /></Cell>
      <Cell label='tone="on-brand"'>
        <span className="bg-primary flex size-10 items-center justify-center rounded-md">
          <Spinner tone="on-brand" className="size-6" />
        </span>
      </Cell>
    </div>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button disabled><Spinner />Loading</Button>
      <Button variant="outline" disabled><Spinner />Please wait</Button>
    </div>
  ),
};

export const Demo: Story = { name: "Demo (in context)", render: () => <>{getEntry("spinner")!.demo}</> };
