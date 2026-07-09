import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Markdown } from "@/components/ui/markdown";
import { getEntry } from "@/components/docs/registry";

const sample = [
  "## Markdown",
  "",
  "Renders **bold**, _italic_, `inline code`, and [links](https://example.com).",
  "",
  "- first item",
  "- second item",
  "",
  "~~~ts",
  "const answer: number = 42;",
  "~~~",
  "",
  "> A blockquote for emphasis.",
  "",
  "| Feature | Backed by |",
  "| --- | --- |",
  "| Tables | remark-gfm |",
  "| Code | Shiki |",
].join("\n");

type Args = { content: string };

const meta: Meta<Args> = {
  title: "AI & Chat/Markdown",
  parameters: { docs: { description: { component: getEntry("markdown")?.description } } },
  args: { content: sample },
  argTypes: { content: { control: "text", description: "Markdown source" } },
  render: ({ content }) => <Markdown className="w-full max-w-lg">{content}</Markdown>,
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Demo: Story = { name: "Demo", render: () => <>{getEntry("markdown")!.demo}</> };
