import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeBlock } from "@/components/ui/code-block";
import { getEntry } from "@/components/docs/registry";

type Args = { lang: string; code: string; hideHeader: boolean };

const sample = `function greet(name: string) {
  return "Hello, " + name;
}`;

const meta: Meta<Args> = {
  title: "AI & Chat/Code Block",
  component: CodeBlock,
  parameters: { docs: { description: { component: getEntry("code-block")?.description } } },
  args: { lang: "tsx", code: sample, hideHeader: false },
  argTypes: {
    lang: { control: "text", description: "Shiki language id" },
    code: { control: "text" },
    hideHeader: { control: "boolean" },
  },
  render: (args) => <CodeBlock className="w-full max-w-lg" {...args} />,
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Demo: Story = { name: "Demo", render: () => <>{getEntry("code-block")!.demo}</> };
