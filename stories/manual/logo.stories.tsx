import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo } from "@/components/ui/logo";

const meta: Meta<typeof Logo> = {
  title: "Brand/Logo",
  component: Logo,
  parameters: {
    docs: {
      description: {
        component:
          "The Virtual Agent logo, as a component — not artwork you copy. `type=mark` is the symbol alone; `type=lockup` is symbol + wordmark; `type=horizontal` is the wide lockup. `tone=brand` is the real thing; `tone=mono` collapses it to a single navy; `tone=inverse` is white on a navy plate. Every colour is bound to a brand primitive, so the logo follows a rebrand. Size it with a height utility — the width follows; never scale the vector inside it.",
      },
    },
  },
  args: { type: "lockup", tone: "brand", className: "h-16 w-auto" },
  argTypes: {
    type: { control: "inline-radio", options: ["mark", "lockup", "horizontal"] },
    tone: { control: "inline-radio", options: ["brand", "mono", "inverse"] },
  },
};
export default meta;
type Story = StoryObj<typeof Logo>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}

export const Playground: Story = {};

export const Variants: Story = {
  name: "Variants",
  parameters: {
    docs: { description: { story: "All `type` × `tone` combinations. `inverse` ships its own navy plate." } },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {(["mark", "lockup", "horizontal"] as const).map((type) => (
        <div key={type} className="flex flex-col gap-4">
          <span className="text-foreground font-mono text-sm">type={type}</span>
          <div className="flex flex-wrap items-end gap-8">
            <Cell label="tone=brand">
              <Logo type={type} tone="brand" className="h-14 w-auto" />
            </Cell>
            <Cell label="tone=mono">
              <Logo type={type} tone="mono" className="h-14 w-auto" />
            </Cell>
            <Cell label="tone=inverse">
              <Logo type={type} tone="inverse" className="h-20 w-auto" />
            </Cell>
          </div>
        </div>
      ))}
    </div>
  ),
};
