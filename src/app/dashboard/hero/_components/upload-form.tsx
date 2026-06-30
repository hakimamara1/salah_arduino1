"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadHeroImage, type HeroActionState } from "@/app/dashboard/hero/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VARIANTS, VARIANT_IDS } from "@/lib/content";

const initial: HeroActionState = {};

export function UploadForm() {
  const [state, formAction, pending] = useActionState(uploadHeroImage, initial);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:grid-cols-2"
    >
      <div className="space-y-1.5">
        <Label htmlFor="hero-variant">Variant</Label>
        <Select name="variant" defaultValue="ALL">
          <SelectTrigger id="hero-variant">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Default (all variants)</SelectItem>
            {VARIANT_IDS.map((id) => (
              <SelectItem key={id} value={id}>
                {id} · {VARIANTS[id].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-alt">Alt text (optional)</Label>
        <Input id="hero-alt" name="alt" placeholder="e.g. child building a robot" />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="hero-file">Image (JPG / PNG / WebP / AVIF, ≤ 5 MB)</Label>
        <Input
          id="hero-file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          required
          className="file:mr-3 file:rounded-md file:border-0 file:bg-brand-light file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand"
        />
      </div>

      <div className="flex items-center gap-3 sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <Upload className="size-4" /> Upload image
            </>
          )}
        </Button>
        {state.error && <span className="text-sm text-destructive">{state.error}</span>}
        {state.success && <span className="text-sm text-brand">{state.success}</span>}
      </div>
    </form>
  );
}
