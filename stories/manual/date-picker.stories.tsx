import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DatePicker } from "@/components/ui/date-picker";
import { getEntry } from "@/components/docs/registry";

type Args = { placeholder: string; disabled: boolean };

const meta: Meta<Args> = {
  title: "Utility/Date Picker",
  component: DatePicker,
  parameters: { docs: { description: { component: getEntry("date-picker")?.description } } },
  args: { placeholder: "Pick a date", disabled: false },
  argTypes: {
    placeholder: { control: "text", description: "Trigger label before a date is chosen" },
    disabled: { control: "boolean" },
  },
  render: (args) => <DatePicker {...args} />,
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Demo: Story = { name: "Demo", render: () => <>{getEntry("date-picker")!.demo}</> };
