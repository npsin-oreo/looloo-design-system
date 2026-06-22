import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton, InputGroupText } from "@/components/ui/input-group";
import { getEntry } from "@/components/docs/registry";
import { Search, Mail, X } from "lucide-react";

type Args = { placeholder: string; addon: "leading" | "trailing" | "both"; disabled: boolean };

const meta: Meta<Args> = {
  title: "Form & Input/Input Group",
  parameters: { docs: { description: { component: getEntry("input-group")?.description } } },
  args: { placeholder: "Search...", addon: "leading", disabled: false },
  argTypes: {
    placeholder: { control: "text" },
    addon: { control: "inline-radio", options: ["leading", "trailing", "both"], description: "Addon placement" },
    disabled: { control: "boolean" },
  },
  render: ({ placeholder, addon, disabled }) => (
    <InputGroup className="w-full max-w-sm">
      {(addon === "leading" || addon === "both") && (
        <InputGroupAddon><Search className="size-4" /></InputGroupAddon>
      )}
      <InputGroupInput placeholder={placeholder} disabled={disabled} aria-label="Search" />
      {(addon === "trailing" || addon === "both") && (
        <InputGroupAddon align="inline-end"><Mail className="size-4" /></InputGroupAddon>
      )}
    </InputGroup>
  ),
};
export default meta;
type Story = StoryObj<Args>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}

export const Playground: Story = {};

export const Addons: Story = {
  name: "Addon placements",
  render: () => (
    <div className="flex flex-col gap-4">
      <Cell label="leading icon">
        <InputGroup><InputGroupAddon><Search className="size-4" /></InputGroupAddon><InputGroupInput placeholder="Search…" aria-label="leading" /></InputGroup>
      </Cell>
      <Cell label="trailing icon">
        <InputGroup><InputGroupInput placeholder="you@example.com" aria-label="trailing" /><InputGroupAddon align="inline-end"><Mail className="size-4" /></InputGroupAddon></InputGroup>
      </Cell>
      <Cell label="text prefix">
        <InputGroup><InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon><InputGroupInput placeholder="acme.com" aria-label="prefix" /></InputGroup>
      </Cell>
      <Cell label="trailing button">
        <InputGroup><InputGroupInput placeholder="Search…" aria-label="button" /><InputGroupAddon align="inline-end"><InputGroupButton size="icon-xs" aria-label="Clear"><X /></InputGroupButton></InputGroupAddon></InputGroup>
      </Cell>
    </div>
  ),
};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "Focus and error are driven by the inner control and bubble to the group border via `has-[…]` selectors. Focus is shown statically here." } },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Cell label="default">
        <InputGroup><InputGroupAddon><Search className="size-4" /></InputGroupAddon><InputGroupInput placeholder="Search…" aria-label="default" /></InputGroup>
      </Cell>
      <Cell label="focus">
        <InputGroup className="border-ring ring-3 ring-ring/50"><InputGroupAddon><Search className="size-4" /></InputGroupAddon><InputGroupInput placeholder="Search…" aria-label="focus" /></InputGroup>
      </Cell>
      <Cell label="disabled">
        <InputGroup><InputGroupAddon><Search className="size-4" /></InputGroupAddon><InputGroupInput placeholder="Search…" aria-label="disabled" disabled /></InputGroup>
      </Cell>
      <Cell label="error">
        <InputGroup><InputGroupAddon><Search className="size-4" /></InputGroupAddon><InputGroupInput defaultValue="bad value" aria-label="error" aria-invalid /></InputGroup>
      </Cell>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("input-group")!.demo}</> };
