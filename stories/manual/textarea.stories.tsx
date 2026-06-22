import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "@/components/ui/textarea";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Textarea> = {
  title: "Form & Input/Textarea",
  component: Textarea,
  parameters: { docs: { description: { component: getEntry("textarea")?.description } } },
  args: { placeholder: "Type your message here.", disabled: false, rows: 4 },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    rows: { control: { type: "number", min: 1, max: 20 } },
  },
  render: (args) => (
    <div className="w-72">
      <Textarea aria-label="Message" {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof Textarea>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}

export const Playground: Story = {};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "xl"] as const).map((s) => (
        <Cell key={s} label={s}>
          <Textarea size={s} placeholder={`Size ${s}`} aria-label={`Size ${s}`} />
        </Cell>
      ))}
    </div>
  ),
};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "Default, focus (reproduces the focus ring), filled, disabled, and error (`aria-invalid`) — all token-driven." } },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Cell label="default"><Textarea placeholder="Message" aria-label="default" /></Cell>
      <Cell label="focus"><Textarea placeholder="Message" aria-label="focus" className="border-ring ring-ring/50 ring-3" /></Cell>
      <Cell label="filled"><Textarea defaultValue="Sent from my iPhone." aria-label="filled" /></Cell>
      <Cell label="disabled"><Textarea placeholder="Message" aria-label="disabled" disabled /></Cell>
      <Cell label="error (aria-invalid)"><Textarea defaultValue="Too short" aria-label="error" aria-invalid /></Cell>
    </div>
  ),
};

export const Demo: Story = { name: "Demo (states)", render: () => <>{getEntry("textarea")!.demo}</> };
