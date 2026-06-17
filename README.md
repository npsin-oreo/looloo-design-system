# @looloo/design-system

Design system สำหรับ React 19, Next.js 15 และ Tailwind CSS v4 ประกอบด้วย design tokens, semantic colors และชุด component ที่เรียกใช้ผ่านแพ็กเกจ `@looloo/design-system`

เอกสารสำหรับแต่ละกลุ่ม:

- **ผู้ใช้งาน Design System:** อ่านเอกสารนี้ต่อเพื่อดูวิธีติดตั้ง ตั้งค่า ใช้สี และเรียก component
- **ผู้พัฒนา Design System:** อ่าน [`DEVELOPMENT.md`](./DEVELOPMENT.md)

## ผู้เรียกใช้ Design System (Consumer)

### 1. ติดตั้ง

ติดตั้งจาก GitHub repository ผ่าน SSH:

```bash
npm install git+ssh://git@github.com/npsin-oreo/looloo-design-system.git
```

Dependency ที่ component และ stylesheet ต้องใช้ เช่น `tw-animate-css` จะถูกติดตั้งมากับ `@looloo/design-system` อัตโนมัติ ไม่ต้องติดตั้งแยก

เครื่องที่ติดตั้งต้องมีสิทธิ์เข้าถึง repository และตั้งค่า SSH key กับ GitHub เรียบร้อยแล้ว ทดสอบการเชื่อมต่อได้ด้วย:

```bash
ssh -T git@github.com
```

สำหรับ production แนะนำให้ระบุ tag หรือ commit เพื่อให้ทุกเครื่องติดตั้ง source ชุดเดียวกัน:

```bash
# ติดตั้งจาก tag
npm install git+ssh://git@github.com/npsin-oreo/looloo-design-system.git#v0.1.2

# หรือติดตั้งจาก commit
npm install git+ssh://git@github.com/npsin-oreo/looloo-design-system.git#<commit-sha>

# ระหว่างพัฒนาสามารถติดตั้งจาก branch ได้
npm install git+ssh://git@github.com/npsin-oreo/looloo-design-system.git#feat/convert-installable-package
```

เมื่อติดตั้งแล้ว dependency ใน `package.json` ของ consumer จะมีลักษณะดังนี้:

```json
{
  "dependencies": {
    "@looloo/design-system": "git+ssh://git@github.com/npsin-oreo/looloo-design-system.git#v0.1.2"
  }
}
```

หาก repository เปิดเป็น public สามารถใช้ HTTPS ได้:

```bash
npm install git+https://github.com/npsin-oreo/looloo-design-system.git#v0.1.2
```

### 2. ตั้งค่า Next.js

แพ็กเกจส่งออก component เป็น TypeScript source จึงต้องเพิ่ม `transpilePackages` ใน `next.config.ts`:

```ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@looloo/design-system"],
}

export default nextConfig
```

### 3. โหลด Style

Import stylesheet เพียงครั้งเดียวที่ root layout:

```tsx
// app/layout.tsx
import "@looloo/design-system/styles.css"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
```

ไฟล์นี้รวม Tailwind CSS, animation utilities, primitive tokens, brand tokens และ base styles ที่ component ต้องใช้แล้ว

### 4. เรียกใช้ Component

Import component จากชื่อไฟล์โดยตรง:

```tsx
import { Button } from "@looloo/design-system/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@looloo/design-system/card"

export default function Example() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>สร้างโปรเจกต์ใหม่</CardTitle>
        <CardDescription>กรอกรายละเอียดเพื่อเริ่มต้นใช้งาน</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>เริ่มต้น</Button>
      </CardContent>
    </Card>
  )
}
```

ตัวอย่าง component อื่น:

```tsx
import { Badge } from "@looloo/design-system/badge"
import { Input } from "@looloo/design-system/input"
import { Switch } from "@looloo/design-system/switch"

export function Settings() {
  return (
    <div className="space-y-4">
      <Badge>Active</Badge>
      <Input placeholder="ชื่อโปรเจกต์" />
      <Switch aria-label="เปิดการแจ้งเตือน" />
    </div>
  )
}
```

รายชื่อ component ทั้งหมดอยู่ใน [`components/ui`](./components/ui)

### 5. ใช้สี

ให้ใช้ semantic color utilities เสมอ เพื่อให้สีเปลี่ยนตาม brand และ dark mode ได้อัตโนมัติ:

```tsx
export function ColorExample() {
  return (
    <section className="border-border bg-background text-foreground">
      <h2 className="text-primary">หัวข้อหลัก</h2>
      <p className="text-muted-foreground">ข้อความรอง</p>

      <div className="bg-card text-card-foreground">Card content</div>

      <button className="bg-primary text-primary-foreground hover:bg-primary/90">
        ยืนยัน
      </button>

      <p className="text-destructive">เกิดข้อผิดพลาด</p>
    </section>
  )
}
```

สีที่ใช้บ่อย:

| หน้าที่ | Background | Text / Foreground |
| --- | --- | --- |
| หน้าหลัก | `bg-background` | `text-foreground` |
| Card | `bg-card` | `text-card-foreground` |
| Action หลัก | `bg-primary` | `text-primary-foreground` |
| Action รอง | `bg-secondary` | `text-secondary-foreground` |
| ข้อมูลรอง | `bg-muted` | `text-muted-foreground` |
| Hover / selected | `bg-accent` | `text-accent-foreground` |
| Error / danger | `bg-destructive` | `text-destructive` |
| เส้นขอบ | `border-border` | - |
| Input | `border-input` | - |
| Focus ring | `ring-ring` | - |

หลีกเลี่ยงการกำหนดสีตรง เช่น `bg-white`, `text-black`, `bg-[#123456]` ใน component ทั่วไป เพราะจะไม่เปลี่ยนตาม theme

### 6. Dark Mode

Semantic colors รองรับ dark mode ผ่าน class `dark` ที่ `<html>`:

```tsx
<html lang="th" className="dark">
```

เมื่อใช้ `bg-background`, `text-foreground`, `bg-card` และ token อื่น ๆ ไม่ต้องเขียน `dark:` ซ้ำสำหรับสีหลัก

### 7. ใช้ Theme Provider

แพ็กเกจ export provider ที่สร้างจาก `next-themes` ไว้แล้ว:

```tsx
import { ThemeProvider } from "@looloo/design-system/theme-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## ตัวอย่าง Consumer

ดูตัวอย่างการตั้งค่าและการประกอบหน้าเต็มได้ที่ [`../demo-use`](../demo-use)

สำหรับการเพิ่ม component, แก้ design tokens หรือ release version ใหม่ อ่าน [`DEVELOPMENT.md`](./DEVELOPMENT.md)
