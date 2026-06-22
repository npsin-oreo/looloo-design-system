import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getEntry } from "@/components/docs/registry";

type Args = { defaultValue: "account" | "password" };

const meta: Meta<Args> = {
  title: "Navigation/Tabs",
  parameters: { docs: { description: { component: getEntry("tabs")?.description } } },
  args: { defaultValue: "account" },
  argTypes: {
    defaultValue: { control: "inline-radio", options: ["account", "password"], description: "Initially active tab" },
  },
  render: ({ defaultValue }) => (
    <Tabs defaultValue={defaultValue} className="w-96">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="pt-2 text-sm text-muted-foreground">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password" className="pt-2 text-sm text-muted-foreground">
        Change your password here.
      </TabsContent>
    </Tabs>
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

const Body = () => (
  <>
    <TabsContent value="a" className="pt-2 text-sm text-muted-foreground">Panel A</TabsContent>
    <TabsContent value="b" className="pt-2 text-sm text-muted-foreground">Panel B</TabsContent>
    <TabsContent value="c" className="pt-2 text-sm text-muted-foreground">Panel C</TabsContent>
  </>
);

export const Playground: Story = {};

export const Variants: Story = {
  name: "Variants",
  parameters: { docs: { description: { story: "`default` is a filled segmented control; `line` is an underline indicator on a transparent track." } } },
  render: () => (
    <div className="flex flex-col gap-6">
      <Cell label="default">
        <Tabs defaultValue="a" className="w-96">
          <TabsList>
            <TabsTrigger value="a">Account</TabsTrigger>
            <TabsTrigger value="b">Password</TabsTrigger>
            <TabsTrigger value="c">Team</TabsTrigger>
          </TabsList>
          <Body />
        </Tabs>
      </Cell>
      <Cell label="line">
        <Tabs defaultValue="a" className="w-96">
          <TabsList variant="line">
            <TabsTrigger value="a">Account</TabsTrigger>
            <TabsTrigger value="b">Password</TabsTrigger>
            <TabsTrigger value="c">Team</TabsTrigger>
          </TabsList>
          <Body />
        </Tabs>
      </Cell>
    </div>
  ),
};

export const States: Story = {
  name: "Trigger states",
  parameters: { docs: { description: { story: "Active vs inactive triggers, plus a disabled one." } } },
  render: () => (
    <Tabs defaultValue="a" className="w-96">
      <TabsList>
        <TabsTrigger value="a">Active</TabsTrigger>
        <TabsTrigger value="b">Inactive</TabsTrigger>
        <TabsTrigger value="c" disabled>Disabled</TabsTrigger>
      </TabsList>
      <Body />
    </Tabs>
  ),
};

export const Vertical: Story = {
  name: "Vertical",
  render: () => (
    <Tabs defaultValue="a" orientation="vertical" className="w-[28rem]">
      <TabsList>
        <TabsTrigger value="a">General</TabsTrigger>
        <TabsTrigger value="b">Members</TabsTrigger>
        <TabsTrigger value="c">Billing</TabsTrigger>
      </TabsList>
      <Body />
    </Tabs>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("tabs")!.demo}</> };
