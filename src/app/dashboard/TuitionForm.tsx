"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadToImgBB } from "@/app/lib/api";
import {
  dashboardFormControl,
  dashboardPrimaryButton,
} from "./ui";

export type TuitionValues = {
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location: string;
  monthlyFee: string;
  daysPerWeek: string;
  description: string;
  bannerUrl: string;
};

const emptyTuitionValues: TuitionValues = {
  title: "", subject: "", classLevel: "", mode: "online", location: "",
  monthlyFee: "", daysPerWeek: "", description: "", bannerUrl: "",
};

function validateTuition(
  values: TuitionValues,
  bannerFile: File | null,
): Record<string, string> {
  const validationErrors: Record<string, string> = {};
  if (values.title.trim().length < 5) validationErrors.title = "Enter at least 5 characters.";
  if (!values.subject.trim()) validationErrors.subject = "Subject is required.";
  if (!values.classLevel.trim()) validationErrors.classLevel = "Class level is required.";
  if (!values.location.trim()) validationErrors.location = "Location is required.";
  if (!(Number(values.monthlyFee) > 0)) validationErrors.monthlyFee = "Enter a fee above 0.";
  const daysPerWeekCount = Number(values.daysPerWeek);
  if (!(daysPerWeekCount >= 1 && daysPerWeekCount <= 7)) {
    validationErrors.daysPerWeek = "Choose 1 to 7 days.";
  }
  if (values.description.trim().length < 20) {
    validationErrors.description = "Write at least 20 characters.";
  }
  if (!bannerFile && !values.bannerUrl) {
    validationErrors.banner = "Upload a banner image.";
  }
  if (bannerFile && bannerFile.size > 5 * 1024 * 1024) {
    validationErrors.banner = "Image must be under 5 MB.";
  }
  return validationErrors;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[#101535] dark:text-[#101535]">{label}</Label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function TuitionForm({
  initial, submitLabel, disabled, onSubmit,
}: {
  initial?: Partial<TuitionValues>;
  submitLabel: string;
  disabled?: boolean;
  onSubmit: (values: TuitionValues) => Promise<void>;
}) {
  const [values, setValues] = useState<TuitionValues>({
    ...emptyTuitionValues,
    ...initial,
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const createChangeHandler = (fieldName: keyof TuitionValues) => (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) =>
    setValues((previousValues) => ({
      ...previousValues,
      [fieldName]: event.target.value,
    }));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateTuition(values, bannerFile);
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setIsSaving(true);
    try {
      const bannerUrl = bannerFile
        ? await uploadToImgBB(bannerFile)
        : values.bannerUrl;
      await onSubmit({ ...values, bannerUrl });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 text-[#101535] md:grid-cols-2">
      <div className="md:col-span-2">
        <Field label="Title" error={fieldErrors.title}>
          <Input className={dashboardFormControl} value={values.title} onChange={createChangeHandler("title")} placeholder="e.g. HSC Physics Batch" />
        </Field>
      </div>
      <Field label="Subject" error={fieldErrors.subject}>
        <Input className={dashboardFormControl} value={values.subject} onChange={createChangeHandler("subject")} placeholder="Physics" />
      </Field>
      <Field label="Class level" error={fieldErrors.classLevel}>
        <Input className={dashboardFormControl} value={values.classLevel} onChange={createChangeHandler("classLevel")} placeholder="Class 11–12" />
      </Field>
      <Field label="Mode">
        <select
          value={values.mode}
          onChange={createChangeHandler("mode")}
          className="h-9 w-full rounded-md border border-[#e3e5f5] bg-white px-3 text-sm text-[#101535] outline-none focus-visible:ring-2 focus-visible:ring-[#1e2a78] dark:bg-white dark:text-[#101535]"
        >
          <option value="online">Online</option>
          <option value="in-person">Offline</option>
        </select>
      </Field>
      <Field label="Location" error={fieldErrors.location}>
        <Input className={dashboardFormControl} value={values.location} onChange={createChangeHandler("location")} placeholder="Dhaka, Mirpur" />
      </Field>
      <Field label="Monthly fee (৳)" error={fieldErrors.monthlyFee}>
        <Input className={dashboardFormControl} type="number" min={0} value={values.monthlyFee} onChange={createChangeHandler("monthlyFee")} />
      </Field>
      <Field label="Days per week" error={fieldErrors.daysPerWeek}>
        <Input className={dashboardFormControl} type="number" min={1} max={7} value={values.daysPerWeek} onChange={createChangeHandler("daysPerWeek")} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Description" error={fieldErrors.description}>
          <Textarea className={dashboardFormControl} rows={4} value={values.description} onChange={createChangeHandler("description")} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Banner image" error={fieldErrors.banner}>
          <Input
            className={dashboardFormControl}
            type="file"
            accept="image/*"
            onChange={(event) =>
              setBannerFile(event.target.files?.[0] ?? null)
            }
          />
          {values.bannerUrl && !bannerFile && (
            <p className="text-xs text-slate-500">Current banner kept unless you choose a new file.</p>
          )}
        </Field>
      </div>
      <div className="md:col-span-2">
        <Button
          type="submit"
          disabled={isSaving || disabled}
          className={dashboardPrimaryButton}
        >
          {isSaving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}