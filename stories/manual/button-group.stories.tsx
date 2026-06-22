import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Archive, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { getEntry } from "@/components/docs/registry";

type Args = { orientation: "horizontal" | "vertical" };

const meta: Meta<Args> = {
  title: "Form & Input/Button Group",
  parameters: { docs: { description: { component: getEntry("button-group")?.description } } },
  args: { orientation: "horizontal" },
  argTypes: { orientation: { control: "inline-radio", options: ["horizontal", "vertical"] } },
  render: ({ orientation }) => (
    <ButtonGroup orientation={orientation}>
      <Button variant="outline">Archive</Button>
      <Button variant="outline">Report</Button>
      <Button variant="outline">Snooze</Button>
    </ButtonGroup>
  ),
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

export const Orientations: Story = {
  name: "Orientations",
  parameters: { docs: { description: { story: "The group fuses adjacent buttons — only the outer corners stay rounded and shared borders collapse." } } },
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <Cell label="horizontal">
        <ButtonGroup>
          <Button variant="outline">Years</Button>
          <Button variant="outline">Months</Button>
          <Button variant="outline">Days</Button>
        </ButtonGroup>
      </Cell>
      <Cell label="vertical">
        <ButtonGroup orientation="vertical">
          <Button variant="outline">Top</Button>
          <Button variant="outline">Middle</Button>
          <Button variant="outline">Bottom</Button>
        </ButtonGroup>
      </Cell>
    </div>
  ),
};

export const WithSeparator: Story = {
  name: "With separator",
  render: () => (
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Previous"><ChevronLeft /></Button>
      <ButtonGroupSeparator />
      <Button variant="outline" size="icon" aria-label="Next"><ChevronRight /></Button>
    </ButtonGroup>
  ),
};

export const WithText: Story = {
  name: "With text",
  parameters: { docs: { description: { story: "`ButtonGroupText` adds a non-interactive label cell (prefix/suffix) on the muted surface." } } },
  render: () => (
    <ButtonGroup>
      <ButtonGroupText><Clock /> Remind me</ButtonGroupText>
      <Button variant="outline"><Archive /> Archive</Button>
    </ButtonGroup>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("button-group")!.demo}</> };
