import Link from "next/link";
import { RoomShell } from "@/components/navigation/room-shell";

export default function NotFound() {
  return (
    <RoomShell room="paper">
      <div className="flex flex-1 flex-col items-center justify-center px-[var(--margin-page)] pb-[var(--space-section)] text-center">
        <p className="text-title">this room does not exist.</p>
        <Link href="/" className="text-label quiet-link mt-[var(--space-block)]">
          return to the entrance
        </Link>
      </div>
    </RoomShell>
  );
}
