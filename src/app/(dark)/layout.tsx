import { RoomShell } from "@/components/navigation/room-shell";

export default function DarkRooms({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RoomShell room="dark">{children}</RoomShell>;
}
