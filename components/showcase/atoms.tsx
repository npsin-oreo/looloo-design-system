"use client"

import { Bold, Italic, Underline, Plus } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import type { Tier } from "./types"

export const atoms: Tier = {
  id: "atoms",
  label: "Atoms",
  blurb:
    "The smallest building blocks — single-purpose primitives that can't be broken down further.",
  demos: [
    {
      id: "button",
      title: "Button",
      description: "Variants and sizes.",
      node: (
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <Plus />
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      ),
    },
    {
      id: "badge",
      title: "Badge",
      description: "Small status / count label.",
      node: (
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      ),
    },
    {
      id: "input",
      title: "Input",
      description: "Single-line text field.",
      node: (
        <div className="flex max-w-sm flex-col gap-3">
          <Input placeholder="you@example.com" />
          <Input placeholder="Disabled" disabled />
        </div>
      ),
    },
    {
      id: "textarea",
      title: "Textarea",
      description: "Multi-line text field.",
      node: <Textarea className="max-w-sm" placeholder="Type your message…" />,
    },
    {
      id: "label",
      title: "Label",
      description: "Accessible caption for a control.",
      node: (
        <div className="flex max-w-sm items-center gap-2">
          <Checkbox id="label-demo" defaultChecked />
          <Label htmlFor="label-demo">Subscribe to updates</Label>
        </div>
      ),
    },
    {
      id: "checkbox",
      title: "Checkbox",
      description: "Binary on/off selection.",
      node: (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="cb-a" defaultChecked />
            <Label htmlFor="cb-a">Checked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-b" />
            <Label htmlFor="cb-b">Unchecked</Label>
          </div>
        </div>
      ),
    },
    {
      id: "radio-group",
      title: "Radio Group",
      description: "One choice from a small set.",
      node: (
        <RadioGroup defaultValue="comfortable" className="gap-3">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="default" id="r-1" />
            <Label htmlFor="r-1">Default</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="comfortable" id="r-2" />
            <Label htmlFor="r-2">Comfortable</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="compact" id="r-3" />
            <Label htmlFor="r-3">Compact</Label>
          </div>
        </RadioGroup>
      ),
    },
    {
      id: "switch",
      title: "Switch",
      description: "Toggle a setting on or off.",
      node: (
        <div className="flex items-center gap-2">
          <Switch id="switch-demo" defaultChecked />
          <Label htmlFor="switch-demo">Notifications</Label>
        </div>
      ),
    },
    {
      id: "toggle",
      title: "Toggle",
      description: "Two-state button.",
      node: (
        <div className="flex items-center gap-2">
          <Toggle aria-label="Bold" defaultPressed>
            <Bold />
          </Toggle>
          <Toggle aria-label="Italic">
            <Italic />
          </Toggle>
        </div>
      ),
    },
    {
      id: "toggle-group",
      title: "Toggle Group",
      description: "A set of related toggles.",
      node: (
        <ToggleGroup type="multiple" defaultValue={["bold"]} variant="outline">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
      ),
    },
    {
      id: "slider",
      title: "Slider",
      description: "Pick a value from a range.",
      node: <Slider defaultValue={[50]} max={100} step={1} className="max-w-sm" />,
    },
    {
      id: "progress",
      title: "Progress",
      description: "Completion indicator.",
      node: <Progress value={66} className="max-w-sm" />,
    },
    {
      id: "spinner",
      title: "Spinner",
      description: "Indeterminate loading.",
      node: (
        <div className="flex items-center gap-4">
          <Spinner />
          <Spinner className="size-6" />
          <Button disabled>
            <Spinner />
            Loading
          </Button>
        </div>
      ),
    },
    {
      id: "skeleton",
      title: "Skeleton",
      description: "Placeholder while content loads.",
      node: (
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-4 w-[120px]" />
          </div>
        </div>
      ),
    },
    {
      id: "avatar",
      title: "Avatar",
      description: "User / entity image with fallback.",
      node: (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>DK</AvatarFallback>
          </Avatar>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>EF</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </div>
      ),
    },
    {
      id: "separator",
      title: "Separator",
      description: "Visual divider.",
      node: (
        <div className="flex flex-col gap-3">
          <span className="text-sm">Above</span>
          <Separator />
          <div className="flex h-5 items-center gap-3 text-sm">
            <span>Docs</span>
            <Separator orientation="vertical" />
            <span>API</span>
            <Separator orientation="vertical" />
            <span>Guides</span>
          </div>
        </div>
      ),
    },
    {
      id: "kbd",
      title: "Kbd",
      description: "Keyboard shortcut hint.",
      node: (
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      ),
    },
    {
      id: "aspect-ratio",
      title: "Aspect Ratio",
      description: "Lock content to a ratio.",
      node: (
        <div className="max-w-sm">
          <AspectRatio ratio={16 / 9}>
            <div className="bg-muted text-muted-foreground flex size-full items-center justify-center rounded-md text-sm">
              16 / 9
            </div>
          </AspectRatio>
        </div>
      ),
    },
    {
      id: "native-select",
      title: "Native Select",
      description: "OS-native dropdown.",
      node: (
        <NativeSelect className="max-w-sm" defaultValue="pro">
          <NativeSelectOption value="free">Free</NativeSelectOption>
          <NativeSelectOption value="pro">Pro</NativeSelectOption>
          <NativeSelectOption value="team">Team</NativeSelectOption>
        </NativeSelect>
      ),
    },
    {
      id: "input-otp",
      title: "Input OTP",
      description: "One-time-code entry.",
      node: (
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      ),
    },
  ],
}
