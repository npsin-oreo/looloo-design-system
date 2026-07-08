import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { FolderOpen, Search, Inbox } from "@/icons/icon-registry";
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
