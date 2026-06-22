import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FieldGroup, Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getEntry } from "@/components/docs/registry";

type Args = { label: string; description: string; placeholder: string };

const meta: Meta<Args> = {
  title: "Form & Input/Field",
  parameters: { docs: { description: { component: getEntry("field")?.description } } },
  args: { label: "Name", description: "This is your public display name.", placeholder: "Evil Rabbit" },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    placeholder: { control: "text" },
  },
  render: ({ label, description, placeholder }) => (
    <FieldGroup className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="play-field">{label}</FieldLabel>
        <Input id="play-field" placeholder={placeholder} />
        <FieldDescription>{description}</FieldDescription>
      </Field>
    </FieldGroup>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "Default (label + description), error (FieldError + `aria-invalid` input, described by the message), and disabled." } },
  },
  render: () => (
    <FieldGroup className="w-full max-w-sm gap-6">
      <Field>
        <FieldLabel htmlFor="s-default">Name</FieldLabel>
        <Input id="s-default" placeholder="Evil Rabbit" />
        <FieldDescription>This is your public display name.</FieldDescription>
      </Field>

      <Field data-invalid>
        <FieldLabel htmlFor="s-error">Email</FieldLabel>
        <Input id="s-error" defaultValue="not-an-email" aria-invalid aria-describedby="s-error-msg" />
        <FieldError id="s-error-msg">Enter a valid email address.</FieldError>
      </Field>

      <Field data-disabled>
        <FieldLabel htmlFor="s-disabled">Username</FieldLabel>
        <Input id="s-disabled" placeholder="Locked" disabled />
        <FieldDescription>This field is locked for now.</FieldDescription>
      </Field>
    </FieldGroup>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("field")!.demo}</> };
