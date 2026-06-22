import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select";
import { getEntry } from "@/components/docs/registry";

type Args = { placeholder: string; disabled: boolean };

const FRUITS = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

function FruitSelect(props: React.ComponentProps<typeof Select> & { placeholder?: string; size?: "sm" | "md" | "xl" | "default"; triggerClassName?: string; "aria-invalid"?: boolean }) {
  const { placeholder = "Select a fruit", size, triggerClassName, "aria-invalid": invalid, ...rest } = props;
  return (
    <Select {...rest}>
      <SelectTrigger size={size} aria-invalid={invalid} className={triggerClassName ?? "w-48"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {FRUITS.map((f) => (
            <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const meta: Meta<Args> = {
  title: "Form & Input/Select",
  parameters: { docs: { description: { component: getEntry("select")?.description } } },
  args: { placeholder: "Select a fruit", disabled: false },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  render: ({ placeholder, disabled }) => <FruitSelect placeholder={placeholder} disabled={disabled} />,
};
export default meta;
type Story = StoryObj<Args>;

// Labeled cell for the state/size galleries.
function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Playground: Story = {};

export const TriggerStates: Story = {
  name: "Trigger states",
  parameters: {
    docs: { description: { story: "Closed-trigger states. Focus reproduces the focus-visible ring statically; disabled + error (`aria-invalid`) use real attributes." } },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Cell label="default"><FruitSelect /></Cell>
      <Cell label="focus"><FruitSelect triggerClassName="w-48 border-ring ring-3 ring-ring/50" /></Cell>
      <Cell label="disabled"><FruitSelect disabled /></Cell>
      <Cell label="error"><FruitSelect aria-invalid /></Cell>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      {(["sm", "md", "default", "xl"] as const).map((s) => (
        <Cell key={s} label={s}>
          <FruitSelect size={s} />
        </Cell>
      ))}
    </div>
  ),
};

export const Open: Story = {
  name: "Open (content + items)",
  parameters: {
    docs: { description: { story: "The listbox open on mount — group label, items, the selected check indicator, and a separator. Highlighted item uses `--select-item-focus-bg`." } },
  },
  render: () => (
    <div className="h-72">
      <Select defaultOpen defaultValue="banana">
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {FRUITS.map((f) => (
              <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Other</SelectLabel>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="surprise" disabled>Surprise me (disabled)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("select")!.demo}</> };
