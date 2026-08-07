"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlignLeft,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Compass,
  ImageIcon,
  LoaderCircle,
  MapPin,
  Plus,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { activityCategoryLabelKey } from "@/features/activities/activity-category-icon";
import { isUnauthorizedError } from "@/lib/api/client";
import {
  createActivity,
  type CreateActivityPayload,
} from "@/lib/api/activities.service";
import { clearSession, getStoredToken } from "@/lib/api/session";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { isPersistedVillage } from "@/lib/api/entity-capabilities";
import { isRenderableImageUrl } from "@/lib/image-url";
import type { ActivityCategory, Village } from "@/lib/types";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CreateActivityForm({
  categories,
  villages,
}: {
  categories: ActivityCategory[];
  villages: Village[];
}) {
  const router = useRouter();
  const { t } = useTranslations();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const persistentVillages = villages.filter(isPersistedVillage);
  const demoCatalog = villages.some((village) => village.dataSource === "demo");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setSuccess("");

    const token = getStoredToken();

    if (!token) {
      setError(t("activities.createForm.errorAuthRequired"));
      return;
    }

    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const villageId = String(formData.get("villageId") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const date = String(formData.get("date") ?? "").trim();
    const time = String(formData.get("time") ?? "").trim();
    const capacity = Number(formData.get("capacity"));
    const location = String(formData.get("location") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();

    if (!persistentVillages.some((village) => village.id === villageId)) {
      setError(
        demoCatalog
          ? t("activities.createForm.errorDemoVillages")
          : t("activities.createForm.errorVillageInvalid"),
      );
      return;
    }

    if (
      !title ||
      !villageId ||
      !category ||
      !date ||
      !time ||
      !capacity ||
      !location ||
      !description
    ) {
      setError(t("activities.createForm.errorMissingFields"));
      return;
    }

    if (title.length < 2 || title.length > 180) {
      setError(t("activities.createForm.errorTitleLength"));
      return;
    }

    if (description.length < 10) {
      setError(t("activities.createForm.errorDescriptionLength"));
      return;
    }

    if (category.length < 2 || category.length > 80) {
      setError(t("activities.createForm.errorCategoryInvalid"));
      return;
    }

    if (!Number.isInteger(capacity) || capacity < 1) {
      setError(t("activities.createForm.errorCapacityInvalid"));
      return;
    }

    if (location.length < 2 || location.length > 255) {
      setError(t("activities.createForm.errorLocationLength"));
      return;
    }

    const startsAt = new Date(`${date}T${time}:00`);

    if (Number.isNaN(startsAt.getTime()) || startsAt.getTime() <= new Date().getTime()) {
      setError(t("activities.createForm.errorDateTimeFuture"));
      return;
    }

    if (imageUrl) {
      try {
        const parsedImageUrl = new URL(imageUrl);
        if (!["http:", "https:"].includes(parsedImageUrl.protocol)) throw new Error();
      } catch {
        setError(t("activities.createForm.errorImageUrlInvalid"));
        return;
      }

      if (!isRenderableImageUrl(imageUrl)) {
        setError(t("activities.createForm.errorImageOriginNotAllowed"));
        return;
      }
    }

    const slugSuffix =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID().slice(0, 8)
        : `${title.length}-${capacity}`;

    const payload: CreateActivityPayload = {
      slug: `${slugify(title).slice(0, 151)}-${slugSuffix}`,
      title,
      description,
      village_id: villageId,
      category,
      image_url: imageUrl || null,
      starts_at: `${date}T${time}:00`,
      capacity,
      location,
      status: "published",
    };

    try {
      setIsSubmitting(true);
      const response = await createActivity(payload, token);
      const id = typeof response.id === "string" ? response.id : payload.slug;

      if (demoCatalog) {
        setSuccess(t("activities.createForm.successDemo"));
        form.reset();
      } else {
        setSuccess(t("activities.createForm.successReal"));
        router.push(`/activities/${id}`);
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        clearSession();
        setError(t("activities.createForm.errorSessionExpired"));
      } else {
        setError(
          getApiErrorMessage(
            error,
            t,
            t("activities.createForm.fallbackError"),
          ),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <fieldset className="grid gap-5">
        <legend className="mb-4 flex items-center gap-3 text-lg font-extrabold tracking-[-0.02em] text-[#18231D]">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#D7A63C24] text-[#7A5B16]">
            <Sparkles aria-hidden="true" className="size-4.5" />
          </span>
          {t("activities.createForm.sectionEssentials")}
        </legend>

        <div>
          <label className="label" htmlFor="title">
            {t("activities.createForm.titleLabel")}
          </label>
          <div className="relative">
            <Sparkles
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#60818A]"
            />
            <input
              autoComplete="off"
              className="field field-with-icon"
              id="title"
              maxLength={180}
              minLength={2}
              name="title"
              placeholder={t("activities.createForm.titlePlaceholder")}
              required
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="village">
              {t("activities.createForm.villageLabel")}
            </label>
            <div className="relative">
              <MapPin
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 z-10 size-4.5 -translate-y-1/2 text-[#60818A]"
              />
              <select
                className="field field-with-icon appearance-none pr-10"
                defaultValue=""
                id="village"
                name="villageId"
                required
              >
                <option value="" disabled>
                  {t("activities.createForm.villagePlaceholder")}
                </option>
                {persistentVillages.map((village) => (
                  <option key={village.id} value={village.id}>
                    {village.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#677168]"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="category">
              {t("activities.createForm.categoryLabel")}
            </label>
            <div className="relative">
              <Compass
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 z-10 size-4.5 -translate-y-1/2 text-[#60818A]"
              />
              <select
                className="field field-with-icon appearance-none pr-10"
                defaultValue=""
                id="category"
                name="category"
                required
              >
                <option value="" disabled>
                  {t("activities.createForm.categoryPlaceholder")}
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {t(activityCategoryLabelKey(category))}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#677168]"
              />
            </div>
          </div>
        </div>
      </fieldset>

      <div className="h-px bg-[#184B3414]" />

      <fieldset className="grid gap-5">
        <legend className="mb-4 flex items-center gap-3 text-lg font-extrabold tracking-[-0.02em] text-[#18231D]">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#60818A1f] text-[#355E68]">
            <CalendarDays aria-hidden="true" className="size-4.5" />
          </span>
          {t("activities.createForm.sectionSchedule")}
        </legend>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="label" htmlFor="date">
              {t("activities.createForm.dateLabel")}
            </label>
            <div className="relative">
              <CalendarDays
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#60818A]"
              />
              <input
                className="field field-with-icon"
                id="date"
                name="date"
                required
                type="date"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="time">
              {t("activities.createForm.timeLabel")}
            </label>
            <div className="relative">
              <Clock3
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#60818A]"
              />
              <input
                className="field field-with-icon"
                id="time"
                name="time"
                required
                type="time"
              />
            </div>
          </div>

          <div className="sm:col-span-2 xl:col-span-1">
            <label className="label" htmlFor="capacity">
              {t("activities.createForm.capacityLabel")}
            </label>
            <div className="relative">
              <UsersRound
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#60818A]"
              />
              <input
                className="field field-with-icon"
                id="capacity"
                min="1"
                name="capacity"
                placeholder={t("activities.createForm.capacityPlaceholder")}
                required
                step="1"
                type="number"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="location">
            {t("activities.createForm.locationLabel")}
          </label>
          <div className="relative">
            <MapPin
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#60818A]"
            />
            <input
              autoComplete="street-address"
              className="field field-with-icon"
              id="location"
              maxLength={255}
              minLength={2}
              name="location"
              placeholder={t("activities.createForm.locationPlaceholder")}
              required
            />
          </div>
        </div>
      </fieldset>

      <div className="h-px bg-[#184B3414]" />

      <fieldset>
        <legend className="mb-4 flex items-center gap-3 text-lg font-extrabold tracking-[-0.02em] text-[#18231D]">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#78947D1f] text-[#42614A]">
            <AlignLeft aria-hidden="true" className="size-4.5" />
          </span>
          {t("activities.createForm.sectionContent")}
        </legend>
        <label className="label" htmlFor="description">
          {t("activities.createForm.descriptionLabel")}
        </label>
        <textarea
          className="field min-h-40 resize-y leading-6"
          id="description"
          minLength={10}
          name="description"
          placeholder={t("activities.createForm.descriptionPlaceholder")}
          required
        />
        <p className="mt-2 text-xs leading-5 text-[#677168]">
          {t("activities.createForm.descriptionHint")}
        </p>

        <div className="mt-5">
          <label className="label" htmlFor="activity-image-url">
            {t("activities.createForm.imageUrlLabel")}{" "}
            <span className="text-xs font-semibold text-[#677168]">
              {t("activities.createForm.imageUrlOptional")}
            </span>
          </label>
          <div className="relative">
            <ImageIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#60818A]"
            />
            <input
              className="field field-with-icon"
              id="activity-image-url"
              inputMode="url"
              name="imageUrl"
              placeholder={t("activities.createForm.imageUrlPlaceholder")}
              type="url"
            />
          </div>
        </div>
      </fieldset>

      {error ? (
        <div
          className="flex items-start gap-3 rounded-2xl border border-[#C96D4A38] bg-[#C96D4A12] p-4 text-sm font-bold leading-6 text-[#87442F]"
          role="alert"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      {demoCatalog ? (
        <div
          className="flex items-start gap-3 rounded-2xl border border-[#D7A63C45] bg-[#FFF8E8] p-4 text-sm font-bold leading-6 text-[#72551C]"
          role="status"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{t("activities.createForm.demoCatalogNotice")}</p>
        </div>
      ) : null}

      {success ? (
        <div
          className="flex items-start gap-3 rounded-2xl border border-[#347A4838] bg-[#347A4812] p-4 text-sm font-bold leading-6 text-[#245B36]"
          role="status"
        >
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{success}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-[#184B3414] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-[#677168]">
          {t("activities.createForm.footerNote")}
        </p>
        <Button className="min-w-48" disabled={isSubmitting || !persistentVillages.length} type="submit">
          {isSubmitting ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Plus aria-hidden="true" className="size-4" />
          )}
          {isSubmitting
            ? t("activities.createForm.submitting")
            : t("activities.createForm.submit")}
        </Button>
      </div>
    </form>
  );
}
