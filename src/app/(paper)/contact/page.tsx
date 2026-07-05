import { getSite } from "@/lib/content";
import { Room } from "@/components/presentation/room";

export const metadata = { title: "contact" };

export default function Contact() {
  const site = getSite();

  return (
    <Room title="contact">
      <a href={`mailto:${site.email}`} className="text-title quiet-link">
        {site.email}
      </a>
    </Room>
  );
}
