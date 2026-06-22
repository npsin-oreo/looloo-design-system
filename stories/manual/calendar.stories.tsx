import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar } from "@/components/ui/calendar";
import { getEntry } from "@/components/docs/registry";

type Args = { numberOfMonths: number; showOutsideDays: boolean };

const meta: Meta<Args> = {
  title: "Utility/Calendar",
  parameters: { docs: { description: { component: getEntry("calendar")?.description } } },
  args: { numberOfMonths: 1, showOutsideDays: true },
  argTypes: {
    numberOfMonths: { control: { type: "number", min: 1, max: 3 } },
    showOutsideDays: { control: "boolean" },
  },
  render: ({ numberOfMonths, showOutsideDays }) => (
    <Calendar
      mode="single"
      numberOfMonths={numberOfMonths}
      showOutsideDays={showOutsideDays}
      className="rounded-md border"
    />
  ),
};
export default meta;
type Story = StoryObj<Args>;

const MONTH = new Date(2026, 5, 1); // June 2026

export const Playground: Story = {};

export const Modes: Story = {
  name: "Selection modes",
  parameters: { docs: { description: { story: "`single` picks one day, `range` picks a span (`--calendar-range-bg`), `multiple` picks several. The selected day uses `--calendar-selected-bg`." } } },
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground font-mono text-xs">single</span>
        <Calendar mode="single" defaultMonth={MONTH} selected={new Date(2026, 5, 12)} className="rounded-md border" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground font-mono text-xs">range</span>
        <Calendar mode="range" defaultMonth={MONTH} selected={{ from: new Date(2026, 5, 10), to: new Date(2026, 5, 16) }} className="rounded-md border" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground font-mono text-xs">multiple</span>
        <Calendar mode="multiple" defaultMonth={MONTH} selected={[new Date(2026, 5, 4), new Date(2026, 5, 11), new Date(2026, 5, 18)]} className="rounded-md border" />
      </div>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("calendar")!.demo}</> };
