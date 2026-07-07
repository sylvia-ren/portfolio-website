import { RoomShell } from "@/components/navigation/room-shell";
import { HomeAtmosphere } from "@/components/motion/ripple/home-ripple-surface";

export default function DarkRooms({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <HomeAtmosphere>
      <RoomShell room="dark">{children}</RoomShell>
    </HomeAtmosphere>
  );
}
