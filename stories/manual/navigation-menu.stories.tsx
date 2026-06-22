import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { getEntry } from "@/components/docs/registry";

type Args = { viewport: boolean; linkCount: number };

const links = ["Introduction", "Installation", "Typography", "Theming", "Components"];

const meta: Meta<Args> = {
  title: "Navigation/Navigation Menu",
  parameters: { docs: { description: { component: getEntry("navigation-menu")?.description } } },
  args: { viewport: true, linkCount: 2 },
  argTypes: {
    viewport: { control: "boolean", description: "Render content in the shared animated viewport" },
    linkCount: { control: { type: "range", min: 1, max: 5, step: 1 }, description: "Number of links in the panel" },
  },
  render: ({ viewport, linkCount }) => (
    <NavigationMenu viewport={viewport}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[220px] gap-1 p-2">
              {links.slice(0, linkCount).map((l) => (
                <li key={l}><NavigationMenuLink>{l}</NavigationMenuLink></li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Inline: Story = {
  name: "Inline (no viewport)",
  parameters: {
    docs: { description: { story: "`viewport={false}` renders each panel beneath its own trigger (a popover surface on `--navigation-menu-content-bg`) instead of in the shared animated viewport." } },
  },
  render: () => (
    <div className="h-64">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[220px] gap-1 p-2">
                {links.map((l) => (
                  <li key={l}><NavigationMenuLink>{l}</NavigationMenuLink></li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="px-2.5 py-1.5 text-sm font-medium">Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("navigation-menu")!.demo}</> };
