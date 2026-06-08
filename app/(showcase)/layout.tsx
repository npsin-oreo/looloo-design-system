import { ShowcaseLayout } from "@/components/showcase/showcase-layout"

export default function ShowcaseRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ShowcaseLayout>{children}</ShowcaseLayout>
}
