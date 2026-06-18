# การพัฒนา Looloo Design System

เอกสารนี้สำหรับผู้ดูแล `@npsin-oreo/design-system` ที่ต้องเพิ่มหรือแก้ component, design tokens และ release package

หากต้องการติดตั้งและเรียกใช้งานในโปรเจกต์อื่น อ่าน [`README.md`](./README.md)

## 1. เริ่มโปรเจกต์

```bash
cd looloo-design-system
npm install
npm run dev
```

เปิด <http://localhost:3000> เพื่อดู component showcase

## 2. ตำแหน่งไฟล์สำคัญ

```text
components/ui/       component ที่ถูก export ให้ consumer
lib/utils.ts         utility `cn()` สำหรับรวม className
app/globals.css      entry stylesheet และ mapping ของ semantic tokens
app/primitives.css   primitive color tokens
app/brand.css        brand tokens ที่ generate แล้ว ห้ามแก้ตรง
brand.config.json    source สำหรับแก้สีและ radius ของ brand
```

ไฟล์ `components/ui/<name>.tsx` จะถูก export อัตโนมัติเป็น `@npsin-oreo/design-system/<name>` ผ่าน wildcard export ใน `package.json`

## 3. สร้าง Component

ตัวอย่าง component ใหม่ `components/ui/status-card.tsx`:

```tsx
import * as React from "react"

import { cn } from "../../lib/utils"

function StatusCard({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="status-card"
      className={cn(
        "rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export { StatusCard }
```

Consumer จะเรียกใช้ได้ดังนี้:

```tsx
import { StatusCard } from "@npsin-oreo/design-system/status-card"
```

ข้อกำหนดหลัก:

- ใช้ semantic tokens เช่น `bg-card`, `text-foreground`, `border-border`
- รับ `className` และรวมด้วย `cn()` เพื่อให้ consumer ปรับ layout เพิ่มได้
- ส่งต่อ native props ด้วย `React.ComponentProps<...>` และ `{...props}`
- ใส่ `data-slot` เพื่อระบุส่วนของ component
- ใช้ relative import ภายใน package เช่น `../../lib/utils` ห้ามใช้ alias ที่ consumer resolve ไม่ได้
- เพิ่ม `"use client"` เฉพาะ component ที่ใช้ state, effect, event-driven hooks หรือ browser APIs
- export component และ type ที่ consumer ต้องใช้จากไฟล์เดียวกัน

## 4. เพิ่มหรืออัปเดต shadcn Component

```bash
npx shadcn@latest add <component-name>
```

หากต้องการเขียนทับ component เดิม:

```bash
npx shadcn@latest add <component-name> --overwrite
```

หลัง generate ให้ตรวจ import ภายในไฟล์ว่าเป็น relative import และตรวจว่าสีใช้ semantic tokens ของระบบ

## 5. แก้สีของ Brand

แก้ที่ `brand.config.json` แล้ว generate `app/brand.css`:

```bash
npm run brand:build
```

ห้ามแก้ `app/brand.css` โดยตรง เพราะไฟล์จะถูกเขียนทับเมื่อรัน `dev` หรือ `build`

รายละเอียด token และ white-label workflow:

- [`DESIGN.md`](./DESIGN.md)
- [`WHITELABEL.md`](./WHITELABEL.md)

## 6. ตรวจสอบก่อนส่งแพ็กเกจ

```bash
npm run build
npm pack --dry-run
```

ตรวจว่า package artifact มีอย่างน้อย:

- `app/globals.css`, `app/brand.css`, `app/primitives.css`, `app/shadcn.css`
- `components/ui/*.tsx`
- `components/theme-provider.tsx`
- `hooks/` และ `lib/`

## 7. Release และอัปเดต Consumer ผ่าน Git

1. แก้ version ใน `package.json`
2. Commit และ push การเปลี่ยนแปลง
3. สร้าง Git tag ให้ตรงกับ version
4. เปลี่ยน tag ที่ consumer ใช้และรัน `npm install`

ตัวอย่าง:

```bash
cd looloo-design-system
git status
git add <release-files>
git commit -m "release: v0.1.3"
git tag v0.1.3
git push origin HEAD
git push origin v0.1.3

cd ../demo-use
npm install git+ssh://git@github.com/npsin-oreo/looloo-design-system.git#v0.1.3
npm run build
```

อย่าอ้างอิง branch เช่น `main` ใน production เพราะผลการติดตั้งอาจเปลี่ยนทุกครั้งที่ branch มี commit ใหม่ ให้ใช้ version tag หรือ commit SHA เสมอ

`npm pack --dry-run` ยังควรรันก่อน release เพื่อยืนยันว่าไฟล์ที่กำหนดใน `package.json#files` ครบถ้วน แม้ consumer จะติดตั้งผ่าน Git ก็ตาม

## Scripts

| Command | ใช้ทำอะไร |
| --- | --- |
| `npm run dev` | เปิด component showcase |
| `npm run build` | production build และตรวจ integration |
| `npm run brand:build` | generate `app/brand.css` จาก `brand.config.json` |
| `npm run tokens:data` | generate token data สำหรับ showcase |
| `npm run tokens:import [path]` | import Figma token export |
| `npm pack --dry-run` | ตรวจรายการไฟล์ที่จะอยู่ใน package |
| `npm pack` | สร้าง `.tgz` เพื่อทดสอบ package artifact ก่อน release |
