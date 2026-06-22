import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getEntry } from "@/components/docs/registry";

type Args = { placeholder: string; disabled: boolean };

function DatePicker({ placeholder, disabled }: Args) {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
      </PopoverContent>
    </Popover>
  );
}

const meta: Meta<Args> = {
  title: "Utility/Date Picker",
  parameters: { docs: { description: { component: getEntry("date-picker")?.description } } },
  args: { placeholder: "Pick a date", disabled: false },
  argTypes: {
    placeholder: { control: "text", description: "Trigger label before a date is chosen" },
    disabled: { control: "boolean" },
  },
  render: (args) => <DatePicker {...args} />,
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Demo: Story = { name: "Demo", render: () => <>{getEntry("date-picker")!.demo}</> };
