import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getEntry } from "@/components/docs/registry";

type Args = { side: "top" | "right" | "bottom" | "left"; align: "start" | "center" | "end" };

const meta: Meta<Args> = {
  title: "Overlay/Popover",
  parameters: { docs: { description: { component: getEntry("popover")?.description } } },
  args: { side: "bottom", align: "center" },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
  },
  render: ({ side, align }) => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent side={side} align={align} className="w-72">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const WithForm: Story = {
  name: "Rich content (form)",
  parameters: { docs: { description: { story: "A Popover holds arbitrary interactive content — here a small settings form. Unlike a Tooltip, it can receive focus and hold controls." } } },
  render: () => (
    <div className="h-72">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">Dimensions</Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
          </PopoverHeader>
          <div className="mt-3 grid gap-3">
            <Field><FieldLabel htmlFor="pop-w">Width</FieldLabel><Input id="pop-w" defaultValue="100%" /></Field>
            <Field><FieldLabel htmlFor="pop-h">Height</FieldLabel><Input id="pop-h" defaultValue="25px" /></Field>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("popover")!.demo}</> };
