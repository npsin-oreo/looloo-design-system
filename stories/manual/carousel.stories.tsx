import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { getEntry } from "@/components/docs/registry";

type Args = { orientation: "horizontal" | "vertical"; slides: number };

const Slide = ({ n }: { n: number }) => (
  <Card>
    <CardContent className="grid aspect-square place-items-center p-6 text-3xl font-semibold">{n}</CardContent>
  </Card>
);

const meta: Meta<Args> = {
  title: "Display/Carousel",
  parameters: { docs: { description: { component: getEntry("carousel")?.description } } },
  args: { orientation: "horizontal", slides: 5 },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    slides: { control: { type: "number", min: 1, max: 10 } },
  },
  render: ({ orientation, slides }) => (
    <Carousel orientation={orientation} className="w-64">
      <CarouselContent className={orientation === "vertical" ? "h-64" : ""}>
        {Array.from({ length: slides }).map((_, i) => (
          <CarouselItem key={i}><Slide n={i + 1} /></CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Orientations: Story = {
  name: "Orientations",
  parameters: { docs: { description: { story: "Horizontal (default) and vertical. Prev/Next are `Button`s; Embla drives the swipe/drag motion." } } },
  render: () => (
    <div className="flex flex-wrap items-center gap-16">
      <div className="flex flex-col items-center gap-2">
        <Carousel orientation="horizontal" className="w-56">
          <CarouselContent>{[1, 2, 3].map((n) => <CarouselItem key={n}><Slide n={n} /></CarouselItem>)}</CarouselContent>
          <CarouselPrevious /><CarouselNext />
        </Carousel>
        <span className="text-muted-foreground font-mono text-xs">horizontal</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Carousel orientation="vertical" className="w-40">
          <CarouselContent className="h-56">{[1, 2, 3].map((n) => <CarouselItem key={n}><Slide n={n} /></CarouselItem>)}</CarouselContent>
          <CarouselPrevious /><CarouselNext />
        </Carousel>
        <span className="text-muted-foreground font-mono text-xs">vertical</span>
      </div>
    </div>
  ),
};

export const PerView: Story = {
  name: "Multiple per view",
  parameters: { docs: { description: { story: "Set each item's basis (e.g. `basis-1/3`) to show several slides at once." } } },
  render: () => (
    <Carousel className="w-80">
      <CarouselContent>
        {Array.from({ length: 6 }).map((_, i) => (
          <CarouselItem key={i} className="basis-1/3"><Slide n={i + 1} /></CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious /><CarouselNext />
    </Carousel>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("carousel")!.demo}</> };
