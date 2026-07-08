import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemGroup, ItemSeparator } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { CircleCheck, Bell } from "@/icons/icon-registry";
import { getEntry } from "@/components/docs/registry";

type Args = {
  variant: "default" | "outline" | "muted";
  size: "default" | "sm" | "xs";
  title: string;
  description: string;
};

const meta: Meta<Args> = {
  title: "Display/Item",
  parameters: { docs: { description: { component: getEntry("item")?.description } } },
  args: { variant: "outline", size: "default", title: "Basic Item", description: "A simple item with title and description." },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline", "muted"] },
    size: { control: "inline-radio", options: ["default", "sm", "xs"] },
    title: { control: "text" },
    description: { control: "text" },
  },
  render: ({ variant, size, title, description }) => (
    <Item variant={variant} size={size} className="w-96">
      <ItemMedia variant="icon"><CircleCheck /></ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">Open</Button>
      </ItemActions>
    </Item>
  ),
};
export default meta;
type Story = StoryObj<Args>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}

const Sample = (props: React.ComponentProps<typeof Item>) => (
  <Item className="w-96" {...props}>
    <ItemMedia variant="icon"><Bell /></ItemMedia>
    <ItemContent>
      <ItemTitle>Notifications</ItemTitle>
      <ItemDescription>Manage how you receive alerts.</ItemDescription>
    </ItemContent>
    <ItemActions><Button variant="outline" size="sm">Configure</Button></ItemActions>
  </Item>
);

export const Playground: Story = {};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-col gap-4">
      <Cell label="default"><Sample variant="default" /></Cell>
      <Cell label="outline"><Sample variant="outline" /></Cell>
      <Cell label="muted"><Sample variant="muted" /></Cell>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-col gap-4">
      {(["default", "sm", "xs"] as const).map((s) => (
        <Cell key={s} label={s}><Sample variant="outline" size={s} /></Cell>
      ))}
    </div>
  ),
};

export const Group: Story = {
  name: "Group (list)",
  parameters: { docs: { description: { story: "`ItemGroup` stacks items as a `role=\"list\"`; `ItemSeparator` divides them." } } },
  render: () => (
    <ItemGroup className="w-96">
      <Sample variant="muted" />
      <ItemSeparator />
      <Sample variant="muted" />
    </ItemGroup>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("item")!.demo}</> };
