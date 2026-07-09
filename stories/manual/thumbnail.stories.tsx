import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Thumbnail } from "@/components/ui/thumbnail";
import { getEntry } from "@/components/docs/registry";

type Args = { ratio: number; fallback: string; src: string };

const meta: Meta<Args> = {
  title: "Display/Thumbnail",
  component: Thumbnail,
  parameters: { docs: { description: { component: getEntry("thumbnail")?.description } } },
  args: { ratio: 1, fallback: "No image", src: "" },
  argTypes: {
    ratio: { control: { type: "number", min: 0.25, max: 4, step: 0.25 } },
    fallback: { control: "text" },
    src: { control: "text", description: "Image URL — falls back when empty or broken" },
  },
  render: ({ ratio, fallback, src }) => (
    <Thumbnail className="w-40" ratio={ratio} fallback={fallback} src={src || undefined} alt="" />
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Demo: Story = { name: "Demo", render: () => <>{getEntry("thumbnail")!.demo}</> };
