import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from "@/components/ui/command";
import { getEntry } from "@/components/docs/registry";

type Args = { placeholder: string };

const meta: Meta<Args> = {
  title: "Data/Command",
  parameters: { docs: { description: { component: getEntry("command")?.description } } },
  args: { placeholder: "Type a command or search…" },
  argTypes: { placeholder: { control: "text" } },
  render: ({ placeholder }) => (
    <Command className="w-80 rounded-lg border shadow-sm">
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Settings">
          <CommandItem>Profile <CommandShortcut>⌘P</CommandShortcut></CommandItem>
          <CommandItem>Billing <CommandShortcut>⌘B</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Empty: Story = {
  name: "Empty state",
  parameters: { docs: { description: { story: "When the query matches nothing, `CommandEmpty` renders the no-results message (`--command-empty`)." } } },
  render: () => (
    <Command className="w-80 rounded-lg border shadow-sm" value="">
      <CommandInput placeholder="Search…" value="zzzzz" onValueChange={() => {}} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("command")!.demo}</> };
