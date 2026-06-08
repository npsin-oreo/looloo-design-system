"use client"

import * as React from "react"
import {
  Bell,
  Check,
  ChevronDown,
  CreditCard,
  Inbox,
  Mail,
  Search,
  Settings,
  User,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import type { Tier } from "./types"

const FRAMEWORKS = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "vite", label: "Vite" },
]

function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between"
        >
          {value
            ? FRAMEWORKS.find((f) => f.value === value)?.label
            : "Select framework…"}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Search framework…" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {FRAMEWORKS.map((f) => (
                <CommandItem
                  key={f.value}
                  value={f.value}
                  onSelect={(current) => {
                    setValue(current === value ? "" : current)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "size-4",
                      value === f.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {f.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}

export const molecules: Tier = {
  id: "molecules",
  label: "Molecules",
  blurb:
    "Small groups of atoms bonded together — simple, reusable combinations that do one job well.",
  demos: [
    {
      id: "card",
      title: "Card",
      description: "Surface container for related content.",
      node: (
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
            <CardAction>
              <Badge variant="secondary">Pro</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Cards group a title, body, and actions on one elevated surface.
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Save</Button>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      ),
    },
    {
      id: "alert",
      title: "Alert",
      description: "Inline contextual message.",
      node: (
        <Alert className="max-w-md">
          <Bell />
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>
            Tokens are synced from Figma — edit at source, then re-export.
          </AlertDescription>
        </Alert>
      ),
    },
    {
      id: "tooltip",
      title: "Tooltip",
      description: "Hover hint for an element.",
      node: (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Adds to your library</TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: "popover",
      title: "Popover",
      description: "Rich floating panel on click.",
      node: (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Dimensions</p>
              <p className="text-muted-foreground text-sm">
                Set the dimensions for the layer.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      id: "hover-card",
      title: "Hover Card",
      description: "Preview card on hover.",
      node: (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@duckking</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>DK</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">Duck King</p>
                <p className="text-muted-foreground">Design system lead</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ),
    },
    {
      id: "accordion",
      title: "Accordion",
      description: "Expandable stacked sections.",
      node: (
        <Accordion type="single" collapsible className="w-full max-w-md">
          <AccordionItem value="a">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes — it follows the WAI-ARIA disclosure pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Is it themed?</AccordionTrigger>
            <AccordionContent>
              Yes — it uses the synced semantic tokens.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      id: "collapsible",
      title: "Collapsible",
      description: "Show/hide a single region.",
      node: (
        <Collapsible className="flex w-full max-w-sm flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">@duckking starred 3 repos</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle">
                <ChevronDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-3 py-2 text-sm">@radix-ui/primitives</div>
          <CollapsibleContent className="flex flex-col gap-2">
            <div className="rounded-md border px-3 py-2 text-sm">@tailwindlabs/tailwindcss</div>
            <div className="rounded-md border px-3 py-2 text-sm">@shadcn/ui</div>
          </CollapsibleContent>
        </Collapsible>
      ),
    },
    {
      id: "tabs",
      title: "Tabs",
      description: "Switch between related panels.",
      node: (
        <Tabs defaultValue="account" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="text-muted-foreground text-sm">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password" className="text-muted-foreground text-sm">
            Change your password here.
          </TabsContent>
        </Tabs>
      ),
    },
    {
      id: "breadcrumb",
      title: "Breadcrumb",
      description: "Hierarchical location trail.",
      node: (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ),
    },
    {
      id: "pagination",
      title: "Pagination",
      description: "Navigate between pages.",
      node: (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ),
    },
    {
      id: "select",
      title: "Select",
      description: "Styled single-choice dropdown.",
      node: (
        <Select>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "dropdown-menu",
      title: "Dropdown Menu",
      description: "Actions menu from a trigger.",
      node: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      id: "combobox",
      title: "Combobox",
      description: "Searchable select (Popover + Command).",
      node: <ComboboxDemo />,
    },
    {
      id: "calendar",
      title: "Calendar",
      description: "Date selection grid.",
      node: <CalendarDemo />,
    },
    {
      id: "scroll-area",
      title: "Scroll Area",
      description: "Styled scrollable region.",
      node: (
        <ScrollArea className="h-40 w-full max-w-sm rounded-md border p-4">
          <div className="flex flex-col gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="text-sm">
                Item {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      ),
    },
    {
      id: "input-group",
      title: "Input Group",
      description: "Input with leading/trailing addons.",
      node: (
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search…" />
        </InputGroup>
      ),
    },
    {
      id: "button-group",
      title: "Button Group",
      description: "Segmented set of buttons.",
      node: (
        <ButtonGroup>
          <Button variant="outline">Day</Button>
          <Button variant="outline">Week</Button>
          <ButtonGroupSeparator />
          <Button variant="outline">Month</Button>
        </ButtonGroup>
      ),
    },
    {
      id: "field",
      title: "Field",
      description: "Label + control + help text unit.",
      node: (
        <FieldGroup className="max-w-sm">
          <Field>
            <FieldLabel htmlFor="field-email">Email</FieldLabel>
            <Input id="field-email" placeholder="you@example.com" />
            <FieldDescription>We&apos;ll never share your email.</FieldDescription>
          </Field>
        </FieldGroup>
      ),
    },
    {
      id: "item",
      title: "Item",
      description: "Media + content + actions row.",
      node: (
        <ItemGroup className="max-w-sm">
          <Item variant="outline">
            <ItemMedia>
              <Avatar>
                <AvatarFallback>DK</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Duck King</ItemTitle>
              <ItemDescription>napasin.int@gmail.com</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                View
              </Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      ),
    },
    {
      id: "empty",
      title: "Empty",
      description: "Empty / zero-data state.",
      node: (
        <Empty className="max-w-sm rounded-md border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No messages</EmptyTitle>
            <EmptyDescription>You&apos;re all caught up.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm" variant="outline">
              <Mail />
              Compose
            </Button>
          </EmptyContent>
        </Empty>
      ),
    },
    {
      id: "sonner",
      title: "Sonner (Toast)",
      description: "Transient notification.",
      node: (
        <Button
          variant="outline"
          onClick={() =>
            toast("Event created", {
              description: "Sunday, June 8 at 9:00 AM",
              action: { label: "Undo", onClick: () => {} },
            })
          }
        >
          Show toast
        </Button>
      ),
    },
  ],
}
