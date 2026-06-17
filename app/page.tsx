import { Button } from "@/components/ui/button"

// Minimal preview/smoke page (the multi-brand showcase was removed — Storybook is the
// demo surface for a design-system package). Confirms the package's own components render.
export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-lg font-medium">@looloo/design-system</h1>
      <div className="flex gap-3">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </main>
  )
}
