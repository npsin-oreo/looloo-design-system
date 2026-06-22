import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getEntry } from "@/components/docs/registry";

type Args = { color: "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5"; showGrid: boolean; showTooltip: boolean; radius: number };

const chartData = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 273 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 314 },
];

const meta: Meta<Args> = {
  title: "Display/Chart",
  parameters: { docs: { description: { component: getEntry("chart")?.description } } },
  args: { color: "chart-1", showGrid: true, showTooltip: true, radius: 4 },
  argTypes: {
    color: { control: "inline-radio", options: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"], description: "Chart token color" },
    showGrid: { control: "boolean" },
    showTooltip: { control: "boolean" },
    radius: { control: { type: "range", min: 0, max: 16, step: 1 }, description: "Bar corner radius" },
  },
  render: ({ color, showGrid, showTooltip, radius }) => {
    const config = { desktop: { label: "Desktop", color: `var(--color-${color})` } } satisfies ChartConfig;
    return (
      <ChartContainer config={config} className="h-[250px] w-full max-w-md">
        <BarChart accessibilityLayer data={chartData}>
          {showGrid && <CartesianGrid vertical={false} />}
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={radius} />
        </BarChart>
      </ChartContainer>
    );
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Palette: Story = {
  name: "Chart palette (multi-series)",
  parameters: { docs: { description: { story: "Series colors come from the `--chart-1…5` tokens (referenced as `var(--color-<series>)` through the chart config), so charts re-theme with the rest of the system." } } },
  render: () => {
    const config = {
      desktop: { label: "Desktop", color: "var(--color-chart-1)" },
      mobile: { label: "Mobile", color: "var(--color-chart-2)" },
      tablet: { label: "Tablet", color: "var(--color-chart-3)" },
    } satisfies ChartConfig;
    const data = [
      { month: "Jan", desktop: 186, mobile: 120, tablet: 60 },
      { month: "Feb", desktop: 305, mobile: 210, tablet: 90 },
      { month: "Mar", desktop: 237, mobile: 160, tablet: 70 },
      { month: "Apr", desktop: 273, mobile: 190, tablet: 110 },
      { month: "May", desktop: 209, mobile: 150, tablet: 80 },
    ];
    return (
      <ChartContainer config={config} className="h-[250px] w-full max-w-md">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          <Bar dataKey="tablet" fill="var(--color-tablet)" radius={4} />
        </BarChart>
      </ChartContainer>
    );
  },
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("chart")!.demo}</> };
