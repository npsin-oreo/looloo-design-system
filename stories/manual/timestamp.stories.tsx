import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Timestamp, type TimestampFormat } from "@/components/ui/timestamp";
import { getEntry } from "@/components/docs/registry";

type Args = { format: TimestampFormat; live: boolean };

const meta: Meta<Args> = {
  title: "Display/Timestamp",
  parameters: { docs: { description: { component: getEntry("timestamp")?.description } } },
  args: { format: "relative", live: false },
  argTypes: {
    format: { control: "select", options: ["relative", "auto", "date", "datetime", "time"] },
    live: { control: "boolean", description: "Tick relative labels every 30s" },
  },
  render: ({ format, live }) => (
    <Timestamp value={Date.now() - 2 * 60 * 60 * 1000} format={format} live={live} />
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Demo: Story = { name: "Demo", render: () => <>{getEntry("timestamp")!.demo}</> };
