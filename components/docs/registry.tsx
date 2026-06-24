"use client";

import * as React from "react";
import {
  AlertCircle, Bold, BookOpen, Bot, Calendar as CalendarIcon,
  ChevronsUpDown, CreditCard, Folder, Frame, GalleryVerticalEnd,
  Italic, LogOut, Map, PieChart, Search, Settings, Settings2,
  SquareTerminal, Terminal, Underline, User,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { DemoItem, DemoSection, DemoShowcase } from "@/components/docs/demo";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList,
} from "@/components/ui/combobox";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut,
} from "@/components/ui/command";
import {
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger,
} from "@/components/ui/menubar";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/* ──────────────────────────── Stateful demos ──────────────────────────── */

function InputOTPDemo() {
  const [value, setValue] = React.useState("123456");
  return (
    <InputOTP maxLength={6} value={value} onChange={setValue} aria-label="One-time password">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSeparator />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />;
}

function FormDemo() {
  const form = useForm<{ username: string }>({ defaultValues: { username: "" } });
  return (
    <Form {...form}>
      <form className="flex w-full max-w-sm flex-col gap-6" onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "svelte", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

function ComboboxDemo() {
  return (
    <Combobox items={frameworks}>
      <ComboboxInput placeholder="Select framework…" className="w-[240px]" />
      <ComboboxContent>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item: { value: string; label: string }) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

const chartData = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 273 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 314 },
];
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig;

function ChartDemo() {
  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full max-w-md">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

function SonnerDemo() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event created", {
            description: "Sunday, December 03 at 9:00 AM",
            action: { label: "Undo", onClick: () => {} },
          })
        }
      >
        Show toast
      </Button>
      <Toaster />
    </>
  );
}

const sidebarNav = [
  { title: "Playground", icon: SquareTerminal },
  { title: "Models", icon: Bot },
  { title: "Documentation", icon: BookOpen },
  { title: "Settings", icon: Settings2 },
];

