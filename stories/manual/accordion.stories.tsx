import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getEntry } from "@/components/docs/registry";

type Args = { type: "single" | "multiple"; collapsible: boolean };

const items = ["Product Information", "Shipping Details", "Return Policy"];

const meta: Meta<Args> = {
  title: "Data/Accordion",
  parameters: { docs: { description: { component: getEntry("accordion")?.description } } },
  args: { type: "single", collapsible: true },
  argTypes: {
    type: { control: "inline-radio", options: ["single", "multiple"] },
    collapsible: { control: "boolean", description: "single only — allow closing the open item" },
  },
  render: ({ type, collapsible }) => {
    const body = items.map((t) => (
      <AccordionItem key={t} value={t}>
        <AccordionTrigger>{t}</AccordionTrigger>
        <AccordionContent>Content for {t}.</AccordionContent>
      </AccordionItem>
    ));
    return type === "multiple" ? (
      <Accordion type="multiple" className="w-96">{body}</Accordion>
    ) : (
      <Accordion type="single" collapsible={collapsible} className="w-96">{body}</Accordion>
    );
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Types: Story = {
  name: "Single vs multiple",
  parameters: { docs: { description: { story: "`single` keeps one item open (with `collapsible` to allow none); `multiple` lets several stay open at once." } } },
  render: () => (
    <div className="flex flex-wrap items-start gap-10">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground font-mono text-xs">single (collapsible)</span>
        <Accordion type="single" collapsible defaultValue="Shipping Details" className="w-80">
          {items.map((t) => (
            <AccordionItem key={t} value={t}>
              <AccordionTrigger>{t}</AccordionTrigger>
              <AccordionContent>Content for {t}.</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground font-mono text-xs">multiple</span>
        <Accordion type="multiple" defaultValue={items} className="w-80">
          {items.map((t) => (
            <AccordionItem key={t} value={t}>
              <AccordionTrigger>{t}</AccordionTrigger>
              <AccordionContent>Content for {t}.</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  ),
};

export const DisabledItem: Story = {
  name: "Disabled item",
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="a"><AccordionTrigger>Available</AccordionTrigger><AccordionContent>This section is open to all.</AccordionContent></AccordionItem>
      <AccordionItem value="b"><AccordionTrigger disabled>Locked (disabled)</AccordionTrigger><AccordionContent>Hidden.</AccordionContent></AccordionItem>
      <AccordionItem value="c"><AccordionTrigger>Also available</AccordionTrigger><AccordionContent>Another open section.</AccordionContent></AccordionItem>
    </Accordion>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("accordion")!.demo}</> };
