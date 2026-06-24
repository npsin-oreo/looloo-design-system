import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Terminal, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const meta: Meta<typeof Alert> = {
  title: "Display/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: { variant: "default" },
  argTypes: { variant: { control: "inline-radio", options: ["default", "destructive"] } },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="w-96">
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args} className="w-96">
      <AlertCircle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  ),
};
