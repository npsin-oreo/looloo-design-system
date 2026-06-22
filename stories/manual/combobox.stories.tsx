import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getEntry } from "@/components/docs/registry";

type Args = { placeholder: string; searchPlaceholder: string; disabled: boolean };

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

function Combobox({ placeholder, searchPlaceholder, disabled }: Args) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} disabled={disabled} className="w-[220px] justify-between">
          {value ? frameworks.find((f) => f.value === value)?.label : placeholder}
          <ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((f) => (
                <CommandItem key={f.value} value={f.value} onSelect={(current) => { setValue(current === value ? "" : current); setOpen(false); }}>
                  <Check className={cn("mr-2 size-4", value === f.value ? "opacity-100" : "opacity-0")} />
                  {f.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const meta: Meta<Args> = {
  title: "Form & Input/Combobox",
  parameters: { docs: { description: { component: getEntry("combobox")?.description } } },
  args: { placeholder: "Select framework...", searchPlaceholder: "Search framework...", disabled: false },
  argTypes: {
    placeholder: { control: "text", description: "Trigger label when nothing is selected" },
    searchPlaceholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  render: (args) => <Combobox {...args} />,
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const TriggerStates: Story = {
  name: "Trigger states",
  parameters: {
    docs: { description: { story: "A Combobox is a composition — `Button` (trigger) + `Popover` + `Command`. Closed-trigger states shown here; the open popover and search live in Playground/Demo." } },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <div className="flex flex-col items-start gap-2">
        <Button variant="outline" role="combobox" className="w-[220px] justify-between">
          Select framework…<ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
        <span className="text-muted-foreground font-mono text-xs">empty</span>
      </div>
      <div className="flex flex-col items-start gap-2">
        <Button variant="outline" role="combobox" className="w-[220px] justify-between">
          Next.js<ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
        <span className="text-muted-foreground font-mono text-xs">selected</span>
      </div>
      <div className="flex flex-col items-start gap-2">
        <Button variant="outline" role="combobox" disabled className="w-[220px] justify-between">
          Select framework…<ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
        <span className="text-muted-foreground font-mono text-xs">disabled</span>
      </div>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("combobox")!.demo}</> };
