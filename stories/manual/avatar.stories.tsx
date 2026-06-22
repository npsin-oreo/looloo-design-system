import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge } from "@/components/ui/avatar";
import { getEntry } from "@/components/docs/registry";

type AvatarArgs = { src: string; fallback: string };

const SRC = "https://github.com/shadcn.png";

const meta: Meta<AvatarArgs> = {
  title: "Display/Avatar",
  parameters: { docs: { description: { component: getEntry("avatar")?.description } } },
  args: { src: SRC, fallback: "CN" },
  argTypes: {
    src: { control: "text", description: "Image URL (empty → fallback)" },
    fallback: { control: "text", description: "Shown when the image fails to load" },
  },
  render: ({ src, fallback }) => (
    <Avatar>
      <AvatarImage src={src} alt={fallback} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  ),
};
export default meta;
type Story = StoryObj<AvatarArgs>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Playground: Story = {};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      {(["sm", "default", "lg"] as const).map((s) => (
        <Cell key={s} label={s}>
          <Avatar size={s}>
            <AvatarImage src={SRC} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Cell>
      ))}
    </div>
  ),
};

export const Fallback: Story = {
  name: "Fallback",
  parameters: { docs: { description: { story: "When the image is missing or fails to load, the fallback (initials) shows on the muted surface." } } },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Cell label="image">
        <Avatar><AvatarImage src={SRC} alt="@shadcn" /><AvatarFallback>CN</AvatarFallback></Avatar>
      </Cell>
      <Cell label="initials">
        <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
      </Cell>
      <Cell label="broken src → fallback">
        <Avatar><AvatarImage src="/does-not-exist.png" alt="Broken" /><AvatarFallback>JD</AvatarFallback></Avatar>
      </Cell>
    </div>
  ),
};

export const WithBadge: Story = {
  name: "With status badge",
  render: () => (
    <Avatar>
      <AvatarImage src={SRC} alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge className="bg-green-500" aria-label="Online" />
    </Avatar>
  ),
};

export const Group: Story = {
  name: "Group (overlap + count)",
  render: () => (
    <AvatarGroup>
      {["CN", "AB", "JD"].map((f) => (
        <Avatar key={f}><AvatarFallback>{f}</AvatarFallback></Avatar>
      ))}
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
  ),
};

export const Demo: Story = { name: "Demo (image · fallback · group)", render: () => <>{getEntry("avatar")!.demo}</> };
