import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { getEntry } from "@/components/docs/registry";

type Args = { maxLength: number; withSeparator: boolean; disabled: boolean };

type Otp6Props = {
  withSeparator?: boolean;
  value?: string;
  readOnly?: boolean;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  "aria-label"?: string;
};

function Otp6({ withSeparator = true, ...props }: Otp6Props) {
  return (
    <InputOTP maxLength={6} {...props}>
      {withSeparator ? (
        <>
          <InputOTPGroup>{[0, 1, 2].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>{[3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
        </>
      ) : (
        <InputOTPGroup>{[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
      )}
    </InputOTP>
  );
}

const meta: Meta<Args> = {
  title: "Form & Input/Input OTP",
  parameters: { docs: { description: { component: getEntry("input-otp")?.description } } },
  args: { maxLength: 6, withSeparator: true, disabled: false },
  argTypes: {
    maxLength: { control: { type: "number", min: 2, max: 8 } },
    withSeparator: { control: "boolean", description: "Split into two groups with a separator" },
    disabled: { control: "boolean" },
  },
  render: ({ maxLength, withSeparator, disabled }) => {
    const half = Math.ceil(maxLength / 2);
    const slot = (i: number) => <InputOTPSlot key={i} index={i} />;
    return (
      <InputOTP maxLength={maxLength} disabled={disabled}>
        {withSeparator ? (
          <>
            <InputOTPGroup>{Array.from({ length: half }, (_, i) => slot(i))}</InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>{Array.from({ length: maxLength - half }, (_, i) => slot(half + i))}</InputOTPGroup>
          </>
        ) : (
          <InputOTPGroup>{Array.from({ length: maxLength }, (_, i) => slot(i))}</InputOTPGroup>
        )}
      </InputOTP>
    );
  },
};
export default meta;
type Story = StoryObj<Args>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

export const Playground: Story = {};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "Empty, partially filled, disabled, and error (`aria-invalid` bubbles to the group border via `has-aria-invalid`). The active slot shows a blinking caret." } },
  },
  render: () => (
    <div className="flex flex-col gap-5">
      <Cell label="empty"><Otp6 aria-label="empty" /></Cell>
      <Cell label="filled"><Otp6 value="123" readOnly aria-label="filled" /></Cell>
      <Cell label="continuous (no separator)"><Otp6 withSeparator={false} value="1234" readOnly aria-label="continuous" /></Cell>
      <Cell label="disabled"><Otp6 disabled aria-label="disabled" /></Cell>
      <Cell label="error"><Otp6 value="99" readOnly aria-invalid aria-label="error" /></Cell>
    </div>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("input-otp")!.demo}</> };
