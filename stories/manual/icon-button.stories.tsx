import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconButton } from "@/components/ui/icon-button";
import { iconRegistry } from "@/icons/icon-registry";

const meta: Meta<typeof IconButton> = {
  title: "Form & Input/Icon Button",
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component:
          "Icon-only Button with a REQUIRED `aria-label` (the type errors without it). Wraps Button's `icon-*` sizes — sizing comes from the shared control scale (`tokens/component/icon-button.json`).",
      },
    },
  },
  args: { icon: "search", "aria-label": "Search", size: "md", variant: "default" },
  argTypes: {
    icon: { control: "select", options: Object.keys(iconRegistry) },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof IconButton>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Cell key={size} label={size}>
          <IconButton icon="settings" aria-label="Settings" size={size} />
        </Cell>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["default", "outline", "secondary", "ghost", "destructive"] as const).map(
        (variant) => (
          <Cell key={variant} label={variant}>
            <IconButton icon="copy" aria-label="Copy" variant={variant} />
          </Cell>
        )
      )}
    </div>
  ),
};
