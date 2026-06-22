import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage,
  BreadcrumbSeparator, BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { getEntry } from "@/components/docs/registry";

type Args = { depth: number; withEllipsis: boolean };

const trail = ["Home", "Components", "Breadcrumb", "Item", "Current"];

const meta: Meta<Args> = {
  title: "Navigation/Breadcrumb",
  parameters: { docs: { description: { component: getEntry("breadcrumb")?.description } } },
  args: { depth: 3, withEllipsis: false },
  argTypes: {
    depth: { control: { type: "range", min: 2, max: 5, step: 1 }, description: "Number of segments" },
    withEllipsis: { control: "boolean", description: "Collapse middle with an ellipsis" },
  },
  render: ({ depth, withEllipsis }) => {
    const items = trail.slice(0, depth);
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((label, i) => {
            const last = i === items.length - 1;
            return (
              <span key={label} className="contents">
                <BreadcrumbItem>
                  {withEllipsis && i === 1 && !last ? (
                    <BreadcrumbEllipsis />
                  ) : last ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href="#">{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!last && <BreadcrumbSeparator />}
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  },
};
export default meta;
type Story = StoryObj<Args>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}

export const Playground: Story = {};

export const Variations: Story = {
  name: "Variations",
  parameters: { docs: { description: { story: "A full trail, and a collapsed trail using `BreadcrumbEllipsis` for deep hierarchies. The last item is the current page (`aria-current`)." } } },
  render: () => (
    <div className="flex flex-col gap-5">
      <Cell label="full trail">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Cell>
      <Cell label="collapsed (ellipsis)">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">Item</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Cell>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("breadcrumb")!.demo}</> };
