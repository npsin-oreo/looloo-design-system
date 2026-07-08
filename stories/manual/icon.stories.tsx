import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "@/components/ui/icon";
import { iconRegistry, type IconName } from "@/icons/icon-registry";

const meta: Meta<typeof Icon> = {
  title: "Display/Icon",
  component: Icon,
  parameters: {
    docs: {
      description: {
        component:
          "Token-driven icon (`tokens/component/icon.json` → `--icon-size-*`). Renders a curated lucide icon from `icons/icon-registry.ts` — the only sanctioned icon source. Decorative by default (`aria-hidden`); pass `aria-label` for meaningful icons.",
      },
    },
  },
  args: { name: "search", size: "md", tone: "default" },
  argTypes: {
    name: { control: "select", options: Object.keys(iconRegistry) },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    tone: { control: "select", options: ["default", "muted", "destructive"] },
  },
};
export default meta;
type Story = StoryObj<typeof Icon>;

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
    <div className="flex items-end gap-6">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <Cell key={size} label={size}>
          <Icon name="search" size={size} />
        </Cell>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(["default", "muted", "destructive"] as const).map((tone) => (
        <Cell key={tone} label={tone}>
          <Icon name="triangle-alert" tone={tone} />
        </Cell>
      ))}
    </div>
  ),
};

export const Registry: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 sm:grid-cols-8">
      {(Object.keys(iconRegistry) as IconName[]).map((name) => (
        <Cell key={name} label={name}>
          <Icon name={name} />
        </Cell>
      ))}
    </div>
  ),
};
