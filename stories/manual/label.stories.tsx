import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Label> = {
  title: "Form & Input/Label",
  component: Label,
  parameters: { docs: { description: { component: getEntry("label")?.description } } },
  args: { children: "Your email address" },
  argTypes: { children: { control: "text" } },
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Playground: Story = {};

export const WithControls: Story = {
  name: "With controls",
  parameters: {
    docs: { description: { story: "A label associates with a control via `htmlFor` ↔ `id`, making the text part of the hit target." } },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="grid w-72 gap-2">
        <Label htmlFor="l-email">Email</Label>
        <Input id="l-email" type="email" placeholder="you@example.com" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="l-news" />
        <Label htmlFor="l-news">Subscribe to the newsletter</Label>
      </div>
    </div>
  ),
};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "Default, with a required marker, and disabled — the label dims with its `peer`/`group` disabled control." } },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="grid w-72 gap-2">
        <Label htmlFor="l-1">Display name</Label>
        <Input id="l-1" placeholder="Evil Rabbit" />
      </div>
      <div className="grid w-72 gap-2">
        <Label htmlFor="l-2">
          Display name <span className="text-destructive">*</span>
        </Label>
        <Input id="l-2" required placeholder="Required" />
      </div>
      <div className="grid w-72 gap-2">
        <Label htmlFor="l-3">Username (locked)</Label>
        <Input id="l-3" disabled placeholder="Locked" className="peer" />
      </div>
    </div>
  ),
};

export const Demo: Story = { name: "Demo (with controls)", render: () => <>{getEntry("label")!.demo}</> };
