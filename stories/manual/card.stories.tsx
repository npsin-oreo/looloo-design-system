import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getEntry } from "@/components/docs/registry";

type Args = { title: string; description: string; content: string; footer: boolean };

const meta: Meta<Args> = {
  title: "Display/Card",
  parameters: { docs: { description: { component: getEntry("card")?.description } } },
  args: {
    title: "Create project",
    description: "Deploy your new project in one click.",
    content: "Card content goes here.",
    footer: true,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    content: { control: "text" },
    footer: { control: "boolean" },
  },
  render: ({ title, description, content, footer }) => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{content}</CardContent>
      {footer && (
        <CardFooter className="justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      )}
    </Card>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Anatomy: Story = {
  name: "Anatomy (all slots)",
  parameters: {
    docs: { description: { story: "Every slot at once — header (title + description + action), content, and footer. `CardAction` self-positions to the header's top-right via grid." } },
  },
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>Billed monthly. Cancel anytime.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Popular</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel htmlFor="card-seats">Seats</FieldLabel>
          <Input id="card-seats" type="number" defaultValue={5} />
        </Field>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost">Learn more</Button>
        <Button>Upgrade</Button>
      </CardFooter>
    </Card>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  parameters: { docs: { description: { story: "`size=\"sm\"` tightens gaps and padding for dense layouts." } } },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["default", "sm"] as const).map((s) => (
        <Card key={s} size={s} className="w-72">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>size = {s}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You have 3 unread messages.
          </CardContent>
          <CardFooter>
            <Button size="sm" className="w-full">Mark all as read</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};

export const ContentOnly: Story = {
  name: "Content only",
  parameters: { docs: { description: { story: "Header and footer are optional — a card can be a bare padded surface." } } },
  render: () => (
    <Card className="w-72">
      <CardContent className="py-2 text-sm">
        A minimal card — just a surface with the hairline ring and rounded corners.
      </CardContent>
    </Card>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("card")!.demo}</> };
