import Image from "next/image";
import { MapPin } from "lucide-react";
import { UserAvatar } from "@/components/social/user-avatar";
import {
  momentSubtypeLabels,
  type ConceptMoment,
} from "@/features/moments/moments-concept-data";
import { momentSubtypeStyles } from "@/features/moments/moment-subtype-style";

export function MomentCard({
  moment,
  onOpen,
}: {
  moment: ConceptMoment;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  const style = momentSubtypeStyles[moment.subtype];
  const Icon = style.icon;

  return (
    <li>
      <button
        aria-label={`Abrir Momento de ejemplo: ${moment.title}`}
        className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[20px] border border-border bg-white text-left shadow-[0_10px_28px_rgba(43,55,38,0.05)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
        type="button"
        onClick={(event) => onOpen(event.currentTarget)}
      >
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#F3F0E9]">
          {moment.image ? (
            <>
              <Image
                alt=""
                aria-hidden="true"
                className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 92vw"
                src={moment.image}
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0E3325]/55 via-transparent to-transparent" />
            </>
          ) : (
            <span
              aria-hidden="true"
              className="grid h-full place-items-center"
              style={{ color: style.accent }}
            >
              <Icon className="size-10 opacity-70" strokeWidth={1.6} />
            </span>
          )}
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-primary shadow-sm">
            Ejemplo
          </span>
          <span
            className={`absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold shadow-sm ${style.badgeClassName}`}
          >
            <Icon aria-hidden="true" className="size-3" />
            {momentSubtypeLabels[moment.subtype]}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 p-3.5">
          <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-text-primary">
            {moment.title}
          </h3>
          <p className="line-clamp-2 flex-1 text-xs leading-5 text-text-muted">{moment.body}</p>
          <div className="mt-1 flex items-center gap-2 border-t border-border pt-2.5">
            <UserAvatar className="size-7 text-[10px]" initials={moment.authorInitials} name={moment.authorName} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold text-text-primary">{moment.authorName}</p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] font-semibold text-text-muted">
                {moment.villageName ? (
                  <>
                    <MapPin aria-hidden="true" className="size-2.5 shrink-0" />
                    <span className="truncate">{moment.villageName}</span>
                    <span aria-hidden="true">·</span>
                  </>
                ) : null}
                <span className="truncate">{moment.timeLabel}</span>
              </p>
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}
