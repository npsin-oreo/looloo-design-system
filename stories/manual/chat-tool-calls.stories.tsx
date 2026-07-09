import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatToolCalls, type ChatToolCallItem } from "@/components/ui/chat-tool-calls";
import { getEntry } from "@/components/docs/registry";

const calls: ChatToolCallItem[] = [
  { name: "read_file", target: "Button.tsx", status: "complete", duration: "120ms" },
  { name: "edit_file", target: "Button.tsx", status: "complete", additions: 12, deletions: 3, node: "xds" },
  { name: "run_tests", target: "npm test", status: "running" },
  { name: "search", target: "anchor positioning", status: "error", errorMessage: "Rate limited — retry in 30s" },
];

const meta: Meta<typeof ChatToolCalls> = {
  title: "AI & Chat/Chat Tool Calls",
  component: ChatToolCalls,
  parameters: { docs: { description: { component: getEntry("chat-tool-calls")?.description } } },
  render: () => <ChatToolCalls className="w-full max-w-md" calls={calls} />,
};
export default meta;
type Story = StoryObj<typeof ChatToolCalls>;

export const Playground: Story = {};

export const SingleCall: Story = {
  name: "Single call (inline)",
  render: () => (
    <ChatToolCalls
      className="w-full max-w-md"
      calls={[{ name: "read_file", target: "README.md", status: "complete", duration: "80ms", resultDetail: <pre className="font-mono">42 lines read</pre> }]}
    />
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("chat-tool-calls")!.demo}</> };
