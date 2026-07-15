import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { FolderOpen, Search, Inbox, CircleCheck, OctagonX, TriangleAlert } from "@/icons/icon-registry";
import { getEntry } from "@/components/docs/registry";

type Args = { title: string; description: string; withAction: boolean };

const meta: Meta<Args> = {
  title: "Display/Empty",
  parameters: { docs: { description: { component: getEntry("empty")?.description } } },
  args: {
    title: "No Projects Yet",
    description: "You haven't created any projects. Get started by creating your first project.",
    withAction: true,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    withAction: { control: "boolean" },
  },
  render: ({ title, description, withAction }) => (
    <Empty className="w-96 rounded-lg border">
      <EmptyHeader>
        <EmptyMedia variant="icon"><FolderOpen /></EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {withAction && (
        <EmptyContent>
          <Button>Create Project</Button>
        </EmptyContent>
      )}
    </Empty>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const MediaVariants: Story = {
  name: "Media variants",
  parameters: { docs: { description: { story: "`EmptyMedia` is `icon` (tinted tile on `--empty-icon-bg`) or `default` (bare glyph)." } } },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Empty className="w-72 rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Search /></EmptyMedia>
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription>Try a different search term.</EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Empty className="w-72 rounded-lg border">
        <EmptyHeader>
          <EmptyMedia><Inbox className="size-8 text-muted-foreground" /></EmptyMedia>
          <EmptyTitle>Inbox zero</EmptyTitle>
          <EmptyDescription>You are all caught up.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
};

export const Tones: Story = {
  name: "Tones (why it is empty)",
  parameters: {
    docs: {
      description: {
        story:
          "`tone` on `EmptyMedia` answers WHY it is empty, which is not the same as what it looks like: neutral (nothing yet — offer a way to fill it), success (the user finished — do NOT), destructive (it failed to load — offer a retry, never a create), warning (they are not allowed — offer neither).",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Empty className="rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon" tone="neutral"><Search /></EmptyMedia>
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription>neutral — nothing matched. Offer a way to fill it.</EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Empty className="rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon" tone="success"><CircleCheck /></EmptyMedia>
          <EmptyTitle>Inbox zero</EmptyTitle>
          <EmptyDescription>success — the user finished. Do not offer a create.</EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Empty className="rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon" tone="destructive"><OctagonX /></EmptyMedia>
          <EmptyTitle>Couldn’t load</EmptyTitle>
          <EmptyDescription>destructive — it failed. Offer a retry, never a create.</EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Empty className="rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon" tone="warning"><TriangleAlert /></EmptyMedia>
          <EmptyTitle>No access</EmptyTitle>
          <EmptyDescription>warning — not allowed to see it. Offer neither.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
};

export const WithActions: Story = {
  name: "With actions",
  render: () => (
    <Empty className="w-96 rounded-lg border">
      <EmptyHeader>
        <EmptyMedia variant="icon"><FolderOpen /></EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Create your first project to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Create project</Button>
          <Button variant="outline">Import</Button>
        </div>
      </EmptyContent>
    </Empty>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("empty")!.demo}</> };
