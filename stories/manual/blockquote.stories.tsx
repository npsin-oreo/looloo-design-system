import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Blockquote, BlockquoteCite } from "@/components/ui/blockquote";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Blockquote> = {
  title: "Display/Blockquote",
  component: Blockquote,
  parameters: { docs: { description: { component: getEntry("blockquote")?.description } } },
  render: () => (
    <Blockquote className="max-w-md">
      <p>“The details are not the details. They make the design.”</p>
      <BlockquoteCite>— Charles Eames</BlockquoteCite>
    </Blockquote>
  ),
};
export default meta;
type Story = StoryObj<typeof Blockquote>;

export const Playground: Story = {};
export const Demo: Story = { name: "Demo", render: () => <>{getEntry("blockquote")!.demo}</> };
