import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Citation } from "@/components/ui/citation";
import { getEntry } from "@/components/docs/registry";

type Args = { title: string; url: string; number: number; variant: "label" | "number" };

const meta: Meta<Args> = {
  title: "AI & Chat/Citation",
  parameters: { docs: { description: { component: getEntry("citation")?.description } } },
  args: { title: "MDN Web Docs", url: "https://developer.mozilla.org", number: 1, variant: "label" },
  argTypes: {
    title: { control: "text" },
    url: { control: "text", description: "Empty renders a non-link citation" },
    number: { control: { type: "number", min: 1, max: 99 } },
    variant: { control: "inline-radio", options: ["label", "number"] },
  },
  render: ({ title, url, number, variant }) => (
    <Citation variant={variant} number={number} source={{ title, url: url || undefined }} />
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const InlineMarkers: Story = {
  name: "Inline markers",
  render: () => (
    <p className="max-w-md text-sm leading-relaxed">
      Anchor positioning ships in modern browsers
      <Citation variant="number" number={1} source={{ title: "MDN", url: "https://developer.mozilla.org" }} />
      and is progressively enhanced
      <Citation variant="number" number={2} source={{ title: "web.dev" }} />.
    </p>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("citation")!.demo}</> };
