import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
  ContextMenuSeparator, ContextMenuShortcut, ContextMenuCheckboxItem,
} from "@/components/ui/context-menu";
import { getEntry } from "@/components/docs/registry";

type Args = { label: string; showShortcuts: boolean; showCheckbox: boolean; disableReload: boolean };

const meta: Meta<Args> = {
  title: "Overlay/Context Menu",
  parameters: { docs: { description: { component: getEntry("context-menu")?.description } } },
  args: { label: "Right click here", showShortcuts: false, showCheckbox: false, disableReload: false },
  argTypes: {
    label: { control: "text", description: "Trigger area text" },
    showShortcuts: { control: "boolean" },
    showCheckbox: { control: "boolean", description: "Add a checkbox item" },
    disableReload: { control: "boolean", description: "Disable the Reload item" },
  },
  render: ({ label, showShortcuts, showCheckbox, disableReload }) => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-28 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm">
        {label}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Back {showShortcuts && <ContextMenuShortcut>⌘[</ContextMenuShortcut>}</ContextMenuItem>
        <ContextMenuItem>Forward {showShortcuts && <ContextMenuShortcut>⌘]</ContextMenuShortcut>}</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled={disableReload}>Reload {showShortcuts && <ContextMenuShortcut>⌘R</ContextMenuShortcut>}</ContextMenuItem>
        {showCheckbox && (
          <>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked>Show Bookmarks Bar</ContextMenuCheckboxItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Demo: Story = { name: "Demo", render: () => <>{getEntry("context-menu")!.demo}</> };
