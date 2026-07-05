import { RoomShell } from "@/components/navigation/room-shell";

export default function PaperRooms({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RoomShell room="paper">{children}</RoomShell>;
}
