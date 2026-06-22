import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BadgeCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Badge> = {
  title: "Display/Badge",
  component: Badge,
  parameters: { docs: { description: { component: getEntry("badge")?.description } } },
  args: { children: "Badge", variant: "default" },
  argTypes: {
    variant: { control: "select", options: ["default", "secondary", "destructive", "outline", "ghost", "link"] },
    children: { control: "text" },
    asChild: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

// Labeled cell for the variant/state galleries.
function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const;

export const Playground: Story = {};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((v) => (
        <Cell key={v} label={v}>
          <Badge variant={v}>Badge</Badge>
        </Cell>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  name: "With icon",
  parameters: { docs: { description: { story: "Leading icons are auto-sized to `size-3`. Pair with a label — never ship an icon-only badge without accessible text." } } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge><BadgeCheck />Verified</Badge>
      <Badge variant="secondary"><Star />Featured</Badge>
      <Badge variant="outline">99+</Badge>
    </div>
  ),
};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "Focus reproduces the focus-visible ring statically; error uses a real `aria-invalid`. Hover only applies to interactive (anchor) badges via `asChild`." } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Cell label="default"><Badge>Badge</Badge></Cell>
      <Cell label="focus"><Badge className="border-ring ring-ring/50 ring-[3px]">Badge</Badge></Cell>
      <Cell label="error"><Badge variant="outline" aria-invalid>Badge</Badge></Cell>
      <Cell label="as link">
        <Badge asChild><a href="#">Link badge</a></Badge>
      </Cell>
    </div>
  ),
};

export const Demo: Story = { name: "Demo (all variants)", render: () => <>{getEntry("badge")!.demo}</> };
