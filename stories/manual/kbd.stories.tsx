import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Kbd> = {
  title: "Display/Kbd",
  component: Kbd,
  parameters: { docs: { description: { component: getEntry("kbd")?.description } } },
  args: { children: "⌘K" },
  argTypes: { children: { control: "text" } },
};
export default meta;
type Story = StoryObj<typeof Kbd>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Playground: Story = {};

export const Keys: Story = {
  name: "Single keys",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {["⌘", "⇧", "⌥", "⌃", "↵", "Esc", "Tab"].map((k) => (
        <Cell key={k} label={k}><Kbd>{k}</Kbd></Cell>
      ))}
    </div>
  ),
};

export const Combos: Story = {
  name: "Combos (KbdGroup)",
  parameters: { docs: { description: { story: "`KbdGroup` lays out a chord — a sequence of keys pressed together." } } },
  render: () => (
    <div className="flex flex-wrap items-center gap-5">
      <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
      <KbdGroup><Kbd>⌘</Kbd><Kbd>⇧</Kbd><Kbd>P</Kbd></KbdGroup>
      <KbdGroup><Kbd>Ctrl</Kbd><Kbd>C</Kbd></KbdGroup>
    </div>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Button variant="outline">
      Search<KbdGroup className="ml-2"><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
    </Button>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("kbd")!.demo}</> };
