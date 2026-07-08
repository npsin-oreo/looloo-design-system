import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "@/icons/icon-registry";
import { getEntry } from "@/components/docs/registry";

type Args = {
  type: "single" | "multiple";
  variant: "default" | "outline";
  size: "default" | "sm" | "lg";
  disabled: boolean;
};

const meta: Meta<Args> = {
  title: "Form & Input/Toggle Group",
  parameters: { docs: { description: { component: getEntry("toggle-group")?.description } } },
  args: { type: "multiple", variant: "outline", size: "default", disabled: false },
  argTypes: {
    type: { control: "inline-radio", options: ["single", "multiple"] },
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
  },
  render: ({ type, variant, size, disabled }) => {
    const body = (
      <>
        <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic"><Italic /></ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline"><Underline /></ToggleGroupItem>
      </>
    );
    return type === "single" ? (
      <ToggleGroup type="single" variant={variant} size={size} disabled={disabled}>{body}</ToggleGroup>
    ) : (
      <ToggleGroup type="multiple" variant={variant} size={size} disabled={disabled}>{body}</ToggleGroup>
    );
  },
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

const Marks = () => (
  <>
    <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Italic"><Italic /></ToggleGroupItem>
    <ToggleGroupItem value="underline" aria-label="Underline"><Underline /></ToggleGroupItem>
  </>
);

export const Playground: Story = {};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <Cell label="default"><ToggleGroup type="multiple"><Marks /></ToggleGroup></Cell>
      <Cell label="outline"><ToggleGroup type="multiple" variant="outline"><Marks /></ToggleGroup></Cell>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      {(["sm", "default", "lg"] as const).map((s) => (
        <Cell key={s} label={s}>
          <ToggleGroup type="multiple" variant="outline" size={s}><Marks /></ToggleGroup>
        </Cell>
      ))}
    </div>
  ),
};

export const SingleSelect: Story = {
  name: "Single select (joined)",
  parameters: { docs: { description: { story: "`type=\"single\"` with `spacing={0}` fuses items into a segmented control — exactly one stays pressed." } } },
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="center" spacing={0}>
      <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right"><AlignRight /></ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("toggle-group")!.demo}</> };
