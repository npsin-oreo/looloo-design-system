import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { FileUpload, FileUploadDropzone, FileUploadRow } from "@/components/ui/file-upload";

const meta: Meta<typeof FileUpload> = {
  title: "Form & Input/File Upload",
  component: FileUpload,
  parameters: {
    docs: {
      description: {
        component:
          "A drop target plus a list of file rows. The dropzone is a drop zone before it is a button — tall, dashed, and it fills on drag. Each row carries its state on the media tile only (never the whole row), shows a progress bar with a live percentage while uploading, and keeps a failed file in the list with a retry.",
      },
    },
  },
  render: () => (
    <FileUpload className="w-96">
      <FileUploadDropzone hint="PNG, JPG or PDF · up to 10MB">
        Drag files here or <span className="text-primary underline">browse</span>
      </FileUploadDropzone>
      <FileUploadRow status="uploading" name="annual-report-2026.pdf" progress={62} onRemove={() => {}} />
      <FileUploadRow status="success" name="cover.png" message="1.4 MB" onRemove={() => {}} />
      <FileUploadRow
        status="error"
        name="raw-scan.tiff"
        message="ไฟล์ใหญ่เกิน 10MB"
        onRetry={() => {}}
        onRemove={() => {}}
      />
    </FileUpload>
  ),
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-96 flex-col gap-1.5">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}

export const Playground: Story = {};

export const Dropzone: Story = {
  name: "Dropzone (idle / drag)",
  parameters: {
    docs: {
      description: {
        story: "`active` flips `data-drag`, which swaps the border and fills the zone — the feedback that a drop will land.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Cell label="idle">
        <FileUploadDropzone hint="PNG, JPG or PDF · up to 10MB">
          Drag files here or <span className="text-primary underline">browse</span>
        </FileUploadDropzone>
      </Cell>
      <Cell label="active (data-drag)">
        <FileUploadDropzone active hint="PNG, JPG or PDF · up to 10MB">
          Drop to upload
        </FileUploadDropzone>
      </Cell>
    </div>
  ),
};

export const RowStates: Story = {
  name: "Row states",
  parameters: {
    docs: {
      description: {
        story: "The tile colour is the only thing that changes between states — uploading (muted, spinning), success (green check), error (red, with a retry). A row of red for one failed file would bury the ones that worked.",
      },
    },
  },
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <FileUploadRow status="uploading" name="annual-report-2026.pdf" progress={62} onRemove={() => {}} />
      <FileUploadRow status="success" name="cover.png" message="1.4 MB" onRemove={() => {}} />
      <FileUploadRow
        status="error"
        name="raw-scan.tiff"
        message="ไฟล์ใหญ่เกิน 10MB"
        onRetry={() => {}}
        onRemove={() => {}}
      />
    </div>
  ),
};

type Sim = { id: number; name: string; status: "uploading" | "success" | "error"; progress: number };

export const Interactive: Story = {
  name: "Interactive (simulated upload)",
  parameters: {
    docs: {
      description: {
        story: "Drop or browse to add a file; it climbs to 100% and settles as success. `raw-scan.tiff` is wired to fail so you can exercise retry.",
      },
    },
  },
  render: function InteractiveUpload() {
    const [files, setFiles] = React.useState<Sim[]>([]);
    const [drag, setDrag] = React.useState(false);
    const timers = React.useRef<Record<number, ReturnType<typeof setInterval>>>({});

    const run = React.useCallback((id: number, willFail: boolean) => {
      timers.current[id] = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id !== id || f.status !== "uploading") return f;
            const next = Math.min(100, f.progress + 12);
            if (next >= 100) {
              clearInterval(timers.current[id]);
              return willFail
                ? { ...f, status: "error", progress: 100 }
                : { ...f, status: "success", progress: 100 };
            }
            return { ...f, progress: next };
          })
        );
      }, 300);
    }, []);

    const add = React.useCallback(
      (name: string) => {
        const id = Date.now() + Math.random();
        setFiles((prev) => [...prev, { id, name, status: "uploading", progress: 0 }]);
        run(id, /tiff$/i.test(name));
      },
      [run]
    );

    React.useEffect(() => () => Object.values(timers.current).forEach(clearInterval), []);

    return (
      <FileUpload className="w-96">
        <FileUploadDropzone
          active={drag}
          hint="Drop a file, or use the buttons below"
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const dropped = Array.from(e.dataTransfer.files);
            if (dropped.length) dropped.forEach((f) => add(f.name));
            else add("dropped-file.png");
          }}
        >
          Drag files here to upload
        </FileUploadDropzone>

        <div className="flex gap-2">
          <button
            type="button"
            className="text-primary text-sm underline"
            onClick={() => add(`photo-${Math.floor(Math.random() * 90 + 10)}.png`)}
          >
            + add a file that succeeds
          </button>
          <button
            type="button"
            className="text-destructive text-sm underline"
            onClick={() => add("raw-scan.tiff")}
          >
            + add one that fails
          </button>
        </div>

        {files.map((f) => (
          <FileUploadRow
            key={f.id}
            status={f.status}
            name={f.name}
            message={
              f.status === "error"
                ? "อัปโหลดไม่สำเร็จ"
                : f.status === "success"
                  ? "เสร็จแล้ว"
                  : undefined
            }
            progress={f.status === "uploading" ? f.progress : undefined}
            onRetry={
              f.status === "error"
                ? () => {
                    setFiles((prev) =>
                      prev.map((x) => (x.id === f.id ? { ...x, status: "uploading", progress: 0 } : x))
                    );
                    run(f.id, false);
                  }
                : undefined
            }
            onRemove={() => {
              clearInterval(timers.current[f.id]);
              setFiles((prev) => prev.filter((x) => x.id !== f.id));
            }}
          />
        ))}
      </FileUpload>
    );
  },
};
