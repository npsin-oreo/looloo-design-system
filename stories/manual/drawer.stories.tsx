import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { getEntry } from "@/components/docs/registry";

type Args = { direction: "top" | "bottom" | "left" | "right"; defaultOpen: boolean };

const meta: Meta<Args> = {
  title: "Overlay/Drawer",
  parameters: { docs: { description: { component: getEntry("drawer")?.description } } },
  args: { direction: "bottom", defaultOpen: false },
  argTypes: {
    direction: { control: "inline-radio", options: ["top", "bottom", "left", "right"] },
    defaultOpen: { control: "boolean", description: "Open on mount" },
  },
  render: ({ direction, defaultOpen }) => (
    <Drawer direction={direction} defaultOpen={defaultOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Open: Story = {
  name: "Open (bottom)",
  parameters: { docs: { description: { story: "A Drawer open from the bottom edge with a drag handle — the touch-friendly counterpart to a Dialog/Sheet." } } },
  render: () => (
    <Drawer defaultOpen>
      <DrawerTrigger asChild>
        <Button variant="outline">Move goal</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("drawer")!.demo}</> };
