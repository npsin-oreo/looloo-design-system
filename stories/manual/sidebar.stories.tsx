import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Inbox, Settings } from "lucide-react";
import { getEntry } from "@/components/docs/registry";

type Args = {
  side: "left" | "right";
  variant: "sidebar" | "floating" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
};

const links = [
  { title: "Home", icon: Home },
  { title: "Inbox", icon: Inbox },
  { title: "Settings", icon: Settings },
];

const meta: Meta<Args> = {
  title: "Navigation/Sidebar",
  parameters: { docs: { description: { component: getEntry("sidebar")?.description } } },
  args: { side: "left", variant: "sidebar", collapsible: "icon" },
  argTypes: {
    side: { control: "inline-radio", options: ["left", "right"] },
    variant: { control: "inline-radio", options: ["sidebar", "floating", "inset"] },
    collapsible: { control: "inline-radio", options: ["offcanvas", "icon", "none"] },
  },
  render: ({ side, variant, collapsible }) => (
    <div className="h-96 w-[40rem] overflow-hidden rounded-lg border">
      <SidebarProvider className="min-h-full">
        <Sidebar side={side} variant={variant} collapsible={collapsible}>
          <SidebarHeader className="px-4 py-3 text-sm font-semibold">Acme Inc</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map(({ title, icon: Icon }) => (
                    <SidebarMenuItem key={title}>
                      <SidebarMenuButton>
                        <Icon />
                        <span>{title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="p-4">
          <SidebarTrigger />
          <p className="mt-4 text-sm text-muted-foreground">Main content</p>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Floating: Story = {
  name: "Floating variant",
  parameters: {
    docs: { description: { story: "The `floating` variant detaches the sidebar into a rounded, ringed panel. All surfaces use the dedicated `--sidebar-*` tokens." } },
  },
  render: () => (
    <div className="h-96 w-[40rem] overflow-hidden rounded-lg border bg-sidebar/30">
      <SidebarProvider className="min-h-full">
        <Sidebar variant="floating" collapsible="icon">
          <SidebarHeader className="px-4 py-3 text-sm font-semibold">Acme Inc</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map(({ title, icon: Icon }) => (
                    <SidebarMenuItem key={title}>
                      <SidebarMenuButton isActive={title === "Home"}>
                        <Icon />
                        <span>{title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="p-4">
          <SidebarTrigger />
          <p className="mt-4 text-sm text-muted-foreground">Main content</p>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("sidebar")!.demo}</> };
