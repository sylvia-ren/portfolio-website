import type { Viewport } from "next";
import { RoomShell } from "@/components/navigation/room-shell";

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function PaperRooms({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RoomShell room="paper">{children}</RoomShell>;
}
