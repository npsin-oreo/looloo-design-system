import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getEntry } from "@/components/docs/registry";

type Args = { defaultValue: string; disabled: boolean };

const options = ["Default", "Comfortable", "Compact"];

const meta: Meta<Args> = {
  title: "Form & Input/Radio Group",
  parameters: { docs: { description: { component: getEntry("radio-group")?.description } } },
  args: { defaultValue: "Comfortable", disabled: false },
  argTypes: {
    defaultValue: { control: "inline-radio", options },
    disabled: { control: "boolean" },
  },
  render: ({ defaultValue, disabled }) => (
    <RadioGroup defaultValue={defaultValue} disabled={disabled} className="gap-3">
      {options.map((o) => (
        <div key={o} className="flex items-center gap-2">
          <RadioGroupItem value={o} id={o} />
          <Label htmlFor={o}>{o}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};
export default meta;
type Story = StoryObj<Args>;

// Labeled cell for the item-state gallery.
function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Playground: Story = {};

export const ItemStates: Story = {
  name: "Item states",
  parameters: {
    docs: { description: { story: "A single item across states: unselected/selected, focus (static ring), disabled, and error (`aria-invalid`)." } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-5">
      <RadioGroup defaultValue="b" className="contents">
        <Cell label="unselected"><RadioGroupItem value="a" aria-label="unselected" /></Cell>
        <Cell label="selected"><RadioGroupItem value="b" aria-label="selected" /></Cell>
        <Cell label="focus"><RadioGroupItem value="c" aria-label="focus" className="border-ring ring-3 ring-ring/50" /></Cell>
      </RadioGroup>
      <RadioGroup defaultValue="e" disabled className="contents">
        <Cell label="disabled"><RadioGroupItem value="d" aria-label="disabled" /></Cell>
        <Cell label="disabled selected"><RadioGroupItem value="e" aria-label="disabled selected" /></Cell>
      </RadioGroup>
      <RadioGroup className="contents">
        <Cell label="error"><RadioGroupItem value="f" aria-label="error" aria-invalid /></Cell>
      </RadioGroup>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("radio-group")!.demo}</> };