function SidebarDemo() {
  return (
    <div className="h-[420px] w-full max-w-[16rem] overflow-hidden rounded-lg border">
      <SidebarProvider className="min-h-full items-stretch">
        <Sidebar collapsible="none" className="h-full">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarMenu>
                {sidebarNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarMenu>
                {[{ name: "Design", icon: Frame }, { name: "Sales", icon: PieChart }, { name: "Travel", icon: Map }].map((p) => (
                  <SidebarMenuItem key={p.name}>
                    <SidebarMenuButton>
                      <p.icon className="size-4" />
                      <span>{p.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Shadcn" />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Shadcn</span>
                    <span className="truncate text-xs">m@example.com</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

/* ──────────────────────────── Registry ──────────────────────────── */

export type DocCategory =
  | "Form & Input"
  | "Display"
  | "Navigation"
  | "Overlay"
  | "Data"
  | "Feedback"
  | "Utility";

export type DocEntry = {
  slug: string;
  title: string;
  category: DocCategory;
  description: string;
  demo: React.ReactNode;
  code: string;
};

export const CATEGORY_ORDER: DocCategory[] = [
  "Form & Input", "Display", "Navigation", "Overlay", "Data", "Feedback", "Utility",
];

const c = (
  slug: string, title: string, category: DocCategory, description: string,
  demo: React.ReactNode, code: string,
): DocEntry => ({ slug, title, category, description, demo, code });

export const registry: DocEntry[] = [
  /* ───────────── Form & Input ───────────── */
  c("button", "Button", "Form & Input", "Displays a button or a component that looks like a button.",
    <DemoShowcase>
      <DemoSection label="Variants">
        <DemoItem caption="default"><Button>Primary</Button></DemoItem>
        <DemoItem caption="secondary"><Button variant="secondary">Secondary</Button></DemoItem>
        <DemoItem caption="outline"><Button variant="outline">Outline</Button></DemoItem>
        <DemoItem caption="ghost"><Button variant="ghost">Ghost</Button></DemoItem>
        <DemoItem caption="destructive"><Button variant="destructive">Destructive</Button></DemoItem>
        <DemoItem caption="link"><Button variant="link">Link</Button></DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<Button>Primary</Button>\n<Button variant="outline">Outline</Button>`),

  c("input", "Input", "Form & Input", "A styled text input field.",
    <Input placeholder="Email" className="w-72" />,
    `<Input placeholder="Email" />`),

  c("textarea", "Textarea", "Form & Input", "A multi-line text input field.",
    <Textarea placeholder="Type your message here." className="w-80" />,
    `<Textarea placeholder="Type your message here." />`),

  c("label", "Label", "Form & Input", "An accessible label associated with a control.",
    <Label htmlFor="r-terms" className="flex items-center gap-2">
      <Checkbox id="r-terms" defaultChecked /> Accept terms and conditions
    </Label>,
    `<Label htmlFor="terms">Accept terms</Label>`),

  c("checkbox", "Checkbox", "Form & Input", "A control that toggles between checked and unchecked.",
    <Label htmlFor="r-cb" className="flex items-center gap-2">
      <Checkbox id="r-cb" defaultChecked /> Accept terms and conditions
    </Label>,
    `<Checkbox id="terms" defaultChecked />`),

  c("switch", "Switch", "Form & Input", "A control that toggles an on/off state.",
    <Label htmlFor="r-sw" className="flex items-center gap-2">
      <Switch id="r-sw" /> Airplane mode
    </Label>,
    `<Switch id="airplane" />`),

  c("radio-group", "Radio Group", "Form & Input", "A set of checkable buttons where only one can be selected.",
    <RadioGroup defaultValue="comfortable" className="gap-2">
      {["default", "comfortable", "compact"].map((v) => (
        <Label key={v} htmlFor={`r-${v}`} className="flex items-center gap-2">
          <RadioGroupItem id={`r-${v}`} value={v} /> {v}
        </Label>
      ))}
    </RadioGroup>,
    `<RadioGroup defaultValue="comfortable">\n  <RadioGroupItem value="default" />\n</RadioGroup>`),

  c("slider", "Slider", "Form & Input", "An input for selecting a value from a range.",
    <Slider defaultValue={[50]} max={100} step={1} aria-label="Volume" className="w-72" />,
    `<Slider defaultValue={[50]} max={100} step={1} />`),

  c("toggle", "Toggle", "Form & Input", "A two-state button that can be on or off.",
    <Toggle aria-label="Toggle bold"><Bold /></Toggle>,
    `<Toggle aria-label="Toggle bold"><Bold /></Toggle>`),

  c("toggle-group", "Toggle Group", "Form & Input", "A set of two-state buttons that can be toggled.",
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic"><Italic /></ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline"><Underline /></ToggleGroupItem>
    </ToggleGroup>,
    `<ToggleGroup type="multiple">\n  <ToggleGroupItem value="bold"><Bold /></ToggleGroupItem>\n</ToggleGroup>`),

  c("select", "Select", "Form & Input", "Displays a list of options for the user to pick from.",
    <Select>
      <SelectTrigger className="w-[220px]" aria-label="Fruit"><SelectValue placeholder="Select a fruit" /></SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>,
    `<Select>\n  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>\n  <SelectContent>…</SelectContent>\n</Select>`),

  c("native-select", "Native Select", "Form & Input", "A native HTML select with consistent styling.",
    <NativeSelect className="w-[220px]" defaultValue="apple" aria-label="Fruit">
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="orange">Orange</NativeSelectOption>
    </NativeSelect>,
    `<NativeSelect>\n  <NativeSelectOption value="apple">Apple</NativeSelectOption>\n</NativeSelect>`),

  c("input-otp", "Input OTP", "Form & Input", "An accessible one-time-password input.",
    <InputOTPDemo />,
    `<InputOTP maxLength={6}>\n  <InputOTPGroup>…</InputOTPGroup>\n</InputOTP>`),

  c("field", "Field", "Form & Input", "A labelled form field with description.",
    <FieldGroup className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="r-fname">Name</FieldLabel>
        <Input id="r-fname" placeholder="Evil Rabbit" />
        <FieldDescription>This is your public display name.</FieldDescription>
      </Field>
    </FieldGroup>,
    `<Field>\n  <FieldLabel>Name</FieldLabel>\n  <Input />\n  <FieldDescription>…</FieldDescription>\n</Field>`),

  c("form", "Form", "Form & Input", "Form primitives wired to react-hook-form with validation messages.",
    <FormDemo />,
    `<Form {...form}>\n  <FormField control={form.control} name="username" render={…} />\n</Form>`),

  c("button-group", "Button Group", "Form & Input", "Groups related buttons together.",
    <ButtonGroup>
      <Button variant="outline">Years</Button>
      <Button variant="outline">Months</Button>
      <Button variant="outline">Days</Button>
    </ButtonGroup>,
    `<ButtonGroup>\n  <Button variant="outline">Years</Button>\n</ButtonGroup>`),

  c("input-group", "Input Group", "Form & Input", "An input with leading or trailing addons.",
    <InputGroup className="w-72">
      <InputGroupAddon><Search /></InputGroupAddon>
      <InputGroupInput placeholder="Search…" />
    </InputGroup>,
    `<InputGroup>\n  <InputGroupAddon><Search /></InputGroupAddon>\n  <InputGroupInput placeholder="Search…" />\n</InputGroup>`),

  c("combobox", "Combobox", "Form & Input", "An autocomplete input with a list of suggestions.",
    <ComboboxDemo />,
    `<Combobox items={frameworks}>\n  <ComboboxInput />\n  <ComboboxContent>…</ComboboxContent>\n</Combobox>`),

  /* ───────────── Display ───────────── */
  c("badge", "Badge", "Display", "Displays a small count or status descriptor.",
    <DemoSection>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </DemoSection>,
    `<Badge>Default</Badge>\n<Badge variant="secondary">Secondary</Badge>`),

  c("avatar", "Avatar", "Display", "An image element with a fallback for representing a user.",
    <AvatarGroup>
      <Avatar><AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /><AvatarFallback>CN</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>,
    `<Avatar>\n  <AvatarImage src="…" />\n  <AvatarFallback>CN</AvatarFallback>\n</Avatar>`),

  c("card", "Card", "Display", "A container for grouping related content and actions.",
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one click.</CardDescription>
        <CardAction><Button variant="link" size="sm">Sign up</Button></CardAction>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Label htmlFor="r-card-name">Name</Label>
        <Input id="r-card-name" placeholder="Name of your project" />
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>,
    `<Card>\n  <CardHeader><CardTitle>…</CardTitle></CardHeader>\n  <CardContent>…</CardContent>\n</Card>`),

  c("separator", "Separator", "Display", "Visually or semantically separates content.",
    <div className="w-72">
      <div className="text-sm font-medium">Radix Primitives</div>
      <Separator className="my-3" />
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Blog</span><Separator orientation="vertical" /><span>Docs</span>
      </div>
    </div>,
    `<Separator />\n<Separator orientation="vertical" />`),

  c("skeleton", "Skeleton", "Display", "A placeholder to show while content is loading.",
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="grid gap-2"><Skeleton className="h-4 w-[200px]" /><Skeleton className="h-4 w-[160px]" /></div>
    </div>,
    `<Skeleton className="size-12 rounded-full" />`),

  c("kbd", "Kbd", "Display", "Represents keyboard input or a keyboard shortcut.",
    <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>,
    `<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>`),

  c("progress", "Progress", "Display", "Displays an indicator showing completion progress.",
    <Progress value={60} aria-label="Loading" className="w-72" />,
    `<Progress value={60} />`),

  c("spinner", "Spinner", "Display", "An animated loading indicator.",
    <Spinner />,
    `<Spinner />`),

  c("item", "Item", "Display", "A flexible row with media, content and actions.",
    <Item className="w-80 rounded-md border">
      <ItemMedia><Avatar><AvatarFallback>CN</AvatarFallback></Avatar></ItemMedia>
      <ItemContent>
        <ItemTitle>shadcn</ItemTitle>
        <ItemDescription>m@example.com</ItemDescription>
      </ItemContent>
      <ItemActions><Button size="sm" variant="outline">View</Button></ItemActions>
    </Item>,
    `<Item>\n  <ItemMedia>…</ItemMedia>\n  <ItemContent>…</ItemContent>\n  <ItemActions>…</ItemActions>\n</Item>`),

  c("empty", "Empty", "Display", "An empty state with media, title and action.",
    <Empty className="w-80 rounded-md border">
      <EmptyHeader>
        <EmptyMedia variant="icon"><Folder /></EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Create your first project to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent><Button size="sm">Create project</Button></EmptyContent>
    </Empty>,
    `<Empty>\n  <EmptyHeader><EmptyTitle>…</EmptyTitle></EmptyHeader>\n  <EmptyContent>…</EmptyContent>\n</Empty>`),

  c("accordion", "Accordion", "Display", "A vertically stacked set of expandable sections.",
    <Accordion type="single" collapsible className="w-80">
      <AccordionItem value="a">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It comes with default styles.</AccordionContent>
      </AccordionItem>
    </Accordion>,
    `<Accordion type="single" collapsible>\n  <AccordionItem value="a">…</AccordionItem>\n</Accordion>`),

  c("collapsible", "Collapsible", "Display", "An interactive section that expands and collapses.",
    <Collapsible className="w-80">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">@peduarte starred 3 repositories</span>
        <CollapsibleTrigger asChild><Button variant="ghost" size="icon-sm"><ChevronsUpDown /><span className="sr-only">Toggle</span></Button></CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2 flex flex-col gap-2">
        <div className="rounded-md border px-3 py-2 text-sm">@radix-ui/primitives</div>
        <div className="rounded-md border px-3 py-2 text-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>,
    `<Collapsible>\n  <CollapsibleTrigger>…</CollapsibleTrigger>\n  <CollapsibleContent>…</CollapsibleContent>\n</Collapsible>`),

  c("calendar", "Calendar", "Display", "A date field for selecting dates.",
    <CalendarDemo />,
    `<Calendar mode="single" selected={date} onSelect={setDate} />`),

  c("aspect-ratio", "Aspect Ratio", "Display", "Constrains content to a desired aspect ratio.",
    <div className="w-72">
      <AspectRatio ratio={16 / 9} className="bg-muted flex items-center justify-center rounded-md">
        <span className="text-foreground text-sm font-medium">16 / 9</span>
      </AspectRatio>
    </div>,
    `<AspectRatio ratio={16 / 9}>…</AspectRatio>`),

  c("carousel", "Carousel", "Display", "A carousel with motion and swipe, built with Embla.",
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {[1, 2, 3].map((n) => (
          <CarouselItem key={n}>
            <Card><CardContent className="flex aspect-square items-center justify-center p-6 text-4xl font-semibold">{n}</CardContent></Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>,
    `<Carousel>\n  <CarouselContent>…</CarouselContent>\n  <CarouselPrevious /><CarouselNext />\n</Carousel>`),

  /* ───────────── Navigation ───────────── */
  c("breadcrumb", "Breadcrumb", "Navigation", "Displays the path to the current resource.",
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>,
    `<Breadcrumb>\n  <BreadcrumbList>…</BreadcrumbList>\n</Breadcrumb>`),

  c("pagination", "Pagination", "Navigation", "Navigation for paged content.",
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
        <PaginationItem><PaginationEllipsis /></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>,
    `<Pagination>\n  <PaginationContent>…</PaginationContent>\n</Pagination>`),

  c("tabs", "Tabs", "Navigation", "Layered sections of content shown one at a time.",
    <Tabs defaultValue="account" className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="text-muted-foreground text-sm">Make changes to your account.</TabsContent>
      <TabsContent value="password" className="text-muted-foreground text-sm">Change your password here.</TabsContent>
    </Tabs>,
    `<Tabs defaultValue="account">\n  <TabsList>…</TabsList>\n  <TabsContent value="account">…</TabsContent>\n</Tabs>`),

  c("navigation-menu", "Navigation Menu", "Navigation", "A collection of links for navigating a site.",
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[240px] gap-1 p-2">
              <li><NavigationMenuLink href="#">Introduction</NavigationMenuLink></li>
              <li><NavigationMenuLink href="#">Installation</NavigationMenuLink></li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>,
    `<NavigationMenu>\n  <NavigationMenuList>…</NavigationMenuList>\n</NavigationMenu>`),

  c("menubar", "Menubar", "Navigation", "A persistent menu common in desktop applications.",
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>,
    `<Menubar>\n  <MenubarMenu>…</MenubarMenu>\n</Menubar>`),

  c("sidebar", "Sidebar", "Navigation", "A composable, collapsible application sidebar.",
    <SidebarDemo />,
    `<SidebarProvider>\n  <Sidebar>…</Sidebar>\n</SidebarProvider>`),

  /* ───────────── Overlay ───────────── */
  c("dialog", "Dialog", "Overlay", "A modal window overlaid on the page.",
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Edit profile</Button></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2"><Label htmlFor="r-dlg">Name</Label><Input id="r-dlg" defaultValue="Pedro Duarte" /></div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
    `<Dialog>\n  <DialogTrigger asChild><Button /></DialogTrigger>\n  <DialogContent>…</DialogContent>\n</Dialog>`),

  c("alert-dialog", "Alert Dialog", "Overlay", "A modal dialog that interrupts with an important confirmation.",
    <AlertDialog>
      <AlertDialogTrigger asChild><Button variant="outline">Delete account</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
    `<AlertDialog>\n  <AlertDialogTrigger asChild><Button /></AlertDialogTrigger>\n  <AlertDialogContent>…</AlertDialogContent>\n</AlertDialog>`),

  c("sheet", "Sheet", "Overlay", "A panel that slides in from the edge of the screen.",
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>,
    `<Sheet>\n  <SheetTrigger asChild><Button /></SheetTrigger>\n  <SheetContent>…</SheetContent>\n</Sheet>`),

  c("drawer", "Drawer", "Overlay", "A bottom drawer for mobile-friendly overlays.",
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>,
    `<Drawer>\n  <DrawerTrigger asChild><Button /></DrawerTrigger>\n  <DrawerContent>…</DrawerContent>\n</Drawer>`),

  c("popover", "Popover", "Overlay", "Rich content displayed in a floating panel.",
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-2">
          <p className="text-sm font-medium">Dimensions</p>
          <p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
        </div>
      </PopoverContent>
    </Popover>,
    `<Popover>\n  <PopoverTrigger asChild><Button /></PopoverTrigger>\n  <PopoverContent>…</PopoverContent>\n</Popover>`),

  c("hover-card", "Hover Card", "Overlay", "A card revealed when hovering over a trigger.",
    <HoverCard>
      <HoverCardTrigger asChild><Button variant="link">@nextjs</Button></HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-3">
          <Avatar><AvatarFallback>NJ</AvatarFallback></Avatar>
          <div className="text-sm"><p className="font-semibold">@nextjs</p><p className="text-muted-foreground">The React Framework.</p></div>
        </div>
      </HoverCardContent>
    </HoverCard>,
    `<HoverCard>\n  <HoverCardTrigger asChild><Button /></HoverCardTrigger>\n  <HoverCardContent>…</HoverCardContent>\n</HoverCard>`),

  c("tooltip", "Tooltip", "Overlay", "A floating label shown on hover or focus.",
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
        <TooltipContent>Add to library</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
    `<Tooltip>\n  <TooltipTrigger asChild><Button /></TooltipTrigger>\n  <TooltipContent>Add to library</TooltipContent>\n</Tooltip>`),

  c("dropdown-menu", "Dropdown Menu", "Overlay", "A menu of actions triggered by a button.",
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">Open menu</Button></DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><User /> Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuItem><CreditCard /> Billing</DropdownMenuItem>
        <DropdownMenuItem><Settings /> Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><LogOut /> Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
    `<DropdownMenu>\n  <DropdownMenuTrigger asChild><Button /></DropdownMenuTrigger>\n  <DropdownMenuContent>…</DropdownMenuContent>\n</DropdownMenu>`),

  c("context-menu", "Context Menu", "Overlay", "A menu shown on right-click.",
    <ContextMenu>
      <ContextMenuTrigger className="flex h-28 w-72 items-center justify-center rounded-md border border-dashed text-sm">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem>Back <ContextMenuShortcut>⌘[</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut></ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>,
    `<ContextMenu>\n  <ContextMenuTrigger>…</ContextMenuTrigger>\n  <ContextMenuContent>…</ContextMenuContent>\n</ContextMenu>`),

  c("command", "Command", "Overlay", "A composable command palette / menu.",
    <Command className="w-80 rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem><CalendarIcon /> Calendar</CommandItem>
          <CommandItem><Search /> Search <CommandShortcut>⌘S</CommandShortcut></CommandItem>
        </CommandGroup>
        <CommandGroup heading="Settings">
          <CommandItem><Settings /> Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>,
    `<Command>\n  <CommandInput placeholder="…" />\n  <CommandList>…</CommandList>\n</Command>`),

  /* ───────────── Data ───────────── */
  c("table", "Table", "Data", "A responsive table for tabular data.",
    <Table className="w-[28rem]">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow><TableHead>Invoice</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>INV001</TableCell><TableCell><Badge>Paid</Badge></TableCell><TableCell className="text-right">$250.00</TableCell></TableRow>
        <TableRow><TableCell>INV002</TableCell><TableCell><Badge variant="secondary">Pending</Badge></TableCell><TableCell className="text-right">$150.00</TableCell></TableRow>
      </TableBody>
    </Table>,
    `<Table>\n  <TableHeader>…</TableHeader>\n  <TableBody>…</TableBody>\n</Table>`),

  c("chart", "Chart", "Data", "Composable charts built on Recharts with theming.",
    <ChartDemo />,
    `<ChartContainer config={config}>\n  <BarChart data={data}>…</BarChart>\n</ChartContainer>`),

  /* ───────────── Feedback ───────────── */
  c("alert", "Alert", "Feedback", "Displays a callout for user attention.",
    <div className="flex w-96 flex-col gap-3">
      <Alert><Terminal /><AlertTitle>Heads up!</AlertTitle><AlertDescription>You can add components using the CLI.</AlertDescription></Alert>
      <Alert variant="destructive"><AlertCircle /><AlertTitle>Error</AlertTitle><AlertDescription>Your session has expired.</AlertDescription></Alert>
    </div>,
    `<Alert>\n  <Terminal /><AlertTitle>Heads up!</AlertTitle>\n  <AlertDescription>…</AlertDescription>\n</Alert>`),

  c("sonner", "Sonner", "Feedback", "An opinionated toast notification system.",
    <SonnerDemo />,
    `toast("Event created", { description: "…" })`),

  /* ───────────── Utility ───────────── */
  c("scroll-area", "Scroll Area", "Utility", "A scrollable region with a styled scrollbar.",
    <ScrollArea className="h-40 w-60 rounded-md border p-3">
      <div className="flex flex-col gap-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="text-sm">Item {i + 1}</div>
        ))}
      </div>
    </ScrollArea>,
    `<ScrollArea className="h-40 w-60">…</ScrollArea>`),

  c("resizable", "Resizable", "Utility", "Resizable panel groups with draggable handles.",
    <ResizablePanelGroup orientation="horizontal" className="h-40 w-80 rounded-md border">
      <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center p-4 text-sm">One</div></ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center p-4 text-sm">Two</div></ResizablePanel>
    </ResizablePanelGroup>,
    `<ResizablePanelGroup orientation="horizontal">\n  <ResizablePanel>One</ResizablePanel>\n  <ResizableHandle />\n  <ResizablePanel>Two</ResizablePanel>\n</ResizablePanelGroup>`),
];

export function getEntry(slug: string): DocEntry | undefined {
  return registry.find((e) => e.slug === slug);
}
