import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, FileUp, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BigButton } from "@/components/BigButton";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload your bank statement — Old Age Bank Statement Analysis" },
      {
        name: "description",
        content:
          "Choose a PDF or picture of your bank statement, or take a photo with your phone. We read it and group your transactions for you.",
      },
      { property: "og:title", content: "Upload your bank statement" },
      {
        property: "og:description",
        content: "Choose a PDF or photo of your statement and we will group it for you.",
      },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    navigate({ to: "/processing", search: { name: file.name } });
  }

  return (
    <AppShell
      title="Upload your statement"
      subtitle="Pick a file, or take a photo of the paper statement."
      back={{ to: "/", label: "Back to home" }}
    >
      <ol className="space-y-6">
        <li className="card-soft p-5">
          <p className="text-lg font-bold text-muted-foreground">Step 1</p>
          <h2 className="mt-1 text-2xl font-bold">Choose a file</h2>
          <p className="mt-2 text-lg">A PDF or a picture from your phone or computer.</p>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,image/*"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <BigButton className="mt-4" onClick={() => fileRef.current?.click()}>
            <FileUp className="size-8 shrink-0" aria-hidden />
            Choose PDF or picture
          </BigButton>
        </li>

        <li className="card-soft p-5">
          <p className="text-lg font-bold text-muted-foreground">Step 2 (or instead)</p>
          <h2 className="mt-1 text-2xl font-bold">Take a photo</h2>
          <p className="mt-2 text-lg">
            Lay the statement flat in good light and take one clear picture.
          </p>
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <BigButton
            variant="secondary"
            className="mt-4"
            onClick={() => cameraRef.current?.click()}
          >
            <Camera className="size-8 shrink-0" aria-hidden />
            Use my camera
          </BigButton>
        </li>
      </ol>

      {error ? (
        <p className="mt-6 rounded-2xl bg-spend-soft p-4 text-lg font-bold text-spend">{error}</p>
      ) : null}

      <div className="mt-8 card-soft flex items-start gap-4 p-5">
        <ShieldCheck className="size-10 shrink-0 text-success" aria-hidden />
        <p className="text-lg">
          Your statement stays on this device. We never ask for your bank password and we can never
          move your money.
        </p>
      </div>

      <p className="mt-6 text-base text-muted-foreground">
        This is a demonstration version. Whatever file you choose, we show you a realistic example
        South African statement so you can see how the app works.
      </p>
    </AppShell>
  );
}
