import { Card } from "@/components/ui/card";
import { MockActionButton } from "@/components/social/mock-action-button";
import { UserAvatar } from "@/components/social/user-avatar";
import type { MockUser } from "@/lib/types";

export function PostComposer({ user }: { user: MockUser }) {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <UserAvatar name={user.name} initials={user.avatar} />
        <button
          className="min-h-12 flex-1 rounded-full bg-[#F3F4F6] px-5 text-left text-sm font-bold text-[#1E1E1E]/48"
          type="button"
        >
          ¿Qué está pasando en tu pueblo?
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#1F3D2B12] pt-3">
        <MockActionButton>Foto</MockActionButton>
        <MockActionButton>Actividad</MockActionButton>
        <MockActionButton>Aviso</MockActionButton>
      </div>
    </Card>
  );
}
