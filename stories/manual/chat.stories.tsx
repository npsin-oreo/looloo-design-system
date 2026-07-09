import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Timestamp } from "@/components/ui/timestamp";
import * as React from "react";
import {
  ChatMessageList,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageMetadata,
  ChatSystemMessage,
  ChatComposer,
  ChatDictationButton,
  type ChatDensity,
} from "@/components/ui/chat";
import { getEntry } from "@/components/docs/registry";

type Args = { density: ChatDensity; isStreaming: boolean };

const Ai = () => (
  <Avatar className="size-8">
    <AvatarFallback>AI</AvatarFallback>
  </Avatar>
);

const meta: Meta<Args> = {
  title: "AI & Chat/Chat",
  parameters: { docs: { description: { component: getEntry("chat")?.description } } },
  args: { density: "balanced", isStreaming: false },
  argTypes: {
    density: { control: "select", options: ["compact", "balanced", "spacious"] },
    isStreaming: { control: "boolean", description: "Marks the log aria-busy while an assistant streams" },
  },
  render: ({ density, isStreaming }) => (
    <ChatMessageList
      className="h-96 w-full max-w-md rounded-lg border"
      density={density}
      isStreaming={isStreaming}
    >
      <ChatSystemMessage variant="divider">Today</ChatSystemMessage>
      <ChatMessage sender="assistant" avatar={<Ai />}>
        <ChatMessageBubble name="Assistant">Hi! How can I help you today?</ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="user">
        <ChatMessageBubble
          metadata={<ChatMessageMetadata timestamp={<Timestamp value={Date.now() - 2 * 60 * 1000} />} status="read" />}
        >
          Summarize this thread for me.
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant" avatar={<Ai />}>
        <ChatMessageBubble group="first">Sure — here's a recap.</ChatMessageBubble>
        <ChatMessageBubble group="last" metadata={<ChatMessageMetadata footer="demo model" />}>
          Three key points follow.
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Empty: Story = {
  name: "Empty state",
  render: () => <ChatMessageList className="h-64 w-full max-w-md rounded-lg border" emptyState="No messages yet." />,
};

function ComposerExample() {
  const [value, setValue] = React.useState("");
  const [sent, setSent] = React.useState<string[]>([]);
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      {sent.length > 0 && (
        <ul className="text-sm text-muted-foreground">
          {sent.map((m, i) => (
            <li key={i}>Sent: {m}</li>
          ))}
        </ul>
      )}
      <ChatComposer
        value={value}
        onValueChange={setValue}
        onSubmit={(v) => setSent((s) => [...s, v])}
        sendActions={<ChatDictationButton />}
      />
    </div>
  );
}

export const Composer: Story = {
  name: "Composer",
  parameters: {
    docs: { description: { story: "Auto-growing input, Enter to send (Shift+Enter for newline), circular send button that enables only with text, and an optional dictation button (hidden when the browser lacks SpeechRecognition)." } },
  },
  render: () => <ComposerExample />,
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("chat")!.demo}</> };
