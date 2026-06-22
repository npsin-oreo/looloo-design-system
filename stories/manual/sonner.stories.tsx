import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getEntry } from "@/components/docs/registry";

type Args = { message: string; description: string; withAction: boolean };

const meta: Meta<Args> = {
  title: "Feedback/Sonner",
  parameters: { docs: { description: { component: getEntry("sonner")?.description } } },
  args: {
    message: "Event has been created",
    description: "Sunday, December 03, 2023 at 9:00 AM",
    withAction: true,
  },
  argTypes: {
    message: { control: "text" },
    description: { control: "text" },
    withAction: { control: "boolean", description: "Include an Undo action" },
  },
  render: ({ message, description, withAction }) => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast(message, {
            description,
            action: withAction ? { label: "Undo", onClick: () => {} } : undefined,
          })
        }
      >
        Show toast
      </Button>
    </>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Types: Story = {
  name: "Toast types",
  parameters: { docs: { description: { story: "Sonner's variants — default, success, error, and a toast with an action. Click to trigger (toasts render in the portal)." } } },
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast("Event has been created")}>Default</Button>
        <Button variant="outline" onClick={() => toast.success("Saved", { description: "Your changes are live." })}>Success</Button>
        <Button variant="outline" onClick={() => toast.error("Failed", { description: "Could not reach the server." })}>Error</Button>
        <Button variant="outline" onClick={() => toast("Deleted", { action: { label: "Undo", onClick: () => {} } })}>With action</Button>
      </div>
    </>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("sonner")!.demo}</> };
