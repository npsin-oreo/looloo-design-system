import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CircleCheck, TriangleAlert, Info } from "@/icons/icon-registry";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
  parameters: { docs: { description: { component: getEntry("alert")?.description } } },
  args: { variant: "default" },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "destructive"] },
  },
  render: (args) => (
    <Alert className="w-96" {...args}>
      <CircleCheck />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>This is an alert with an icon, title and description.</AlertDescription>
    </Alert>
  ),
};
export default meta;
type Story = StoryObj<typeof Alert>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-96 flex-col gap-1.5">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}

export const Playground: Story = {};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex flex-col gap-4">
      <Cell label="default">
        <Alert><Info /><AlertTitle>Heads up!</AlertTitle><AlertDescription>You can add components to your app using the CLI.</AlertDescription></Alert>
      </Cell>
      <Cell label="destructive">
        <Alert variant="destructive"><TriangleAlert /><AlertTitle>Something went wrong</AlertTitle><AlertDescription>Your session has expired. Please log in again.</AlertDescription></Alert>
      </Cell>
    </div>
  ),
};

export const Compositions: Story = {
  name: "Compositions",
  parameters: { docs: { description: { story: "Title only, with an icon, and with a trailing `AlertAction`." } } },
  render: () => (
    <div className="flex flex-col gap-4">
      <Cell label="title only">
        <Alert><AlertTitle>Your trial ends in 3 days.</AlertTitle></Alert>
      </Cell>
      <Cell label="with action">
        <Alert>
          <CircleCheck />
          <AlertTitle>Update available</AlertTitle>
          <AlertDescription>A new version is ready to install.</AlertDescription>
          <AlertAction><Button size="xs" variant="outline">Update</Button></AlertAction>
        </Alert>
      </Cell>
    </div>
  ),
};

export const Demo: Story = { name: "Demo (variants)", render: () => <>{getEntry("alert")!.demo}</> };
